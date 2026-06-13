import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyOTP } from "@/lib/otp";
import { rateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // Rate limit: max 10 verification requests per IP per minute
  const limitResult = rateLimit(ip, 10, 60 * 1000);
  if (!limitResult.success) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${limitResult.reset}s.` },
      { status: 429 }
    );
  }

  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, type } = body;

    if (!code || (type !== "EMAIL" && type !== "SMS")) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const target = type === "EMAIL" ? user.email : user.phone;
    if (!target) {
      return NextResponse.json({ error: "Target contact details not found" }, { status: 400 });
    }

    const isValid = await verifyOTP(target, code, type);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    // Mark verified in database
    if (type === "EMAIL") {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      message: `${type === "EMAIL" ? "Email" : "Phone"} verified successfully!`,
    });
  } catch (error) {
    console.error("Verify OTP API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
