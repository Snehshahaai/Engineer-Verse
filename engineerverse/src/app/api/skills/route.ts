import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      where: { userId: session.user.id },
      orderBy: { category: "asc" },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Skills fetch error:", error);
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
    const { name, category, level } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    // Check for duplicate
    const existing = await prisma.skill.findUnique({
      where: {
        userId_name: {
          userId: session.user.id,
          name,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "You already have this skill" }, { status: 409 });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level: Math.min(Math.max(level || 1, 1), 5),
        userId: session.user.id,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Skill create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    // Verify ownership
    const skill = await prisma.skill.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    await prisma.skill.delete({ where: { id } });

    return NextResponse.json({ message: "Skill deleted" });
  } catch (error) {
    console.error("Skill delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
