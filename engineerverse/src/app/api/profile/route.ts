import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phone: true,
        phoneVerified: true,
        image: true,
        bio: true,
        college: true,
        branch: true,
        year: true,
        github: true,
        linkedin: true,
        resumeUrl: true,
        portfolioUrl: true,
        createdAt: true,
        skills: {
          orderBy: { category: "asc" },
        },
        projects: {
          orderBy: { createdAt: "desc" },
          include: {
            tags: true,
            _count: { select: { likes: true, comments: true } },
          },
        },
        _count: {
          select: { projects: true, skills: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, college, branch, year, phone, github, linkedin, portfolioUrl } = body;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true },
    });

    const isPhoneChanged = phone !== undefined && phone !== currentUser?.phone;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        bio: bio || null,
        college: college || null,
        branch: branch || null,
        year: year || null,
        phone: phone !== undefined ? (phone || null) : undefined,
        phoneVerified: isPhoneChanged ? null : undefined,
        github: github || null,
        linkedin: linkedin || null,
        portfolioUrl: portfolioUrl || null,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
