import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Profile Optimizer & AI Headline Generator — Career Agents",
  description: "Optimize your LinkedIn headline, about summary, experience bullets, and skills endorsement for maximum recruiter outreach and high-volume candidate search results.",
  keywords: ['linkedin optimizer', 'linkedin headline generator', 'linkedin profile score', 'recruiter search optimization', 'linkedin summary AI', 'career brand optimizer'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Career Branding & Professional Networking",
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
    title: "LinkedIn Profile Optimizer & AI Headline Generator — Career Agents",
    description: "Optimize your LinkedIn headline, about summary, experience bullets, and skills endorsement for maximum recruiter outreach and high-volume candidate search results.",
    url: "/linkedin",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LinkedIn Profile Optimizer & AI Headline Generator — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Profile Optimizer & AI Headline Generator — Career Agents",
    description: "Optimize your LinkedIn headline, about summary, experience bullets, and skills endorsement for maximum recruiter outreach and high-volume candidate search results.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/linkedin" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "LinkedIn Optimizer enhances professional profiles for recruiter boolean searches and personal branding.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
