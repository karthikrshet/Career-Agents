import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Studio — AI ATS Resume Analyzer",
  description:
    "Upload your resume and get an instant ATS compatibility score, keyword gap analysis, weak bullet detection, AI-powered rewrites, and STAR framework analysis. Supports PDF, DOCX, TXT, MD, RTF.",
  keywords: [
    "resume analyzer", "ATS score", "resume ATS checker", "resume keywords", "resume rewrite AI",
    "bullet point optimizer", "resume career tool", "STAR resume", "resume weak bullets",
  ],
  openGraph: {
    title: "Career OS Resume Studio — AI ATS Resume Analyzer",
    description: "Instantly score your resume ATS compatibility, detect weak bullets, and get AI-powered rewrites.",
    url: "/resume",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career OS Resume Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career OS Resume Studio",
    description: "AI-powered resume ATS analysis, keyword optimization, and bullet rewrites.",
  },
  alternates: { canonical: "/resume" },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
