import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Studio Dashboard & Overview Workspace — Career Agents",
  description: "Your centralized career command center — monitor career score, view active resume ATS audits, track job applications, and launch AI copilot sessions.",
  keywords: ['career dashboard', 'career intelligence workspace', 'job application overview', 'resume score widget', 'career score dashboard'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Productivity Workspace",
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
    title: "Career Studio Dashboard & Overview Workspace — Career Agents",
    description: "Your centralized career command center — monitor career score, view active resume ATS audits, track job applications, and launch AI copilot sessions.",
    url: "/dashboard",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career Studio Dashboard & Overview Workspace — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Studio Dashboard & Overview Workspace — Career Agents",
    description: "Your centralized career command center — monitor career score, view active resume ATS audits, track job applications, and launch AI copilot sessions.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/dashboard" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Dashboard provides an aggregated view of candidate metrics, active tasks, and quick tools.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
