import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operational Career Workflows & Execution Pipelines — Career Agents",
  description: "Execute structured multi-step career workflows: FAANG Interview Week, 7-Day ATS Resume Sprint, Technical Salary Negotiation, and Remote Job Hunt Pipeline.",
  keywords: ['career workflows', 'multi-step career pipeline', 'FAANG interview week', '7 day resume sprint', 'technical salary negotiation workflow'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Workflows & Automation",
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
    title: "Operational Career Workflows & Execution Pipelines — Career Agents",
    description: "Execute structured multi-step career workflows: FAANG Interview Week, 7-Day ATS Resume Sprint, Technical Salary Negotiation, and Remote Job Hunt Pipeline.",
    url: "/workflows",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Operational Career Workflows & Execution Pipelines — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Operational Career Workflows & Execution Pipelines — Career Agents",
    description: "Execute structured multi-step career workflows: FAANG Interview Week, 7-Day ATS Resume Sprint, Technical Salary Negotiation, and Remote Job Hunt Pipeline.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/workflows" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Workflows presents step-by-step career execution pipelines.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
