import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAndSendOTP } from "@/lib/otp";
import { rateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";

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

  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type } = body;

    if (type !== "EMAIL" && type !== "SMS") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const target = type === "EMAIL" ? user.email : user.phone;
    if (!target) {
      return NextResponse.json(
        { error: `Please configure a ${type === "EMAIL" ? "email" : "phone number"} on your account.` },
        { status: 400 }
      );
    }

    const result = await createAndSendOTP(target, type);
    if (!result.success) {
      return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
    }

    // In development mode, we expose the code so the frontend can show a developer help toast
    const isMock =
      type === "EMAIL"
        ? !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "placeholder"
        : !process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === "placeholder";

    return NextResponse.json({
      success: true,
      message: `Code sent successfully to ${target}`,
      devCode: isMock ? result.code : undefined,
    });
  } catch (error) {
    console.error("Send OTP API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
