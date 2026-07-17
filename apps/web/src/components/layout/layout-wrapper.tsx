"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Suspense, useEffect } from "react";
import { MarketingNavbar } from "./navbar";
import { Footer } from "./footer";
import { useStore } from "@/lib/store";

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
    "/mcp", "/settings", "/credits", "/demo"
  ];

  const isMarketing = !consoleRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));

  if (isMarketing) {
    if (pathname === "/") {
      return (
        <div className="min-h-screen flex flex-col bg-[#030712] text-foreground font-sans">
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col bg-[#030712] text-foreground scroll-smooth font-sans">
        <MarketingNavbar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#030712] text-foreground font-sans">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
