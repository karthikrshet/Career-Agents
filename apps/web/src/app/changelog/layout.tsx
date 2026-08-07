import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Release Notes & Agent Registry Changelog — Career Agents",
  description: "Stay up to date with new AI agents, feature releases, MCP protocol improvements, and multi-provider model router updates.",
  keywords: ['platform changelog', 'career agents release notes', 'AI model updates', 'agent registry updates', 'new career tools'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Product Updates",
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
    title: "Platform Release Notes & Agent Registry Changelog — Career Agents",
    description: "Stay up to date with new AI agents, feature releases, MCP protocol improvements, and multi-provider model router updates.",
    url: "/changelog",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Platform Release Notes & Agent Registry Changelog — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Release Notes & Agent Registry Changelog — Career Agents",
    description: "Stay up to date with new AI agents, feature releases, MCP protocol improvements, and multi-provider model router updates.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/changelog" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Changelog logs all product versions, new agent releases, and platform enhancements.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
