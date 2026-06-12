import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const sort = searchParams.get("sort") || "recent";

    const session = await auth();
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    const orderBy: Record<string, unknown> =
      sort === "popular"
        ? { likes: { _count: "desc" } }
        : { createdAt: "desc" };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          tags: true,
          images: true,
          _count: {
            select: { likes: true, comments: true, forks: true },
          },
          ...(session?.user?.id
            ? {
                likes: {
                  where: { userId: session.user.id },
                  select: { id: true },
                },
              }
            : {}),
        },
      }),
      prisma.project.count({ where }),
    ]);

    const projectsWithLiked = projects.map((project) => ({
      ...project,
      isLiked: (project as unknown as { likes: unknown[] }).likes?.length > 0,
      likes: undefined,
    }));

    return NextResponse.json({
      projects: projectsWithLiked,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, longDescription, githubUrl, liveUrl, tags, images } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        longDescription: longDescription || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        userId: session.user.id,
        tags: {
          connectOrCreate: (tags || []).map((tag: string) => ({
            where: { name: tag.toLowerCase().trim() },
            create: { name: tag.toLowerCase().trim() },
          })),
        },
        images: {
          create: (images || []).map((url: string) => ({ url })),
        },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        tags: true,
        images: true,
        _count: { select: { likes: true, comments: true, forks: true } },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
