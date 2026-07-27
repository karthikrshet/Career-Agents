import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Career Agents — Mission, Architecture & 146 AI Agents",
  description:
    "Learn about Career Agents — our mission, vision, modular architecture, and explore the searchable registry of all 146 specialized AI career agents across 19 divisions.",
  keywords: [
    "about career OS", "career OS architecture", "146 AI agents", "career agent registry",
    "career OS mission", "AI career platform architecture", "multi-agent system",
  ],
  openGraph: {
    title: "About Career Agents — 146 AI Agents & Architecture",
    description: "Explore the Career Agents platform mission, modular architecture, and full registry of 146 specialized AI career agents.",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
