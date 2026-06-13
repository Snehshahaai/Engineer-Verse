import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // Rate limit: max 10 verification attempts per IP per minute
  const limitResult = rateLimit(ip, 10, 60 * 1000);
  if (!limitResult.success) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${limitResult.reset}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query database for code match
    const record = await prisma.verificationCode.findFirst({
      where: {
        target: trimmedEmail,
        code: code.trim(),
        type: "PASSWORD_RESET",
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    // Expiry check
    if (new Date() > record.expires) {
      return NextResponse.json({ error: "Reset code has expired" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Verify reset code API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
