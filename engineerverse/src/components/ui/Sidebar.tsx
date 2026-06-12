"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Zap,
  LayoutDashboard,
  Code2,
  User,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: Code2 },
  { label: "My Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-default)] transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        } ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-default)]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-gradient">EngineerVerse</span>
            )}
          </Link>
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="hidden lg:flex p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                collapsed ? "" : "rotate-180"
              }`}
            />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action */}
        <div className="px-3 mt-4 mb-2">
          <Link
            href="/projects/new"
            className={`btn-primary w-full rounded-xl text-sm ${
              collapsed ? "px-0 justify-center" : ""
            }`}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>New Project</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/20"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="px-3 py-4 border-t border-[var(--border-default)]">
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`flex items-center gap-3 w-full px-3 py-2 mt-1 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-all ${
              collapsed ? "justify-center px-0" : ""
            }`}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
