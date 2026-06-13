"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Search,
  Plus,
  Heart,
  MessageSquare,
  GitFork,
  GitBranch,
  ExternalLink,
  Filter,
} from "lucide-react";
import { getInitials, timeAgo } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
  tags: { id: string; name: string }[];
  images: { id: string; url: string }[];
  _count: { likes: number; comments: number; forks: number };
  isLiked: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchProjects() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort,
        ...(search ? { search } : {}),
      });

      const res = await fetch(`/api/projects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProjects();
    });
  }, [search, sort, page]);

  async function toggleLike(projectId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  isLiked: data.liked,
                  _count: {
                    ...p._count,
                    likes: p._count.likes + (data.liked ? 1 : -1),
                  },
                }
              : p
          )
        );
      }
    } catch (e) {
      console.error("Failed to toggle like:", e);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Code2 className="w-6 h-6 text-[var(--primary-light)]" />
            Project Hub
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Discover and showcase amazing projects
          </p>
        </div>
        <Link href="/projects/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSort("recent")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              sort === "recent"
                ? "bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-light)]"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSort("popular")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              sort === "popular"
                ? "bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-light)]"
            }`}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-[var(--bg-secondary)] animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No projects found
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {search
              ? "Try a different search term"
              : "Be the first to share a project!"}
          </p>
          <Link href="/projects/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-hidden card-hover"
            >
              {/* Thumbnail / Gradient */}
              <div className="h-36 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 relative overflow-hidden">
                {project.images[0] ? (
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 className="w-12 h-12 text-[var(--primary)]/30" />
                  </div>
                )}
                {/* Quick Links */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg glass text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg glass text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5">
                <Link href={`/projects/${project.id}`}>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1.5 group-hover:text-[var(--primary-light)] transition-colors">
                    {project.title}
                  </h3>
                </Link>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)] border border-[var(--primary)]/20"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
                  {/* Author */}
                  <Link
                    href={`/profile/${project.user.id}`}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-[10px] font-bold">
                      {project.user.image ? (
                        <img
                          src={project.user.image}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(project.user.name)
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {project.user.name || "Anonymous"}
                    </span>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(project.id)}
                      className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          project.isLiked
                            ? "fill-[var(--accent)] text-[var(--accent)]"
                            : ""
                        }`}
                      />
                      {project._count.likes}
                    </button>
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {project._count.comments}
                    </Link>
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <GitFork className="w-3.5 h-3.5" />
                      {project._count.forks}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                page === i + 1
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--primary)]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
