import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Documentation & API Specifications — Career Agents",
  description: "Comprehensive developer documentation for Career Agents, including agent registries, MCP setup, API router integration, and schema validation.",
  keywords: ['developer documentation', 'career agents API docs', 'MCP setup guide', 'agent registry schema', 'AI router integration'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Developer Documentation",
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
    title: "Developer Documentation & API Specifications — Career Agents",
    description: "Comprehensive developer documentation for Career Agents, including agent registries, MCP setup, API router integration, and schema validation.",
    url: "/docs",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Developer Documentation & API Specifications — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Documentation & API Specifications — Career Agents",
    description: "Comprehensive developer documentation for Career Agents, including agent registries, MCP setup, API router integration, and schema validation.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/docs" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Docs provides technical specifications for integrating Career Agents.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
