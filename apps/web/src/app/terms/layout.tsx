import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Usage Agreement — Career Agents",
  description: "Review Career Agents Terms of Service governing the use of our web application, open-source software, and AI career agent registries.",
  keywords: ['terms of service', 'terms of use', 'usage agreement', 'legal terms', 'acceptable use policy'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Legal & Terms",
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
    title: "Terms of Service & Usage Agreement — Career Agents",
    description: "Review Career Agents Terms of Service governing the use of our web application, open-source software, and AI career agent registries.",
    url: "/terms",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Terms of Service & Usage Agreement — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service & Usage Agreement — Career Agents",
    description: "Review Career Agents Terms of Service governing the use of our web application, open-source software, and AI career agent registries.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/terms" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Terms page details acceptable use and legal terms.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
