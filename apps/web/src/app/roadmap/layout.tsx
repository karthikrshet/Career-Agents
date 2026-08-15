import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Roadmap & Future Capabilities — Career Agents",
  description: "Explore upcoming features for Career Agents: multi-agent autonomous job application bots, real-time voice mock interviews, and advanced MCP tooling.",
  keywords: ['product roadmap', 'future features', 'AI career roadmap', 'upcoming agent releases', 'feature requests'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Product Roadmap",
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
    title: "Product Roadmap & Future Capabilities — Career Agents",
    description: "Explore upcoming features for Career Agents: multi-agent autonomous job application bots, real-time voice mock interviews, and advanced MCP tooling.",
    url: "/roadmap",
    siteName: "Career Agents",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Product Roadmap & Future Capabilities — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Roadmap & Future Capabilities — Career Agents",
    description: "Explore upcoming features for Career Agents: multi-agent autonomous job application bots, real-time voice mock interviews, and advanced MCP tooling.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/roadmap" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Roadmap outlines planned releases and community feature requests.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
