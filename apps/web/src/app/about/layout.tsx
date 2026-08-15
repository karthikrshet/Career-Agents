import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Career Agents — Open-Source AI Career Intelligence Platform",
  description: "Learn about Career Agents, our mission to democratize elite career coaching using 167 specialized AI agents, and our open-source AI architecture.",
  keywords: ['about career agents', 'open source career agents', 'AI career coaching mission', 'Karthik R Shet', 'career technology platform'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Company & Mission",
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
    title: "About Career Agents — Open-Source AI Career Intelligence Platform",
    description: "Learn about Career Agents, our mission to democratize elite career coaching using 167 specialized AI agents, and our open-source AI architecture.",
    url: "/about",
    siteName: "Career Agents",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Career Agents — AI Career Intelligence Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Career Agents — Open-Source AI Career Intelligence Platform",
    description: "Learn about Career Agents, our mission to democratize elite career coaching using 167 specialized AI agents, and our open-source AI architecture.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/about" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "About page details the mission, architecture, and team behind the open-source Career Agents platform.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
