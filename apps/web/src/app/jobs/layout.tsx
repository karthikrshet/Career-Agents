import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Job Hub & Role Keyword Insights — Career Agents",
  description: "Search open tech roles and inspect live ATS keyword requirements for Software Engineer, Product Manager, AI Engineer, Data Scientist, and DevOps positions.",
  keywords: ['tech job hub', 'job role keywords', 'software engineer job keywords', 'ATS job search', 'role competency requirements'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Job Search & Market Intelligence",
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
    title: "Tech Job Hub & Role Keyword Insights — Career Agents",
    description: "Search open tech roles and inspect live ATS keyword requirements for Software Engineer, Product Manager, AI Engineer, Data Scientist, and DevOps positions.",
    url: "/jobs",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tech Job Hub & Role Keyword Insights — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Job Hub & Role Keyword Insights — Career Agents",
    description: "Search open tech roles and inspect live ATS keyword requirements for Software Engineer, Product Manager, AI Engineer, Data Scientist, and DevOps positions.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/jobs" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Jobs Hub details market demand and role-specific ATS keywords.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
