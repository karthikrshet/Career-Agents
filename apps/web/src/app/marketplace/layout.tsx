import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "146 AI Career Agent Marketplace & MCP Registry — Career Agents",
  description: "Explore 146 specialized AI career agents across Resume Engineering, Tech Interviewing, System Design, Salary Negotiation, and Executive Career Strategy.",
  keywords: ['AI agent marketplace', 'career agents registry', 'specialized career AI', 'MCP agent tools', 'prompt engineering career agents'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "AI Agent Ecosystem",
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
    title: "146 AI Career Agent Marketplace & MCP Registry — Career Agents",
    description: "Explore 146 specialized AI career agents across Resume Engineering, Tech Interviewing, System Design, Salary Negotiation, and Executive Career Strategy.",
    url: "/marketplace",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "146 AI Career Agent Marketplace & MCP Registry — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "146 AI Career Agent Marketplace & MCP Registry — Career Agents",
    description: "Explore 146 specialized AI career agents across Resume Engineering, Tech Interviewing, System Design, Salary Negotiation, and Executive Career Strategy.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/marketplace" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Marketplace catalogues 146 specialized career agents available for web app and MCP integration.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
