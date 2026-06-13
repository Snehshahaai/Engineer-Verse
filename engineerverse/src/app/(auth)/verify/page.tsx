"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, ShieldCheck, ArrowRight, Zap, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneConfigured, setPhoneConfigured] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);

  const [emailOtp, setEmailOtp] = useState<string[]>(Array(6).fill(""));
  const [smsOtp, setSmsOtp] = useState<string[]>(Array(6).fill(""));

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [smsOtpSent, setSmsOtpSent] = useState(false);

  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingSMS, setVerifyingSMS] = useState(false);

  const emailRefs = useRef<(HTMLInputElement | null)[]>([]);
  const smsRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch current user status
  const fetchUserStatus = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setEmailVerified(!!data.emailVerified);
        setPhoneVerified(!!data.phoneVerified);
        setPhoneConfigured(!!data.phone);
        setUserEmail(data.email || "");
        setUserPhone(data.phone || "");

        // If both are verified (or if email verified and phone is not even configured)
        if (data.emailVerified && (data.phoneVerified || !data.phone)) {
          toast.success("All verified! Redirecting...");
          // Refresh session to get correct tokens
          await update();
          router.push("/dashboard");
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to sync verification status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      Promise.resolve().then(() => {
        fetchUserStatus();
      });
    }
  }, [status]);

  const handleSendOTP = async (type: "EMAIL" | "SMS") => {
    const setSending = type === "EMAIL" ? setSendingEmail : setSendingSMS;
    const setSent = type === "EMAIL" ? setEmailOtpSent : setSmsOtpSent;
    setSending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();

      if (res.ok) {
        setSent(true);
        toast.success(`Verification code sent!`);
        if (data.devCode) {
          // Expose to user in dev mode
          toast(`[Dev Helper] Code is: ${data.devCode}`, {
            duration: 8000,
            icon: "🔑",
            style: {
              background: "#13131a",
              color: "#00cec9",
              border: "1px solid #2a2a3a",
            },
          });
        }
      } else {
        toast.error(data.error || "Failed to send code");
      }
    } catch {
      toast.error("Network error sending code");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOTP = async (type: "EMAIL" | "SMS") => {
    const code = type === "EMAIL" ? emailOtp.join("") : smsOtp.join("");
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    const setVerifying = type === "EMAIL" ? setVerifyingEmail : setVerifyingSMS;
    setVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, type }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`${type === "EMAIL" ? "Email" : "Phone"} verified successfully!`);
        if (type === "EMAIL") {
          setEmailVerified(true);
        } else {
          setPhoneVerified(true);
        }
        // Sync status
        fetchUserStatus();
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch {
      toast.error("Network error verifying code");
    } finally {
      setVerifying(false);
    }
  };

  const handleInputChange = (
    value: string,
    index: number,
    type: "EMAIL" | "SMS"
  ) => {
    const otp = type === "EMAIL" ? emailOtp : smsOtp;
    const setOtp = type === "EMAIL" ? setEmailOtp : setSmsOtp;
    const refs = type === "EMAIL" ? emailRefs : smsRefs;

    // Filter out non-numeric entries
    const digit = value.slice(-1);
    if (digit && isNaN(Number(digit))) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    type: "EMAIL" | "SMS"
  ) => {
    const otp = type === "EMAIL" ? emailOtp : smsOtp;
    const setOtp = type === "EMAIL" ? setEmailOtp : setSmsOtp;
    const refs = type === "EMAIL" ? emailRefs : smsRefs;

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        refs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Checking verification status...</p>
        </div>
      </div>
    );
  }

  const bothVerified = emailVerified && (phoneVerified || !phoneConfigured);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4 animate-scale-in">
        <div className="glass-strong rounded-2xl p-8 border border-[var(--border-default)]">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">EngineerVerse</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
              Account Verification
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Complete verification to secure your account and proceed
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1: Email Verification */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                emailVerified
                  ? "bg-[var(--success)]/5 border-[var(--success)]/20"
                  : "bg-[var(--bg-tertiary)] border-[var(--border-default)]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      emailVerified
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : "bg-[var(--bg-hover)] text-[var(--primary-light)]"
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                      Email Address Verification
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">{userEmail}</p>
                  </div>
                </div>
                {emailVerified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              {!emailVerified && (
                <div className="space-y-4">
                  {!emailOtpSent ? (
                    <button
                      onClick={() => handleSendOTP("EMAIL")}
                      disabled={sendingEmail}
                      className="btn-secondary w-full text-sm py-2.5 flex items-center justify-center gap-2"
                    >
                      {sendingEmail ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        "Send Verification Code"
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between gap-2">
                        {emailOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              emailRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleInputChange(e.target.value, idx, "EMAIL")
                            }
                            onKeyDown={(e) => handleKeyDown(e, idx, "EMAIL")}
                            className="w-12 h-12 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-default)] text-center text-xl font-bold text-[var(--text-primary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <button
                          onClick={() => handleSendOTP("EMAIL")}
                          disabled={sendingEmail}
                          className="text-[var(--primary-light)] hover:underline flex items-center gap-1"
                        >
                          Resend Code
                        </button>
                        <button
                          onClick={() => handleVerifyOTP("EMAIL")}
                          disabled={verifyingEmail}
                          className="btn-primary px-5 py-2 text-xs"
                        >
                          {verifyingEmail ? "Verifying..." : "Verify Code"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Phone Verification (Only if phone number was entered during register) */}
            {phoneConfigured && (
              <div
                className={`p-5 rounded-xl border transition-all ${
                  phoneVerified
                    ? "bg-[var(--success)]/5 border-[var(--success)]/20"
                    : "bg-[var(--bg-tertiary)] border-[var(--border-default)]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        phoneVerified
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : "bg-[var(--bg-hover)] text-[var(--secondary)]"
                      }`}
                    >
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                        SMS/Mobile Verification
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">{userPhone}</p>
                    </div>
                  </div>
                  {phoneVerified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>

                {!phoneVerified && (
                  <div className="space-y-4">
                    {!smsOtpSent ? (
                      <button
                        onClick={() => handleSendOTP("SMS")}
                        disabled={sendingSMS}
                        className="btn-secondary w-full text-sm py-2.5 flex items-center justify-center gap-2"
                      >
                        {sendingSMS ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          "Send Verification Code"
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between gap-2">
                          {smsOtp.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                smsRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleInputChange(e.target.value, idx, "SMS")
                              }
                              onKeyDown={(e) => handleKeyDown(e, idx, "SMS")}
                              className="w-12 h-12 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-default)] text-center text-xl font-bold text-[var(--text-primary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-xs mt-1">
                          <button
                            onClick={() => handleSendOTP("SMS")}
                            disabled={sendingSMS}
                            className="text-[var(--primary-light)] hover:underline flex items-center gap-1"
                          >
                            Resend Code
                          </button>
                          <button
                            onClick={() => handleVerifyOTP("SMS")}
                            disabled={verifyingSMS}
                            className="btn-primary px-5 py-2 text-xs"
                          >
                            {verifyingSMS ? "Verifying..." : "Verify Code"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Dashboard Redirect */}
            {bothVerified && (
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-semibold shadow-glow-primary transition-all duration-300 transform hover:scale-[1.01]"
              >
                Proceed to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:underline"
              >
                Sign out of this session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
