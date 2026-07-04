import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Features & AI Agent Capabilities — Career Agents",
  description: "Discover all features of Career Agents: 146 specialized AI agents, multi-role ATS resume scoring, STAR bullet rewrites, GitHub health audits, and MCP tools.",
  keywords: ['career agents features', 'AI resume features', 'STAR bullet optimizer', 'multi-role ATS score', 'AI mock interview features'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Platform Capabilities",
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
    title: "Platform Features & AI Agent Capabilities — Career Agents",
    description: "Discover all features of Career Agents: 146 specialized AI agents, multi-role ATS resume scoring, STAR bullet rewrites, GitHub health audits, and MCP tools.",
    url: "/features",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Platform Features & AI Agent Capabilities — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Features & AI Agent Capabilities — Career Agents",
    description: "Discover all features of Career Agents: 146 specialized AI agents, multi-role ATS resume scoring, STAR bullet rewrites, GitHub health audits, and MCP tools.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/features" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Features page highlights core platform capabilities and agent tooling.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
