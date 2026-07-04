import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mock Interview Practice Lab & STAR Question Coach — Career Agents",
  description: "Practice real technical, behavioral, and system design interviews with 146 specialized AI interviewers. Get instant feedback on STAR answer structure and metric impact.",
  keywords: ['AI mock interview', 'technical interview practice', 'behavioral interview prep', 'system design mock interview', 'STAR interview coach', 'FAANG interview practice'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Interview Preparation & Skill Assessment",
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
    title: "AI Mock Interview Practice Lab & STAR Question Coach — Career Agents",
    description: "Practice real technical, behavioral, and system design interviews with 146 specialized AI interviewers. Get instant feedback on STAR answer structure and metric impact.",
    url: "/interview",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Mock Interview Practice Lab & STAR Question Coach — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Mock Interview Practice Lab & STAR Question Coach — Career Agents",
    description: "Practice real technical, behavioral, and system design interviews with 146 specialized AI interviewers. Get instant feedback on STAR answer structure and metric impact.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/interview" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Interview Lab provides interactive mock interviews and real-time STAR framework scoring.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
