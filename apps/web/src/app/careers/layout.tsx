import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Career Agents — Open Roles & Contributions",
  description: "Explore opportunities to join or contribute to Career Agents. Help us build the open-source AI career operating system.",
  keywords: ['career agents jobs', 'open source contributions', 'AI developer jobs', 'career OS careers', 'remote engineering jobs'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Company Careers",
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
    title: "Join Career Agents — Open Roles & Contributions",
    description: "Explore opportunities to join or contribute to Career Agents. Help us build the open-source AI career operating system.",
    url: "/careers",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Join Career Agents — Open Roles & Contributions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Career Agents — Open Roles & Contributions",
    description: "Explore opportunities to join or contribute to Career Agents. Help us build the open-source AI career operating system.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/careers" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Careers page lists open source contribution guides and opportunities at Career Agents.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
