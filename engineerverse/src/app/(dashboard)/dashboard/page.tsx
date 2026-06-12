"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Code2,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Plus,
  Sparkles,
  Rocket,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const quickActions = [
    {
      title: "Create Project",
      description: "Showcase your latest work",
      icon: Plus,
      href: "/projects/new",
      gradient: "from-[#6c5ce7] to-[#a29bfe]",
    },
    {
      title: "Browse Projects",
      description: "Discover community projects",
      icon: Code2,
      href: "/projects",
      gradient: "from-[#00cec9] to-[#55efc4]",
    },
    {
      title: "Edit Profile",
      description: "Complete your profile",
      icon: Users,
      href: "/profile/edit",
      gradient: "from-[#fd79a8] to-[#fdcbdd]",
    },
  ];

  const upcomingFeatures = [
    { name: "Skill Tree", description: "Track & gamify your learning", icon: TrendingUp },
    { name: "Team Finder", description: "Find project teammates", icon: Users },
    { name: "Viva Simulator", description: "Practice exam questions", icon: Star },
    { name: "AI Mentor", description: "Personalized guidance", icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 via-[var(--bg-secondary)] to-[var(--secondary)]/20 border border-[var(--border-default)] p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--secondary)]/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-5 h-5 text-[var(--primary-light)]" />
            <span className="text-xs font-medium text-[var(--primary-light)] uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Engineer"} 👋
          </h1>
          <p className="text-[var(--text-secondary)] max-w-lg">
            Ready to build something amazing today? Start by creating a project
            or exploring what the community has been building.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] card-hover"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {action.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary-light)] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Projects", value: "0", icon: Code2, color: "var(--primary)" },
          { label: "Skills", value: "0", icon: TrendingUp, color: "var(--secondary)" },
          { label: "Likes", value: "0", icon: Star, color: "var(--warning)" },
          { label: "Profile Views", value: "0", icon: Users, color: "var(--accent)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          >
            <stat.icon
              className="w-5 h-5 mb-3"
              style={{ color: stat.color }}
            />
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {stat.value}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Coming Soon 🚀
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature.name}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] opacity-70"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {feature.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </div>
              <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)] border border-[var(--primary)]/20">
                Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
