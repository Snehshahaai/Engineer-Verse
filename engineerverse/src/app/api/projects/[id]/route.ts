import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            college: true,
            branch: true,
          },
        },
        tags: true,
        images: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        forkedFrom: {
          select: { id: true, title: true, user: { select: { name: true } } },
        },
        _count: { select: { likes: true, comments: true, forks: true } },
        ...(session?.user?.id
          ? {
              likes: {
                where: { userId: session.user.id },
                select: { id: true },
              },
            }
          : {}),
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...project,
      isLiked: (project as unknown as { likes: unknown[] }).likes?.length > 0,
      likes: undefined,
    });
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, longDescription, githubUrl, liveUrl, tags } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        longDescription: longDescription ?? undefined,
        githubUrl: githubUrl ?? undefined,
        liveUrl: liveUrl ?? undefined,
        ...(tags
          ? {
              tags: {
                set: [],
                connectOrCreate: tags.map((tag: string) => ({
                  where: { name: tag.toLowerCase().trim() },
                  create: { name: tag.toLowerCase().trim() },
                })),
              },
            }
          : {}),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        tags: true,
        images: true,
        _count: { select: { likes: true, comments: true, forks: true } },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!project) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
