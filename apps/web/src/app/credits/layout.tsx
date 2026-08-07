import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Credits, Open Source Licenses & Changelog — Career Agents",
  description: "View open source contributions, underlying open-source technologies, multi-provider AI model router credits, and platform release notes.",
  keywords: ['career agents credits', 'open source license MIT', 'tech stack credits', 'AI model router', 'platform changelog'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Platform & Legal Credits",
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
    title: "Platform Credits, Open Source Licenses & Changelog — Career Agents",
    description: "View open source contributions, underlying open-source technologies, multi-provider AI model router credits, and platform release notes.",
    url: "/credits",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Platform Credits, Open Source Licenses & Changelog — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Credits, Open Source Licenses & Changelog — Career Agents",
    description: "View open source contributions, underlying open-source technologies, multi-provider AI model router credits, and platform release notes.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/credits" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Credits page attributes open source libraries, model providers, and platform maintainers.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
