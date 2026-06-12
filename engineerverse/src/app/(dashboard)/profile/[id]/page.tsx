"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Globe,
  Code2,
  Calendar,
  BookOpen,
  Star,
  ArrowLeft,
  Heart,
  MessageSquare,
  GitFork,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { getInitials, formatDate } from "@/lib/utils";

interface PublicProfile {
  id: string;
  name: string | null;
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
    images: { url: string }[];
    _count: { likes: number; comments: number; forks: number };
    createdAt: string;
  }[];
  _count: { projects: number; skills: number };
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${id}`);
        if (res.ok) {
          setProfile(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 rounded-2xl bg-[var(--bg-secondary)]" />
        <div className="h-32 rounded-2xl bg-[var(--bg-secondary)]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">User not found</h2>
        <button onClick={() => router.back()} className="btn-secondary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  // Group skills by category
  const skillsByCategory: Record<string, typeof profile.skills> = {};
  profile.skills.forEach((skill) => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Header */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-[var(--primary)]/30 via-[var(--bg-secondary)] to-[var(--secondary)]/30" />
        <div className="px-6 pb-6">
          <div className="-mt-16 mb-4">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-3xl font-bold border-4 border-[var(--bg-secondary)] shadow-lg">
              {profile.image ? (
                <img src={profile.image} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                getInitials(profile.name)
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{profile.name}</h1>
          {profile.bio && <p className="text-[var(--text-secondary)] mt-2 text-sm">{profile.bio}</p>}

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
            {profile.college && <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" />{profile.college}</span>}
            {profile.branch && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{profile.branch}</span>}
            {profile.year && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{profile.year}</span>}
          </div>

          <div className="flex items-center gap-3 mt-4">
            {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"><GitHubIcon className="w-4 h-4" /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"><LinkedInIcon className="w-4 h-4" /></a>}
            {profile.portfolioUrl && <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"><Globe className="w-4 h-4" /></a>}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[var(--border-default)]">
            <div>
              <div className="text-xl font-bold text-[var(--text-primary)]">{profile._count.projects}</div>
              <div className="text-xs text-[var(--text-secondary)]">Projects</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--text-primary)]">{profile._count.skills}</div>
              <div className="text-xs text-[var(--text-secondary)]">Skills</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--warning)]" />
            Skills
          </h2>
          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                      <span className="text-sm text-[var(--text-primary)]">{skill.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < skill.level ? "bg-[var(--primary-light)]" : "bg-[var(--border-default)]"}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[var(--primary-light)]" />
            Projects ({profile._count.projects})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] card-hover">
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{project.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{project.description}</p>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{project._count.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{project._count.comments}</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{project._count.forks}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
