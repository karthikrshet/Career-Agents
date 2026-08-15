// apps/web/src/app/api/docs/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference — Career Agents Developer Platform",
  description:
    "Complete developer reference and endpoint documentation for Career Agents. Integrate resume parsing, interview coaching, GitHub audits, and provider gateway routes directly into your own tools.",
  keywords: [
    "career agents API", "developer docs", "resume parser API", "interview coach API",
    "GitHub audit API", "copilot streams", "open source developer reference",
  ],
  openGraph: {
    title: "Career Agents Developer API Reference",
    description: "Build on top of the open-source career intelligence platform with streamlined developer APIs.",
    url: "/api/docs",
  },
  alternates: { canonical: "/api/docs" },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
