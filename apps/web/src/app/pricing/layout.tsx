import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free & Open Source Access — Career Agents Pricing",
  description: "Career Agents is free and open source. Use your own API keys (Groq, Gemini, OpenAI, Claude, Ollama) or run completely local models with 0 platform fees.",
  keywords: ['career agents pricing', 'free ATS resume analyzer', 'open source AI pricing', 'bring your own key BYOK', 'local LLM free'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Pricing & Access",
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
    title: "Free & Open Source Access — Career Agents Pricing",
    description: "Career Agents is free and open source. Use your own API keys (Groq, Gemini, OpenAI, Claude, Ollama) or run completely local models with 0 platform fees.",
    url: "/pricing",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free & Open Source Access — Career Agents Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free & Open Source Access — Career Agents Pricing",
    description: "Career Agents is free and open source. Use your own API keys (Groq, Gemini, OpenAI, Claude, Ollama) or run completely local models with 0 platform fees.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/pricing" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Pricing page details the free open-source model and BYOK access.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
