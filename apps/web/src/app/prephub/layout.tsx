import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Interview Prep Hub & FAANG Question Bank — Career Agents",
  description: "Company-specific interview prep guides for Google, Amazon, Meta, Microsoft, Apple, Netflix, Uber, and top tech startups. Practice actual interview questions.",
  keywords: ['company interview prep', 'FAANG interview questions', 'Google interview prep', 'Amazon leadership principles prep', 'Meta system design questions'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Company Tech Prep",
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
    title: "Company Interview Prep Hub & FAANG Question Bank — Career Agents",
    description: "Company-specific interview prep guides for Google, Amazon, Meta, Microsoft, Apple, Netflix, Uber, and top tech startups. Practice actual interview questions.",
    url: "/prephub",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Company Interview Prep Hub & FAANG Question Bank — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Company Interview Prep Hub & FAANG Question Bank — Career Agents",
    description: "Company-specific interview prep guides for Google, Amazon, Meta, Microsoft, Apple, Netflix, Uber, and top tech startups. Practice actual interview questions.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/prephub" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Prep Hub provides company-tailored interview tracks and question banks for top tech organizations.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
