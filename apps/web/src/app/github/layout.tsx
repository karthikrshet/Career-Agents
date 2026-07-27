import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Analyzer — Portfolio Health & Stats",
  description:
    "Audit your GitHub profile — analyze public repositories, README quality, language diversity, star and fork metrics, pinned repos, and contribution patterns. Get an AI-powered portfolio score.",
  keywords: [
    "github portfolio analyzer", "github profile audit", "github score", "repository analysis",
    "open source portfolio", "developer github profile", "github stars forks", "readme quality",
  ],
  openGraph: {
    title: "Career Agents GitHub Analyzer — Portfolio Health & Stats",
    description: "Audit your GitHub portfolio with AI — score repositories, README quality, and contribution patterns.",
    url: "/github",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career Agents GitHub Analyzer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Agents GitHub Analyzer",
    description: "AI-powered GitHub portfolio health check — repos, README quality, and contribution metrics.",
  },
  alternates: { canonical: "/github" },
};

export default function GitHubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
