import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // Rate limit: max 10 reset attempts per IP per minute
  const limitResult = rateLimit(ip, 10, 60 * 1000);
  if (!limitResult.success) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${limitResult.reset}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { email, code, password, confirmPassword } = body;

    if (!email || !code || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check verification code
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
      await prisma.verificationCode.delete({ where: { id: record.id } });
      return NextResponse.json({ error: "Reset code has expired" }, { status: 400 });
    }

    // Code is valid! Update the user password
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: trimmedEmail },
      data: { password: hashedPassword },
    });

    // Delete verification record
    await prisma.verificationCode.delete({ where: { id: record.id } });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
