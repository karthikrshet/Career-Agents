import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Studio — AI ATS Resume Scorer & Multi-Role Bullet Optimizer",
  description:
    "Free AI ATS Resume Analyzer. Get an instant ATS compatibility score, role-specific keyword gap analysis (Software Engineer, Product Manager, AI Engineer, Data Scientist, Cybersecurity), weak bullet detection, AI-powered STAR rewrites, and custom Job Description matching.",
  keywords: [
    "resume analyzer", "ATS score", "resume ATS checker", "resume keywords", "resume rewrite AI",
    "bullet point optimizer", "resume career tool", "STAR resume framework", "resume weak bullets",
    "software engineer ATS score", "product manager ATS score", "AI engineer resume score",
    "data scientist resume ATS", "cybersecurity resume score", "job description match ATS",
    "career agent resume audit", "real ATS score scanner", "generative engine optimization GEO",
  ],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  category: "Career Tools & Resume Engineering",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Resume Studio — Real AI ATS Resume Analyzer & Bullet Optimizer",
    description: "Instantly score your resume ATS compatibility across 15+ job roles, detect weak bullets, match custom Job Descriptions, and generate STAR rewrites.",
    url: "/resume",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career Agents Resume Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Studio — AI ATS Resume Analyzer",
    description: "Real-time ATS resume scoring, missing keyword detection, and AI STAR bullet rewrites for 15+ job roles.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/resume" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Resume Studio is a tool within Career Agents that scores resumes against 15+ job roles and custom Job Descriptions using real ATS keyword match ratios and STAR bullet audits.",
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
