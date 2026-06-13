"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Globe,
  Save,
  Plus,
  X,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import toast from "react-hot-toast";
import { BRANCHES, YEARS, SKILL_CATEGORIES } from "@/lib/utils";

interface SkillData {
  id?: string;
  name: string;
  category: string;
  level: number;
}

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    college: "",
    branch: "",
    year: "",
    github: "",
    linkedin: "",
    portfolioUrl: "",
  });

  const [skills, setSkills] = useState<SkillData[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "Programming", level: 3 });
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            college: data.college || "",
            branch: data.branch || "",
            year: data.year || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            portfolioUrl: data.portfolioUrl || "",
          });
          setSkills(data.skills || []);
        }
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      } finally {
        setFetchLoading(false);
      }
    }
    if (session) fetchProfile();
  }, [session]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Profile updated!");
        router.push("/profile");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.name.trim()) {
      toast.error("Skill name is required");
      return;
    }
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });
      if (res.ok) {
        const data = await res.json();
        setSkills([...skills, data]);
        setNewSkill({ name: "", category: "Programming", level: 3 });
        setShowSkillForm(false);
        toast.success("Skill added!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add skill");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const res = await fetch(`/api/skills?id=${skillId}`, { method: "DELETE" });
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== skillId));
        toast.success("Skill removed");
      }
    } catch {
      toast.error("Failed to remove skill");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Your account has been deleted.");
        await signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-12 rounded-xl bg-[var(--bg-secondary)]" />
        <div className="h-64 rounded-2xl bg-[var(--bg-secondary)]" />
        <div className="h-48 rounded-2xl bg-[var(--bg-secondary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Edit Profile
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Basic Info */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--primary-light)]" />
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="input-field pl-10"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="input-field pl-10 opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {formData.bio.length}/500 characters
          </p>
        </div>
      </div>

      {/* College Info */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[var(--secondary)]" />
          Education
        </h2>

        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            College/University
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={formData.college}
              onChange={(e) => updateField("college", e.target.value)}
              className="input-field pl-10"
              placeholder="Your college"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Branch
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <select
                value={formData.branch}
                onChange={(e) => updateField("branch", e.target.value)}
                className="input-field pl-10 appearance-none cursor-pointer"
              >
                <option value="">Select Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <select
                value={formData.year}
                onChange={(e) => updateField("year", e.target.value)}
                className="input-field pl-10 appearance-none cursor-pointer"
              >
                <option value="">Select Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--accent)]" />
          Links
        </h2>

        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            GitHub
          </label>
          <div className="relative">
            <GitHubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="url"
              value={formData.github}
              onChange={(e) => updateField("github", e.target.value)}
              className="input-field pl-10"
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            LinkedIn
          </label>
          <div className="relative">
            <LinkedInIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => updateField("linkedin", e.target.value)}
              className="input-field pl-10"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Portfolio
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => updateField("portfolioUrl", e.target.value)}
              className="input-field pl-10"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--warning)]" />
            Skills
          </h2>
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="btn-ghost text-xs"
          >
            <Plus className="w-3 h-3" />
            Add Skill
          </button>
        </div>

        {/* Add Skill Form */}
        {showSkillForm && (
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] mb-4 space-y-3 animate-scale-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                className="input-field"
                placeholder="Skill name (e.g., Python)"
              />
              <select
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
                className="input-field appearance-none cursor-pointer"
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)]">Level:</span>
                {[1, 2, 3, 4, 5].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setNewSkill({ ...newSkill, level: l })}
                    className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                      l <= newSkill.level
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--bg-hover)] text-[var(--text-muted)]"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSkillForm(false)}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
              <button onClick={addSkill} className="btn-primary text-xs">
                Add Skill
              </button>
            </div>
          </div>
        )}

        {/* Skills List */}
        {skills.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">
            No skills added yet. Click &ldquo;Add Skill&rdquo; to get started.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id || skill.name}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] hover:border-[var(--error)]/50 transition-colors"
              >
                <span className="text-sm text-[var(--text-primary)]">
                  {skill.name}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Lv.{skill.level}
                </span>
                {skill.id && (
                  <button
                    onClick={() => removeSkill(skill.id!)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--error)] transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Danger Zone */}
        <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--error)]/20 p-6 space-y-4 mt-6">
          <h2 className="text-sm font-semibold text-[var(--error)] uppercase tracking-wider flex items-center gap-2">
            Danger Zone
          </h2>
          <div className="p-4 rounded-xl bg-[var(--error)]/5 border border-[var(--error)]/10 text-sm text-[var(--text-secondary)]">
            Deleting your account is permanent. This will immediately erase your profile, projects, comments, and all other associated data. This action cannot be undone.
          </div>
          <div className="flex items-center justify-between pt-2">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20 rounded-xl text-sm font-semibold hover:bg-[var(--error)] hover:text-white hover:border-[var(--error)] transition-all cursor-pointer"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-[var(--text-secondary)] font-medium mr-auto sm:mr-0">Are you sure?</span>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="btn-ghost text-xs px-3 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-[var(--error)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--error)]/90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {deleteLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Yes, Delete My Account"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
