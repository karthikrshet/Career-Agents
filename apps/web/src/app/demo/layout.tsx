import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Interactive Platform Demo — Career Agents",
  description: "Experience a live interactive walk-through of ATS resume scoring, GitHub portfolio auditing, LinkedIn optimization, and AI mock interviews.",
  keywords: ['career agents demo', 'live ATS score test', 'AI resume test drive', 'interactive platform demo', 'career OS preview'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Platform Preview",
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
    title: "Live Interactive Platform Demo — Career Agents",
    description: "Experience a live interactive walk-through of ATS resume scoring, GitHub portfolio auditing, LinkedIn optimization, and AI mock interviews.",
    url: "/demo",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Live Interactive Platform Demo — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Interactive Platform Demo — Career Agents",
    description: "Experience a live interactive walk-through of ATS resume scoring, GitHub portfolio auditing, LinkedIn optimization, and AI mock interviews.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/demo" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Demo page allows users to test platform tools interactively.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
