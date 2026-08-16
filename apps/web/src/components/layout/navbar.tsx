"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Bot,
  Mic,
  GitBranch,
  Briefcase,
  Code2,
  BookOpen,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveFlyout(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveFlyout(null);
    }, 150);
  };

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  const productLinks = [
    { title: "Resume Studio", desc: "ATS audit & bullet rewrite engine", href: "/resume", icon: FileText },
    { title: "STAR Mock Lab", desc: "Interactive behavioral & system design coach", href: "/interview", icon: Mic },
    { title: "GitHub Analyzer", desc: "Proof-of-work codebase & test audits", href: "/github", icon: GitBranch },
    { title: "Coding Studio", desc: "240+ problems with 20 sandbox compilers", href: "/playground", icon: Code2 },
    { title: "MCP Tool Explorer", desc: "JSON-RPC 2.0 Model Context Protocol tools", href: "/mcp", icon: Terminal },
    { title: "Job Hub Tracker", desc: "Live application pipeline & kanban", href: "/tracker", icon: Briefcase },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 font-sans ${
        scrolled
          ? "bg-[#030712]/90 backdrop-blur-md border-b border-white/10 py-2.5 shadow-sm"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" variant="navbar" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1 backdrop-blur-md text-xs">
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("product")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeFlyout === "product"
                    ? "text-sky-300 bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Product</span>
                <ChevronDownIcon
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    activeFlyout === "product" ? "rotate-180 text-sky-400" : "text-slate-400"
                  }`}
                />
              </button>

              {activeFlyout === "product" && (
                <div
                  className="absolute top-full left-0 mt-2 w-80 p-2 rounded-2xl bg-[#070b14] border border-white/10 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseEnter={() => handleMouseEnter("product")}
                  onMouseLeave={handleMouseLeave}
                >
                  {productLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveFlyout(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 group-hover:scale-105 transition-transform shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/marketplace"
              className="px-3 py-1.5 font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              167 Agents
            </Link>

            <Link
              href="/pricing"
              className="px-3 py-1.5 font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Pricing
            </Link>

            <Link
              href="/demo"
              className="px-3 py-1.5 font-medium text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-full transition-colors border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
            >
              ★ Live Demo
            </Link>

            <Link
              href="/docs"
              className="px-3 py-1.5 font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Docs
            </Link>

            <Link
              href="/roadmap"
              className="px-3 py-1.5 font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              Roadmap
            </Link>

            <Link
              href="/about"
              className="px-3 py-1.5 font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Header Action Items */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Command Search Shortcut */}
            <button
              onClick={triggerCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg transition-colors"
            >
              <SearchIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-slate-300 border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* GitHub Repo Button */}
            <a
              href="https://github.com/karthikrshet/Career-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub</span>
            </a>

            {/* Primary Action Button */}
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={triggerCommandPalette}
              className="p-2 text-slate-300 hover:text-white bg-white/[0.04] border border-white/10 rounded-lg"
            >
              <SearchIcon className="w-4 h-4 text-sky-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-slate-300 hover:text-white bg-white/[0.04] border border-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b14]/98 border-b border-white/10 backdrop-blur-2xl px-4 py-5 space-y-3 font-sans animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1.5 text-xs font-medium">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              Dashboard
            </Link>
            <Link href="/resume" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              Resume Studio
            </Link>
            <Link href="/interview" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              STAR Interview Lab
            </Link>
            <Link href="/github" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              GitHub Analyzer
            </Link>
            <Link href="/playground" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              Coding Studio
            </Link>
            <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              167 Agents Ecosystem
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              Pricing
            </Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-sky-400 hover:bg-white/[0.03] rounded-lg">
              Docs &amp; MCP Specs
            </Link>
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button className="w-full bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs py-2 rounded-lg">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export { MarketingNavbar as Navbar };
