"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Sidebar />
        <main className="lg:pl-64 min-h-screen transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
