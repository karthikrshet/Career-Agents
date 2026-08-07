import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Career Intelligence & Organization Solutions — Career Agents",
  description: "Deploy Career Agents across universities, bootcamps, outplacement agencies, and engineering teams. Self-hosted and local LLM options available.",
  keywords: ['enterprise career platform', 'university career OS', 'bootcamp career tools', 'outplacement AI platform', 'self-hosted career OS'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Enterprise Solutions",
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
    title: "Enterprise Career Intelligence & Organization Solutions — Career Agents",
    description: "Deploy Career Agents across universities, bootcamps, outplacement agencies, and engineering teams. Self-hosted and local LLM options available.",
    url: "/enterprise",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Enterprise Career Intelligence & Organization Solutions — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise Career Intelligence & Organization Solutions — Career Agents",
    description: "Deploy Career Agents across universities, bootcamps, outplacement agencies, and engineering teams. Self-hosted and local LLM options available.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/enterprise" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Enterprise page details organizational deployments for universities and bootcamps.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
