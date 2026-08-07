import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Addendum (DPA) — Career Agents",
  description: "Review Career Agents Data Processing Addendum for enterprise data security, GDPR compliance, local storage options, and data privacy safeguards.",
  keywords: ['data processing addendum', 'DPA', 'GDPR compliance', 'enterprise data security', 'privacy safeguards'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Legal & Compliance",
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
    title: "Data Processing Addendum (DPA) — Career Agents",
    description: "Review Career Agents Data Processing Addendum for enterprise data security, GDPR compliance, local storage options, and data privacy safeguards.",
    url: "/dpa",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Data Processing Addendum (DPA) — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Processing Addendum (DPA) — Career Agents",
    description: "Review Career Agents Data Processing Addendum for enterprise data security, GDPR compliance, local storage options, and data privacy safeguards.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/dpa" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "DPA details data processing and compliance standards.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
