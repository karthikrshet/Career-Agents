import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Optimizer — Profile Visibility & Recruiter Score",
  description:
    "Optimize your LinkedIn profile for maximum recruiter visibility. Analyze headline quality, summary keywords, skill endorsements, and get AI-powered rewrite suggestions.",
  keywords: [
    "linkedin optimizer", "linkedin profile score", "recruiter visibility", "linkedin headline",
    "linkedin keywords", "linkedin SEO", "linkedin profile analyzer", "linkedin summary rewrite",
  ],
  openGraph: {
    title: "Career Agents LinkedIn Optimizer — Profile Visibility Score",
    description: "Maximize your LinkedIn recruiter visibility with AI-powered profile optimization and rewrite suggestions.",
    url: "/linkedin",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career Agents LinkedIn Optimizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Agents LinkedIn Optimizer",
    description: "AI LinkedIn profile optimization — improve recruiter visibility and keyword targeting.",
  },
  alternates: { canonical: "/linkedin" },
};

export default function LinkedInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
