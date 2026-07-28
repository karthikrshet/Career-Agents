"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
          <Image src="/logo.svg" alt="Career Agents Logo" width={32} height={32} className="w-8 h-8" />
          <span className="font-semibold text-sm tracking-tight text-white">Career Agents</span>
        </Link>

        {/* Desktop navbar */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-white",
                  isActive ? "text-white font-semibold" : "text-slate-400"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/karthikrshet/Career-Agents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <Link href="/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/20">
              Launch App
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-slate-400 hover:text-white transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-900 bg-slate-950 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3 text-xs font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-1.5 transition-colors",
                    isActive ? "text-white font-semibold border-l-2 border-indigo-500 pl-2" : "text-slate-400 pl-2"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-900/60 pt-4 flex flex-col gap-3">
            <a
              href="https://github.com/karthikrshet/Career-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white py-1.5 pl-2 flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-lg">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
