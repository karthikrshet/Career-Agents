"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Suspense } from "react";
import { MarketingNavbar } from "./marketing-navbar";
import { MarketingFooter } from "./marketing-footer";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useStore((s) => s.settings.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    function applyTheme() {
      root.classList.remove("light", "dark");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  const consoleRoutes = [
    "/dashboard", "/resume", "/github", "/linkedin", "/interview",
    "/copilot", "/jobs", "/tracker", "/prephub", "/playground",
    "/linkedin-ai", "/reports", "/workflows", "/marketplace",
    "/mcp", "/settings", "/about", "/credits", "/demo"
  ];

  const isMarketing = !consoleRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));

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
