// lib/persistence.ts
// Local JSON persistence layer — localStorage-based Prisma swap-in
// When PostgreSQL + Prisma is available, replace these implementations
// with Prisma client calls that match the same interface signatures.

export type StorageKey =
  | "cos:profile"
  | "cos:settings"
  | "cos:resume-analyses"
  | "cos:github-analyses"
  | "cos:linkedin-analyses"
  | "cos:interview-sessions"
  | "cos:job-applications"
  | "cos:copilot-sessions"
  | "cos:activity-feed"
  | "cos:company-progress";

function isServer() {
  return typeof window === "undefined";
}

export function persistRead<T>(key: StorageKey, fallback: T): T {
  if (isServer()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function persistWrite<T>(key: StorageKey, value: T): void {
  if (isServer()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[persistence] write failed:", e);
  }
}

export function persistDelete(key: StorageKey): void {
  if (isServer()) return;
  localStorage.removeItem(key);
}

export function persistClear(): void {
  if (isServer()) return;
  const cosKeys = Object.keys(localStorage).filter((k) => k.startsWith("cos:"));
  cosKeys.forEach((k) => localStorage.removeItem(k));
}

// ─── Profile ──────────────────────────────────────────────────────────────
export interface PersistedProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  targetRole?: string;
  targetCompany?: string;
  createdAt: string;
  updatedAt: string;
}

export const profileStore = {
  get: () => persistRead<PersistedProfile | null>("cos:profile", null),
  set: (p: PersistedProfile) => persistWrite("cos:profile", p),
  clear: () => persistDelete("cos:profile"),
};

// ─── Report export helper ─────────────────────────────────────────────────
export function downloadJSON(data: unknown, filename: string) {
  if (isServer()) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadText(text: string, filename: string, mime = "text/plain") {
  if (isServer()) return;
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(md: string, filename: string) {
  downloadText(md, filename, "text/markdown");
}
