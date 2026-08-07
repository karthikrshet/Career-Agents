import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Prompt & Agent Code Playground — Career Agents",
  description: "Test and customize 146 career agents in an interactive prompt playground. Experiment with system prompts, temperature controls, and LLM parameters.",
  keywords: ['AI prompt playground', 'agent simulator', 'LLM playground', 'prompt engineering tool', 'system prompt tester'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Interactive Developer Lab",
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
    title: "Interactive Prompt & Agent Code Playground — Career Agents",
    description: "Test and customize 146 career agents in an interactive prompt playground. Experiment with system prompts, temperature controls, and LLM parameters.",
    url: "/playground",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Interactive Prompt & Agent Code Playground — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Prompt & Agent Code Playground — Career Agents",
    description: "Test and customize 146 career agents in an interactive prompt playground. Experiment with system prompts, temperature controls, and LLM parameters.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/playground" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Playground enables testing agent prompts against custom inputs.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
