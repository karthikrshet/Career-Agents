import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy & Privacy Preferences — Career Agents",
  description: "Learn about Career Agents cookie usage, local storage persistence, telemetric privacy controls, and data protection practices.",
  keywords: ['cookie policy', 'privacy preferences', 'local storage policy', 'data protection', 'telemetry settings'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Legal & Privacy",
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
    title: "Cookie Policy & Privacy Preferences — Career Agents",
    description: "Learn about Career Agents cookie usage, local storage persistence, telemetric privacy controls, and data protection practices.",
    url: "/cookies",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cookie Policy & Privacy Preferences — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy & Privacy Preferences — Career Agents",
    description: "Learn about Career Agents cookie usage, local storage persistence, telemetric privacy controls, and data protection practices.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/cookies" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Cookies page details local storage and privacy preferences.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
