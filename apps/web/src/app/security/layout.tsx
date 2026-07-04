import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Architecture & Vulnerability Management — Career Agents",
  description: "Understand Career Agents security practices, sandboxed LLM execution, zero server data storage options, and vulnerability reporting procedures.",
  keywords: ['security architecture', 'LLM security', 'vulnerability reporting', 'data encryption', 'sandboxed execution'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Security & Compliance",
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
    title: "Security Architecture & Vulnerability Management — Career Agents",
    description: "Understand Career Agents security practices, sandboxed LLM execution, zero server data storage options, and vulnerability reporting procedures.",
    url: "/security",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Security Architecture & Vulnerability Management — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Architecture & Vulnerability Management — Career Agents",
    description: "Understand Career Agents security practices, sandboxed LLM execution, zero server data storage options, and vulnerability reporting procedures.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/security" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Security page details security posture and vulnerability management.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
