"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  GitFork,
  ExternalLink,
  Send,
  Calendar,
  Trash2,
  Share2,
  Code2,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import { getInitials, timeAgo, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    college: string | null;
    branch: string | null;
  };
  tags: { id: string; name: string }[];
  images: { id: string; url: string }[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string | null; image: string | null };
  }[];
  forkedFrom: {
    id: string;
    title: string;
    user: { name: string | null };
  } | null;
  _count: { likes: number; comments: number; forks: number };
  isLiked: boolean;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        toast.error("Project not found");
        router.push("/projects");
      }
    } catch {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProject();
    });
  }, [id]);

  async function toggleLike() {
    if (!project) return;
    try {
      const res = await fetch(`/api/projects/${id}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setProject({
          ...project,
          isLiked: data.liked,
          _count: {
            ...project._count,
            likes: project._count.likes + (data.liked ? 1 : -1),
          },
        });
      }
    } catch {
      toast.error("Failed to like");
    }
  }

  async function addComment() {
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await fetch(`/api/projects/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        const comment = await res.json();
        setProject({
          ...project!,
          comments: [comment, ...project!.comments],
          _count: { ...project!._count, comments: project!._count.comments + 1 },
        });
        setCommentText("");
        toast.success("Comment added!");
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommenting(false);
    }
  }

  async function forkProject() {
    try {
      const res = await fetch(`/api/projects/${id}/fork`, { method: "POST" });
      if (res.ok) {
        const forked = await res.json();
        toast.success("Project forked!");
        router.push(`/projects/${forked.id}`);
      }
    } catch {
      toast.error("Failed to fork project");
    }
  }

  async function deleteProject() {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Project deleted");
        router.push("/projects");
      }
    } catch {
      toast.error("Failed to delete project");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-[var(--bg-secondary)]" />
        <div className="h-64 rounded-2xl bg-[var(--bg-secondary)]" />
        <div className="h-48 rounded-2xl bg-[var(--bg-secondary)]" />
      </div>
    );
  }

  if (!project) return null;

  const isOwner = session?.user?.id === project.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/projects")}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-[var(--text-muted)]">Back to Projects</span>
      </div>

      {/* Project Card */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-hidden">
        {/* Banner */}
        {project.images.length > 0 ? (
          <div className="h-64 overflow-hidden">
            <img
              src={project.images[0].url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-[var(--primary)]/20 via-[var(--bg-secondary)] to-[var(--secondary)]/20 flex items-center justify-center">
            <Code2 className="w-16 h-16 text-[var(--primary)]/20" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Forked From */}
          {project.forkedFrom && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
              <GitFork className="w-3 h-3" />
              Forked from{" "}
              <Link
                href={`/projects/${project.forkedFrom.id}`}
                className="text-[var(--primary-light)] hover:underline"
              >
                {project.forkedFrom.title}
              </Link>{" "}
              by {project.forkedFrom.user.name}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
            {project.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)] border border-[var(--primary)]/20"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(project.createdAt)}
            </span>
          </div>

          {/* Description */}
          <p className="text-[var(--text-primary)] leading-relaxed mb-4">
            {project.description}
          </p>

          {project.longDescription && (
            <div className="mt-4 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
              <pre className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                {project.longDescription}
              </pre>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                <GitHubIcon className="w-4 h-4" />
                View Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  project.isLiked
                    ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--accent)]/50"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    project.isLiked ? "fill-current" : ""
                  }`}
                />
                {project._count.likes}
              </button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                <MessageSquare className="w-4 h-4" />
                {project._count.comments}
              </div>

              {!isOwner && (
                <button
                  onClick={forkProject}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--secondary)]/50 hover:text-[var(--secondary)] transition-all"
                >
                  <GitFork className="w-4 h-4" />
                  Fork ({project._count.forks})
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <button
                  onClick={deleteProject}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Author Card */}
          <Link
            href={`/profile/${project.user.id}`}
            className="flex items-center gap-4 mt-6 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold flex-shrink-0">
              {project.user.image ? (
                <img
                  src={project.user.image}
                  alt=""
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                getInitials(project.user.name)
              )}
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">
                {project.user.name || "Anonymous"}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {[project.user.college, project.user.branch]
                  .filter(Boolean)
                  .join(" • ") || "Engineering Student"}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Comments */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--secondary)]" />
          Comments ({project._count.comments})
        </h2>

        {/* Add Comment */}
        {session && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getInitials(session.user.name)}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addComment()}
                placeholder="Add a comment..."
                className="input-field flex-1"
              />
              <button
                onClick={addComment}
                disabled={!commentText.trim() || commenting}
                className="btn-primary px-4 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {project.comments.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-6">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-4">
            {project.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {comment.user.image ? (
                    <img
                      src={comment.user.image}
                      alt=""
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    getInitials(comment.user.name)
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {comment.user.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
