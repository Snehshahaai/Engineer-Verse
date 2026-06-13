"use client";

import Sidebar from "@/components/ui/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkVerification() {
      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (status === "authenticated") {
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const data = await res.json();
            const emailVerified = !!data.emailVerified;
            const phoneVerified = !!data.phoneVerified;
            const phoneConfigured = !!data.phone;

            if (!emailVerified || (phoneConfigured && !phoneVerified)) {
              router.push("/verify");
            } else {
              setChecking(false);
            }
          } else {
            setChecking(false);
          }
        } catch {
          setChecking(false);
        }
      }
    }
    checkVerification();
  }, [status]);

  if (status === "loading" || checking) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Checking security status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContent>{children}</DashboardContent>;
}
