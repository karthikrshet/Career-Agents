import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Career OS — Career Intelligence Platform",
    template: "%s | Career OS",
  },
  description:
    "Career OS is an AI-powered career intelligence platform with 146 specialized agents for resume analysis, GitBranch auditing, interview preparation, and job tracking.",
  keywords: ["career", "AI agents", "resume", "interview", "job tracker", "career OS"],
  openGraph: {
    type: "website",
    title: "Career OS",
    description: "AI-powered Career Intelligence Platform",
    siteName: "Career OS",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
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
      </body>
    </html>
  );
}


