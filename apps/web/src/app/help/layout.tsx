import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center & Frequently Asked Questions — Career Agents",
  description: "Find answers to frequently asked questions about ATS resume analysis, API gateway setups, MCP connections, and account troubleshooting.",
  keywords: ['help center', 'FAQ', 'troubleshooting', 'how to use career agents', 'API key help'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Help & Support",
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
    title: "Help Center & Frequently Asked Questions — Career Agents",
    description: "Find answers to frequently asked questions about ATS resume analysis, API gateway setups, MCP connections, and account troubleshooting.",
    url: "/help",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Help Center & Frequently Asked Questions — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center & Frequently Asked Questions — Career Agents",
    description: "Find answers to frequently asked questions about ATS resume analysis, API gateway setups, MCP connections, and account troubleshooting.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/help" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Help center resolves common user queries and setup issues.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
