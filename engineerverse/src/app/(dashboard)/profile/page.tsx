"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Globe,
  Code2,
  Edit3,
  Calendar,
  BookOpen,
  Star,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { getInitials, formatDate } from "@/lib/utils";
import { SKILL_CATEGORIES } from "@/lib/utils";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  college: string | null;
  branch: string | null;
  year: string | null;
  github: string | null;
  linkedin: string | null;
  portfolioUrl: string | null;
  createdAt: string;
  skills: { id: string; name: string; category: string; level: number }[];
  projects: {
    id: string;
    title: string;
    description: string;
    tags: { name: string }[];
    _count: { likes: number; comments: number };
    createdAt: string;
  }[];
  _count: { projects: number; skills: number };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchProfile();
  }, [session]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-2xl bg-[var(--bg-secondary)]" />
        <div className="h-32 rounded-2xl bg-[var(--bg-secondary)]" />
        <div className="h-32 rounded-2xl bg-[var(--bg-secondary)]" />
      </div>
    );
  }

  const user = profile || ({
    id: "",
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    image: session?.user?.image || null,
    bio: null,
    college: null,
    branch: null,
    year: null,
    github: null,
    linkedin: null,
    portfolioUrl: null,
    createdAt: new Date().toISOString(),
    skills: [],
    projects: [],
    _count: { projects: 0, skills: 0 },
  } as ProfileData);

  // Group skills by category
  const skillsByCategory: Record<string, typeof user.skills> = {};
  (user.skills || []).forEach((skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });

  // Calculate profile completion
  const fields = [user.name, user.bio, user.college, user.branch, user.year, user.github, user.linkedin];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="relative rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-hidden">
        {/* Banner Gradient */}
        <div className="h-32 bg-gradient-to-br from-[var(--primary)]/30 via-[var(--bg-secondary)] to-[var(--secondary)]/30" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-16 flex items-end justify-between mb-4">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-3xl font-bold border-4 border-[var(--bg-secondary)] shadow-lg">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ""}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <Link
              href="/profile/edit"
              className="btn-secondary text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>

          {/* Info */}
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {user.name || "Your Name"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            {user.email}
          </p>

          {user.bio && (
            <p className="text-[var(--text-primary)] mt-3 text-sm leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
            {user.college && (
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                {user.college}
              </span>
            )}
            {user.branch && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {user.branch}
              </span>
            )}
            {user.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {user.year}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined {formatDate(user.createdAt)}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 mt-4">
            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            )}
            {user.portfolioUrl && (
              <a
                href={user.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[var(--border-default)]">
            <div>
              <div className="text-xl font-bold text-[var(--text-primary)]">
                {user._count?.projects || 0}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Projects</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--text-primary)]">
                {user._count?.skills || 0}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Skills</div>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--text-secondary)]">Profile</span>
                <div className="w-24 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--primary-light)]">
                  {completion}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--warning)]" />
            Skills
          </h2>
          <Link href="/profile/edit" className="text-xs text-[var(--primary-light)] hover:underline">
            Manage Skills
          </Link>
        </div>

        {Object.keys(skillsByCategory).length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              No skills added yet.{" "}
              <Link href="/profile/edit" className="text-[var(--primary-light)] hover:underline">
                Add your first skill
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]"
                    >
                      <span className="text-sm text-[var(--text-primary)]">
                        {skill.name}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < skill.level
                                ? "bg-[var(--primary-light)]"
                                : "bg-[var(--border-default)]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[var(--primary-light)]" />
            Projects
          </h2>
          <Link href="/projects/new" className="btn-primary text-xs px-3 py-1.5">
            <Code2 className="w-3 h-3" />
            New Project
          </Link>
        </div>

        {(user.projects || []).length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-3">
              <Code2 className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              No projects yet.{" "}
              <Link href="/projects/new" className="text-[var(--primary-light)] hover:underline">
                Create your first project
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] card-hover"
              >
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag.name}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)] border border-[var(--primary)]/20"
                    >
                      {tag.name}
                    </span>
                  ))}
                  <span className="text-xs text-[var(--text-muted)] ml-auto">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
