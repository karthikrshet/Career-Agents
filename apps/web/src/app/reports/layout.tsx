import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Readiness Intelligence Reports & Diagnostics — Career Agents",
  description: "Comprehensive career diagnostics aggregating ATS resume score, GitHub health, LinkedIn optimization, and interview readiness into an actionable PDF report.",
  keywords: ['career report', 'career score diagnostic', 'resume github linkedin report', 'career readiness assessment', 'tech career analytics'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Career Analytics & Diagnostics",
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
    title: "Career Readiness Intelligence Reports & Diagnostics — Career Agents",
    description: "Comprehensive career diagnostics aggregating ATS resume score, GitHub health, LinkedIn optimization, and interview readiness into an actionable PDF report.",
    url: "/reports",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career Readiness Intelligence Reports & Diagnostics — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Readiness Intelligence Reports & Diagnostics — Career Agents",
    description: "Comprehensive career diagnostics aggregating ATS resume score, GitHub health, LinkedIn optimization, and interview readiness into an actionable PDF report.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/reports" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Reports generates holistic candidate evaluations combining resume, GitHub, and interview metrics.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
