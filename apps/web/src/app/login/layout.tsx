import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In / Authentication — Career Agents",
  description: "Access your Career Agents workspace, saved resume analyses, job tracker applications, and custom AI provider settings.",
  keywords: ['sign in', 'login', 'career agents auth', 'user login', 'account access'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Authentication",
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
    title: "Sign In / Authentication — Career Agents",
    description: "Access your Career Agents workspace, saved resume analyses, job tracker applications, and custom AI provider settings.",
    url: "/login",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sign In / Authentication — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In / Authentication — Career Agents",
    description: "Access your Career Agents workspace, saved resume analyses, job tracker applications, and custom AI provider settings.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/login" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Login page handles user authentication and session access.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
