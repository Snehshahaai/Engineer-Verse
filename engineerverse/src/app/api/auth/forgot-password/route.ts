import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP, sendEmailOTP } from "@/lib/otp";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // Rate limit: max 5 requests per IP per minute
  const limitResult = rateLimit(ip, 5, 60 * 1000);
  if (!limitResult.success) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${limitResult.reset}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check user existence
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    const code = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save/Upsert code
    await prisma.verificationCode.upsert({
      where: {
        target_code_type: {
          target: trimmedEmail,
          code,
          type: "PASSWORD_RESET",
        },
      },
      create: {
        target: trimmedEmail,
        code,
        type: "PASSWORD_RESET",
        expires,
      },
      update: {
        expires,
      },
    });

    // Send code
    const sent = await sendEmailOTP(trimmedEmail, code);
    if (!sent) {
      return NextResponse.json({ error: "Failed to send reset code" }, { status: 500 });
    }

    const isMock = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "placeholder";

    return NextResponse.json({
      success: true,
      message: "Reset code sent successfully",
      devCode: isMock ? code : undefined,
    });
  } catch (error) {
    console.error("Forgot password API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
