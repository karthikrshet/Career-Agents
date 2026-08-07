import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn AI Content Studio & Thought Leadership Post Generator — Career Agents",
  description: "Generate high-engaging technical LinkedIn posts, project launch announcements, and professional updates tailored for software developers and leaders.",
  keywords: ['linkedin AI content generator', 'tech post generator', 'developer linkedin posts', 'thought leadership AI', 'tech project announcement'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Content Creation & Branding",
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
    title: "LinkedIn AI Content Studio & Thought Leadership Post Generator — Career Agents",
    description: "Generate high-engaging technical LinkedIn posts, project launch announcements, and professional updates tailored for software developers and leaders.",
    url: "/linkedin-ai",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LinkedIn AI Content Studio & Thought Leadership Post Generator — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn AI Content Studio & Thought Leadership Post Generator — Career Agents",
    description: "Generate high-engaging technical LinkedIn posts, project launch announcements, and professional updates tailored for software developers and leaders.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/linkedin-ai" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "LinkedIn AI generates engaging developer post content.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
