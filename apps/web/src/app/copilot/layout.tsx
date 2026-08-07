import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Career Copilot & Real-Time Strategy Assistant — Career Agents",
  description: "Chat with an AI career copilot trained on 146 specialized agent personas for salary negotiation, job search strategy, technical resume rewrites, and promotion planning.",
  keywords: ['career copilot', 'AI career assistant', 'career strategy chat', 'salary negotiation coach', 'tech career advisor', 'career path mentor AI'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Career Copilot & Strategy",
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
    title: "AI Career Copilot & Real-Time Strategy Assistant — Career Agents",
    description: "Chat with an AI career copilot trained on 146 specialized agent personas for salary negotiation, job search strategy, technical resume rewrites, and promotion planning.",
    url: "/copilot",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Career Copilot & Real-Time Strategy Assistant — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Career Copilot & Real-Time Strategy Assistant — Career Agents",
    description: "Chat with an AI career copilot trained on 146 specialized agent personas for salary negotiation, job search strategy, technical resume rewrites, and promotion planning.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/copilot" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Career Copilot offers interactive career advice, salary negotiation guidance, and strategic planning.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
