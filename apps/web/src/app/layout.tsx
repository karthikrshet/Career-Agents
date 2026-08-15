import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "@/lib/env";
import { Toaster } from "sonner";
import { JsonLd } from "@/components/seo/json-ld";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://career-agents.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Career Agents — AI Career Intelligence Platform & ATS Resume Studio",
    template: "%s | Career Agents",
  },
  description:
    "Career Agents is an enterprise-grade AI career intelligence platform with 167 specialized agents for real-time ATS resume scoring, GitHub portfolio auditing, LinkedIn optimization, AI mock interviews, STAR accomplishments, and automated job tracking.",
  keywords: [
    "career agents", "AI career platform", "resume analyzer", "ATS score", "GitHub portfolio audit",
    "LinkedIn optimizer", "interview prep AI", "job tracker", "career copilot", "AI agents",
    "career intelligence", "software engineer career", "technical interview prep", "STAR method",
    "Model Context Protocol MCP", "career coaching AI", "resume ATS checker", "Product Manager resume score",
    "AI engineer resume ATS", "Data Scientist resume ATS", "Cybersecurity resume audit", "AEO AI discovery",
    "Generative Engine Optimization GEO", "SearchGPT career tools", "resume bullet optimizer",
  ],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Career & Productivity Technology",
  classification: "Enterprise Software Application & Career Intelligence",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-US": baseUrl,
      "x-default": baseUrl,
    },
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Career Agents — AI Career Intelligence Platform & ATS Resume Studio",
    description:
      "167 specialized AI agents for resume ATS scoring, GitHub auditing, LinkedIn optimization, and mock interview practice. Open source career copilot.",
    siteName: "Career Agents",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Career Agents — AI Career Intelligence Platform & ATS Resume Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Agents — AI Career Intelligence Platform",
    description:
      "167 specialized AI agents for resume ATS scoring, GitHub portfolio reviews, LinkedIn optimization, and interview coaching.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@karthikrshet",
    site: "@careeragents",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/branding/logo.svg", type: "image/svg+xml" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    other: [{ rel: "mask-icon", url: "/favicon.svg" }],
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
    yandex: process.env.YANDEX_VERIFICATION || "",
  },
  other: {
    "msapplication-TileColor": "#070d1f",
    "theme-color": "#3b82f6",
    // GEO (Geographic Engine Optimization) Metatags
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    // AEO (Answer Engine Optimization for ChatGPT / Perplexity / SearchGPT)
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Career Agents is an open source AI platform providing 167 career agents for ATS resume scoring, STAR bullet optimization, technical interview coaching, and career path planning.",
    "aeo-purpose": "AI Career Assistant & Real ATS Resume Analyzer",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        <JsonLd />
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(222 47% 6%)",
              border: "1px solid hsl(222 47% 12%)",
              color: "hsl(213 31% 91%)",
            },
          }}
        />
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(reg) {
                      console.log('[Career Agents] SW registered:', reg.scope);
                    })
                    .catch(function(err) {
                      console.warn('[Career Agents] SW registration failed:', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
