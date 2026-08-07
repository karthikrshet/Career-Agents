import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parse-Safe ATS Resume Templates & STAR Prompt Examples — Career Agents",
  description: "Download free parse-safe ATS resume templates in Markdown, LaTeX, and HTML. Access proven STAR prompt examples for software engineers and product managers.",
  keywords: ['ATS resume templates', 'markdown resume template', 'latex resume template', 'STAR prompt examples', 'parse safe resume'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Templates & Downloads",
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
    title: "Parse-Safe ATS Resume Templates & STAR Prompt Examples — Career Agents",
    description: "Download free parse-safe ATS resume templates in Markdown, LaTeX, and HTML. Access proven STAR prompt examples for software engineers and product managers.",
    url: "/templates",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Parse-Safe ATS Resume Templates & STAR Prompt Examples — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parse-Safe ATS Resume Templates & STAR Prompt Examples — Career Agents",
    description: "Download free parse-safe ATS resume templates in Markdown, LaTeX, and HTML. Access proven STAR prompt examples for software engineers and product managers.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/templates" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Templates provides downloadable ATS-ready resume templates and STAR prompts.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
