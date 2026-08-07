import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprehensive Career Growth Guides & Playbooks — Career Agents",
  description: "Step-by-step career playbooks for landing software engineering, product management, AI/ML, and data science roles at top tech companies.",
  keywords: ['career guides', 'tech career playbook', 'how to pass ATS', 'software engineer promotion guide', 'FAANG interview playbook'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Career Playbooks",
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
    title: "Comprehensive Career Growth Guides & Playbooks — Career Agents",
    description: "Step-by-step career playbooks for landing software engineering, product management, AI/ML, and data science roles at top tech companies.",
    url: "/guides",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Comprehensive Career Growth Guides & Playbooks — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comprehensive Career Growth Guides & Playbooks — Career Agents",
    description: "Step-by-step career playbooks for landing software engineering, product management, AI/ML, and data science roles at top tech companies.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/guides" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Guides offers in-depth career advancement playbooks.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
