import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Career Agents Team & Enterprise Support",
  description: "Get in touch with the Career Agents core maintainers for technical support, enterprise inquiries, partnership opportunities, or feedback.",
  keywords: ['contact career agents', 'technical support', 'enterprise inquiry', 'Karthik R Shet contact', 'career OS support'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Support & Inquiries",
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
    title: "Contact Career Agents Team & Enterprise Support",
    description: "Get in touch with the Career Agents core maintainers for technical support, enterprise inquiries, partnership opportunities, or feedback.",
    url: "/contact",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Career Agents Team & Enterprise Support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Career Agents Team & Enterprise Support",
    description: "Get in touch with the Career Agents core maintainers for technical support, enterprise inquiries, partnership opportunities, or feedback.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/contact" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Contact page provides support channels and enterprise inquiry options.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
