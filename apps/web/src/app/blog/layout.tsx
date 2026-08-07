import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Career Insights & ATS Optimization Blog — Career Agents",
  description: "Expert insights on passing ATS resume filters, cracking FAANG system design interviews, optimizing GitHub portfolios, and negotiating tech compensation.",
  keywords: ['career blog', 'ATS optimization tips', 'system design interview guide', 'tech salary negotiation blog', 'engineer career growth'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Educational Content & Guides",
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
    title: "Engineering Career Insights & ATS Optimization Blog — Career Agents",
    description: "Expert insights on passing ATS resume filters, cracking FAANG system design interviews, optimizing GitHub portfolios, and negotiating tech compensation.",
    url: "/blog",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Engineering Career Insights & ATS Optimization Blog — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Career Insights & ATS Optimization Blog — Career Agents",
    description: "Expert insights on passing ATS resume filters, cracking FAANG system design interviews, optimizing GitHub portfolios, and negotiating tech compensation.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/blog" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Blog publishes articles on resume engineering, technical interviews, and software career growth.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
