import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Portfolio Analyzer & Open Source Audit — Career Agents",
  description: "AI-powered GitHub profile & repository auditor. Evaluate commit activity, code quality, README standards, star metrics, and technical contributions for engineering roles.",
  keywords: ['github portfolio analyzer', 'github profile audit', 'github score', 'repository code quality', 'open source portfolio', 'developer github profile', 'github stars forks', 'readme optimizer'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Developer Tools & Portfolio Engineering",
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
    title: "GitHub Portfolio Analyzer & Open Source Audit — Career Agents",
    description: "AI-powered GitHub profile & repository auditor. Evaluate commit activity, code quality, README standards, star metrics, and technical contributions for engineering roles.",
    url: "/github",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GitHub Portfolio Analyzer & Open Source Audit — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Portfolio Analyzer & Open Source Audit — Career Agents",
    description: "AI-powered GitHub profile & repository auditor. Evaluate commit activity, code quality, README standards, star metrics, and technical contributions for engineering roles.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/github" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "GitHub Analyzer scores developer portfolios, commit frequency, README quality, and repository architecture using AI.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
