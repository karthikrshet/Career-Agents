import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 45) return "Needs Work";
  return "Critical";
}

export function scoreToColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 65) return "text-sky-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export function scoreToBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  if (score >= 65) return "bg-sky-500/10 border-sky-500/20 text-sky-400";
  if (score >= 50) return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  return "bg-red-500/10 border-red-500/20 text-red-400";
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function calculateCareerScore(
  resumeScore: number,
  githubScore: number,
  linkedinScore: number,
  interviewScore: number,
  applicationScore: number
): number {
  // Weighted average — resume + GitBranch are most important
  const weights = [0.25, 0.25, 0.20, 0.20, 0.10];
  const scores = [resumeScore, githubScore, linkedinScore, interviewScore, applicationScore];
  return Math.round(
    scores.reduce((acc, score, i) => acc + score * weights[i], 0)
  );
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  CSS: "#563d7c",
  HTML: "#e34c26",
};


