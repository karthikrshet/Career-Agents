import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings, AI Model Gateway & Preferences — Career Agents",
  description: "Configure multi-provider AI gateways (Groq, Gemini, OpenAI, Claude, Ollama), customize theme preferences, manage API keys, and update profile metrics.",
  keywords: ['settings', 'AI gateway configuration', 'Groq API key settings', 'Gemini Claude OpenAI setup', 'career profile preferences'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "App Settings & Configuration",
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
    title: "Account Settings, AI Model Gateway & Preferences — Career Agents",
    description: "Configure multi-provider AI gateways (Groq, Gemini, OpenAI, Claude, Ollama), customize theme preferences, manage API keys, and update profile metrics.",
    url: "/settings",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Account Settings, AI Model Gateway & Preferences — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Account Settings, AI Model Gateway & Preferences — Career Agents",
    description: "Configure multi-provider AI gateways (Groq, Gemini, OpenAI, Claude, Ollama), customize theme preferences, manage API keys, and update profile metrics.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/settings" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Settings page allows users to configure LLM API keys, provider priorities, and application defaults.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
