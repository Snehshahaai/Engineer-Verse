import prisma from "@/lib/prisma";

// Generate a random 6-digit numeric string
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a phone number formatter to ensure E.164 standard
export function formatPhoneNumber(phone: string): string {
  const formatted = phone.trim();
  // If it's a 10-digit number, prepend +91 (default to India)
  if (/^\d{10}$/.test(formatted)) {
    return `+91${formatted}`;
  }
  if (formatted && !formatted.startsWith("+")) {
    return `+${formatted}`;
  }
  return formatted;
}

// Send Email OTP using Resend (supports mock fallback)
export async function sendEmailOTP(email: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "placeholder") {
    // Development fallback
    console.log(`\n==========================================`);
    console.log(`[DEVELOPMENT MOCK EMAIL OTP]`);
    console.log(`To: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log(`==========================================\n`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "EngineerVerse <onboarding@resend.dev>",
        to: email,
        subject: "Verify your EngineerVerse Account",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #0a0a0f; color: #e8e8f0;">
            <h2 style="color: #6c5ce7; font-weight: bold; text-align: center;">EngineerVerse</h2>
            <p style="font-size: 16px; line-height: 1.5;">Welcome to EngineerVerse! Please verify your account by using the 6-digit verification code below:</p>
            <div style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 4px; padding: 15px; background-color: #13131a; border: 1px solid #2a2a3a; border-radius: 8px; margin: 20px 0; color: #00cec9;">
              ${code}
            </div>
            <p style="font-size: 14px; color: #8888a0; line-height: 1.5;">This code will expire in 10 minutes. If you did not request this code, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to send email OTP via Resend:", error);
    return false;
  }
}

// Send SMS OTP using Twilio API (supports mock fallback)
export async function sendSMSOTP(phone: string, code: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const fromNum = process.env.TWILIO_PHONE_NUMBER;

  const formattedPhone = formatPhoneNumber(phone);

  if (!sid || !token || !fromNum || sid === "placeholder") {
    // Development fallback
    console.log(`\n==========================================`);
    console.log(`[DEVELOPMENT MOCK SMS OTP]`);
    console.log(`To: ${formattedPhone}`);
    console.log(`Verification Code: ${code}`);
    console.log(`==========================================\n`);
    return true;
  }

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({
          From: fromNum,
          To: formattedPhone,
          Body: `Your EngineerVerse verification code is: ${code}. Valid for 10 minutes.`,
        }),
      }
    );
    return res.ok;
  } catch (error) {
    console.error("Failed to send SMS OTP via Twilio:", error);
    return false;
  }
}

// Generate, save and send code
export async function createAndSendOTP(
  target: string,
  type: "EMAIL" | "SMS"
): Promise<{ success: boolean; code?: string }> {
  const code = generateOTP();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  const finalTarget = type === "SMS" ? formatPhoneNumber(target) : target.trim();

  try {
    // Upsert code to verify
    await prisma.verificationCode.upsert({
      where: {
        target_code_type: {
          target: finalTarget,
          code,
          type,
        },
      },
      create: {
        target: finalTarget,
        code,
        type,
        expires,
      },
      update: {
        expires,
      },
    });

    let sent = false;
    if (type === "EMAIL") {
      sent = await sendEmailOTP(finalTarget, code);
    } else {
      sent = await sendSMSOTP(finalTarget, code);
    }

    return { success: sent, code };
  } catch (error) {
    console.error("Failed to create or send OTP:", error);
    return { success: false };
  }
}

// Verify a code and delete it if correct and not expired
export async function verifyOTP(
  target: string,
  code: string,
  type: "EMAIL" | "SMS"
): Promise<boolean> {
  const finalTarget = type === "SMS" ? formatPhoneNumber(target) : target.trim();

  try {
    const record = await prisma.verificationCode.findFirst({
      where: {
        target: finalTarget,
        code,
        type,
      },
    });

    if (!record) return false;

    // Check expiration
    if (new Date() > record.expires) {
      await prisma.verificationCode.delete({ where: { id: record.id } });
      return false;
    }

    // Success, delete verification record
    await prisma.verificationCode.delete({ where: { id: record.id } });
    return true;
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return false;
  }
}
