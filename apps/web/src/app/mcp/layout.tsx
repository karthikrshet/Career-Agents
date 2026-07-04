import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model Context Protocol (MCP) Integration & AI Client Setup — Career Agents",
  description: "Connect 146 Career Agents directly to Cursor IDE, Claude Desktop, VS Code, and LLM clients using the open Model Context Protocol (MCP).",
  keywords: ['MCP model context protocol', 'Cursor IDE career agent', 'Claude Desktop MCP tool', 'VS Code career AI extension', 'AI agent protocol'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Protocol & Developer Integration",
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
    title: "Model Context Protocol (MCP) Integration & AI Client Setup — Career Agents",
    description: "Connect 146 Career Agents directly to Cursor IDE, Claude Desktop, VS Code, and LLM clients using the open Model Context Protocol (MCP).",
    url: "/mcp",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Model Context Protocol (MCP) Integration & AI Client Setup — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Model Context Protocol (MCP) Integration & AI Client Setup — Career Agents",
    description: "Connect 146 Career Agents directly to Cursor IDE, Claude Desktop, VS Code, and LLM clients using the open Model Context Protocol (MCP).",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/mcp" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "MCP documentation details how to connect Career Agents to external IDEs and AI desktop apps.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
