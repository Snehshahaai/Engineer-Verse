import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const originalProject = await prisma.project.findUnique({
      where: { id },
      include: { tags: true, images: true },
    });

    if (!originalProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const forkedProject = await prisma.project.create({
      data: {
        title: `${originalProject.title} (Fork)`,
        description: originalProject.description,
        longDescription: originalProject.longDescription,
        githubUrl: null,
        liveUrl: null,
        userId: session.user.id,
        forkedFromId: id,
        tags: {
          connect: originalProject.tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        tags: true,
        images: true,
        _count: { select: { likes: true, comments: true, forks: true } },
      },
    });

    return NextResponse.json(forkedProject, { status: 201 });
  } catch (error) {
    console.error("Fork error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
