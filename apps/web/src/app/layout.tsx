import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "@/lib/env";
import { Toaster } from "sonner";
import { JsonLd } from "@/components/seo/json-ld";
import dynamic from "next/dynamic";

const Sidebar = dynamic(
  () => import("@/components/layout/sidebar").then((mod) => mod.Sidebar),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://career-agents.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Career Agents — AI Career Intelligence Platform",
    template: "%s | Career Agents",
  },
  description:
    "Career Agents is an AI-powered career intelligence platform with 146 specialized agents for resume ATS analysis, GitHub portfolio auditing, LinkedIn optimization, AI mock interviews, and job tracking.",
  keywords: [
    "career OS", "AI career platform", "resume analyzer", "ATS score", "GitHub portfolio",
    "LinkedIn optimizer", "interview prep", "job tracker", "career copilot", "AI agents",
    "career intelligence", "software engineer career", "technical interview", "STAR method",
    "MCP model context protocol", "career coaching AI",
  ],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents",
  creator: "Karthik R Shet",
  category: "Career & Productivity",
  classification: "Software Application",
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
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Career Agents — AI Career Intelligence Platform",
    description:
      "146 specialized AI agents for resume analysis, GitHub auditing, LinkedIn optimization, and interview prep. The open-source career copilot for engineers.",
    siteName: "Career Agents",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Career Agents — AI Career Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Agents — AI Career Intelligence Platform",
    description:
      "146 specialized AI agents for resume, GitHub, LinkedIn, and interview coaching. Open source.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@karthikrshet",
  },
  icons: {
    icon: [
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/icon-512.png" }],
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  other: {
    "msapplication-TileColor": "#070d1f",
    "theme-color": "#3b82f6",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        <JsonLd />
        <div className="flex h-screen overflow-hidden">
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-hidden flex flex-col min-w-0">
            {children}
          </main>
        </div>
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
