"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Suspense } from "react";
import { MarketingNavbar } from "./marketing-navbar";
import { MarketingFooter } from "./marketing-footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const marketingRoutes = [
    "/features", "/pricing", "/enterprise", "/opensource",
    "/roadmap", "/changelog", "/blog", "/docs", "/contact",
    "/security", "/privacy", "/terms"
  ];

  const isMarketing = pathname === "/" || marketingRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));

  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-foreground scroll-smooth">
        <MarketingNavbar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
