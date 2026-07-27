import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prep Hub — Company-Specific Interview Prep",
  description:
    "Prepare for interviews at top tech companies with categorized question banks, difficulty tiers, and company-specific coaching tracks. FAANG, startups, and more.",
  keywords: [
    "interview prep", "company interview questions", "FAANG interview", "google interview prep",
    "amazon interview", "meta interview", "microsoft interview", "startup interview",
  ],
  openGraph: {
    title: "Career Agents Prep Hub — Company-Specific Interview Prep",
    description: "Company-specific interview prep tracks with categorized questions and difficulty tiers.",
    url: "/prephub",
  },
  alternates: { canonical: "/prephub" },
};

export default function PrepHubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
