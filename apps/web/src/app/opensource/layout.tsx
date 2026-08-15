import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Source Initiative & GitHub Repository — Career Agents",
  description: "Career Agents is 100% open source. Explore our GitHub repository, agent registries, division schemas, and validation scripts under the MIT license.",
  keywords: ['open source career agents', 'github repository', 'MIT license', 'open source AI project', 'career agents codebase'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Open Source Community",
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
    title: "Open Source Initiative & GitHub Repository — Career Agents",
    description: "Career Agents is 100% open source. Explore our GitHub repository, agent registries, division schemas, and validation scripts under the MIT license.",
    url: "/opensource",
    siteName: "Career Agents",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Open Source Initiative & GitHub Repository — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Source Initiative & GitHub Repository — Career Agents",
    description: "Career Agents is 100% open source. Explore our GitHub repository, agent registries, division schemas, and validation scripts under the MIT license.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/opensource" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "OpenSource page highlights GitHub repository structure and open licenses.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
