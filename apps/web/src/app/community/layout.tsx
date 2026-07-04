import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer & Candidate Community — Career Agents",
  description: "Connect with engineers, hiring managers, and career coaches in the Career Agents open-source community on GitHub and Discord.",
  keywords: ['tech career community', 'career agents discord', 'github career discussions', 'engineer networking group', 'peer resume feedback'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Community & Networking",
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
    title: "Developer & Candidate Community — Career Agents",
    description: "Connect with engineers, hiring managers, and career coaches in the Career Agents open-source community on GitHub and Discord.",
    url: "/community",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Developer & Candidate Community — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer & Candidate Community — Career Agents",
    description: "Connect with engineers, hiring managers, and career coaches in the Career Agents open-source community on GitHub and Discord.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/community" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Community page connects candidates with open source contributors and peer interview groups.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
