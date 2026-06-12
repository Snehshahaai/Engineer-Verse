import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        college: true,
        branch: true,
        year: true,
        github: true,
        linkedin: true,
        portfolioUrl: true,
        createdAt: true,
        skills: { orderBy: { category: "asc" } },
        projects: {
          orderBy: { createdAt: "desc" },
          include: {
            tags: true,
            images: true,
            _count: { select: { likes: true, comments: true, forks: true } },
          },
        },
        _count: { select: { projects: true, skills: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Public profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
