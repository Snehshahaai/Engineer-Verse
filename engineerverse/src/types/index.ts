import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export interface UserProfile {
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
  resumeUrl: string | null;
  portfolioUrl: string | null;
  createdAt: string;
  skills: SkillData[];
  projects: ProjectData[];
  _count?: {
    projects: number;
    skills: number;
  };
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  forkedFromId: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  images: { id: string; url: string }[];
  tags: { id: string; name: string }[];
  _count: {
    likes: number;
    comments: number;
    forks: number;
  };
  isLiked?: boolean;
}

export interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
