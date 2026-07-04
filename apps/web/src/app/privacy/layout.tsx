import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Security — Career Agents",
  description: "Read Career Agents Privacy Policy. We prioritize candidate privacy — your resume and personal data stay in your browser local storage unless explicitly synced.",
  keywords: ['privacy policy', 'data security', 'local storage privacy', 'zero data retention', 'resume privacy'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Legal & Privacy",
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
    title: "Privacy Policy & Data Security — Career Agents",
    description: "Read Career Agents Privacy Policy. We prioritize candidate privacy — your resume and personal data stay in your browser local storage unless explicitly synced.",
    url: "/privacy",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Privacy Policy & Data Security — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Data Security — Career Agents",
    description: "Read Career Agents Privacy Policy. We prioritize candidate privacy — your resume and personal data stay in your browser local storage unless explicitly synced.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/privacy" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Privacy policy outlines data security practices and zero-tracking options.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
