import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Lab — AI Mock Interview Practice",
  description:
    "Practice AI-powered mock interviews with STAR scoring. Get evaluated on Situation, Task, Action, Result, leadership qualities, and technical depth. Supports behavioral, technical, system design, and HR rounds.",
  keywords: [
    "mock interview", "AI interview practice", "STAR interview", "behavioral interview",
    "technical interview prep", "system design interview", "interview scoring", "interview coaching AI",
  ],
  openGraph: {
    title: "Career OS Interview Lab — AI Mock Interview Practice",
    description: "Practice mock interviews with STAR scoring, leadership metrics, and technical depth evaluation.",
    url: "/interview",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career OS Interview Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career OS Interview Lab",
    description: "AI-powered mock interviews with STAR framework scoring and technical depth analysis.",
  },
  alternates: { canonical: "/interview" },
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
