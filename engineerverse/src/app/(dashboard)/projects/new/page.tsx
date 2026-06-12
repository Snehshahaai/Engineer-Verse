"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Tag,
  X,
  Rocket,
  FileText,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import toast from "react-hot-toast";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    githubUrl: "",
    liveUrl: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags,
          githubUrl: formData.githubUrl || undefined,
          liveUrl: formData.liveUrl || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Project created!");
        router.push(`/projects/${data.id}`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create project");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Code2 className="w-6 h-6 text-[var(--primary-light)]" />
            New Project
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Share your work with the community
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--primary-light)]" />
            Project Details
          </h2>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="input-field"
              placeholder="My Awesome Project"
              required
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Short Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={2}
              className="input-field resize-none"
              placeholder="A brief overview of your project (shown in cards)"
              required
              maxLength={500}
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {formData.description.length}/500
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Detailed Description
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => updateField("longDescription", e.target.value)}
              rows={6}
              className="input-field resize-none font-mono text-sm"
              placeholder="Write a detailed description of your project. You can explain the tech stack, challenges, learnings, etc."
              maxLength={10000}
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {formData.longDescription.length}/10000
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[var(--secondary)]" />
            Links
          </h2>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              GitHub Repository
            </label>
            <div className="relative">
              <GitHubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                className="input-field pl-10"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Live Demo
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => updateField("liveUrl", e.target.value)}
                className="input-field pl-10"
                placeholder="https://myproject.vercel.app"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-[var(--warning)]" />
            Tags
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-field flex-1"
              placeholder="Type a tag and press Enter (e.g., react, python, ai)"
              maxLength={30}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="btn-ghost disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)] text-sm border border-[var(--primary)]/20"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-[var(--error)] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <p className="text-xs text-[var(--text-muted)]">
                Add up to 10 tags to help others find your project
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Publish Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
