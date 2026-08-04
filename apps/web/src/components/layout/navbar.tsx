"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  FileText,
  Bot,
  Mic,
  GitBranch,
  Briefcase,
  Code2,
  BookOpen,
  Terminal,
  GraduationCap,
  Users,
  ExternalLink
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Live GitHub Star fetch with failover to null
    fetch("https://api.github.com/repos/karthikrshet/Career-Agents")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => setStarCount(null));

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

  const toggleFlyout = (menuName: string) => {
    setActiveFlyout((prev) => (prev === menuName ? null : menuName));
  };

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  const productFlyout = [
    { title: "Resume Studio", desc: "ATS auditing & bullet rewriter", href: "/resume", icon: FileText },
    { title: "AI Copilot", desc: "Context-aware reasoning streams", href: "/copilot", icon: Bot },
    { title: "Interview Lab", desc: "STAR method voice mock sessions", href: "/interview", icon: Mic },
    { title: "GitHub Auditor", desc: "Code architecture & test analysis", href: "/github", icon: GitBranch },
    { title: "Job Hub Tracker", desc: "Kanban applications pipeline", href: "/tracker", icon: Briefcase },
  ];

  const solutionsFlyout = [
    { title: "Software Engineers", desc: "Senior & Staff interview prep", href: "/features", icon: Code2 },
    { title: "Students & Grads", desc: "Portfolio & resume building", href: "/features", icon: GraduationCap },
    { title: "Recruiters & Cohorts", desc: "Team candidate audits", href: "/enterprise", icon: Users },
  ];

  const developersFlyout = [
    { title: "MCP Tool Protocol", desc: "31 Model Context Protocol tools", href: "/mcp", icon: Terminal },
    { title: "146 AI Agent Registry", desc: "Browse specialized agent specs", href: "/marketplace", icon: Bot },
    { title: "Developer Docs", desc: "API specs & setup guides", href: "/docs", icon: BookOpen },
    { title: "GitHub Repository", desc: "Open-source codebase", href: "https://github.com/karthikrshet/Career-Agents", icon: Code2 },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#050814]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Canonical Logo */}
          <Logo size="md" variant="navbar" />

          {/* Desktop Nav Items with Interactive Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {/* Product Flyout */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("product")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleFlyout("product")}
                className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  activeFlyout === "product"
                    ? "text-cyan-300 bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Product</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeFlyout === "product" ? "rotate-180 text-cyan-300" : ""}`} />
              </button>

              {activeFlyout === "product" && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-[#090d18] border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={() => handleMouseEnter("product")}
                  onMouseLeave={handleMouseLeave}
                >
                  {productFlyout.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveFlyout(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-cyan-500/10 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-500/30">
                          <Icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300">{item.title}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Solutions Flyout */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("solutions")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleFlyout("solutions")}
                className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  activeFlyout === "solutions"
                    ? "text-purple-300 bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeFlyout === "solutions" ? "rotate-180 text-purple-300" : ""}`} />
              </button>

              {activeFlyout === "solutions" && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-[#090d18] border border-purple-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={() => handleMouseEnter("solutions")}
                  onMouseLeave={handleMouseLeave}
                >
                  {solutionsFlyout.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveFlyout(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-500/10 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-500/30">
                          <Icon className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-purple-300">{item.title}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Developers Flyout */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("developers")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleFlyout("developers")}
                className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  activeFlyout === "developers"
                    ? "text-indigo-300 bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Developers</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeFlyout === "developers" ? "rotate-180 text-indigo-300" : ""}`} />
              </button>

              {activeFlyout === "developers" && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-[#090d18] border border-indigo-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={() => handleMouseEnter("developers")}
                  onMouseLeave={handleMouseLeave}
                >
                  {developersFlyout.map((item) => {
                    const Icon = item.icon;
                    const isExternal = item.href.startsWith("http");
                    return isExternal ? (
                      <a
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setActiveFlyout(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-500/10 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-indigo-500/30">
                          <Icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-indigo-300 flex items-center gap-1">
                            {item.title} <ExternalLink className="w-3 h-3 text-slate-400" />
                          </div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </a>
                    ) : (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveFlyout(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-500/10 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-indigo-500/30">
                          <Icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-indigo-300">{item.title}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link
              href="/pricing"
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Pricing
            </Link>

            <Link
              href="/docs"
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Docs
            </Link>

            <Link
              href="/roadmap"
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Roadmap
            </Link>

            <Link
              href="/about"
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Command Search */}
            <button
              onClick={triggerCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-slate-300 border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* GitHub Repo Button (Real API or Star on GitHub fallback, NO FAKE STARS) */}
            <a
              href="https://github.com/karthikrshet/Career-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{starCount !== null ? `Star (${starCount})` : "Star on GitHub"}</span>
            </a>

            {/* Launch App Primary Button */}
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] transition-all duration-200"
              >
                Launch App
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={triggerCommandPalette}
              className="p-2 text-slate-300 hover:text-white bg-white/5 border border-white/10 rounded-lg"
            >
              <Search className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-slate-300 hover:text-white bg-white/5 border border-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b14]/98 border-b border-white/10 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              Dashboard
            </Link>
            <Link href="/resume" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              Resume Studio
            </Link>
            <Link href="/interview" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              Interview Lab
            </Link>
            <Link href="/github" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              GitHub Auditor
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              Pricing &amp; Plans
            </Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              Docs &amp; MCP Specs
            </Link>
            <Link href="/roadmap" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              Roadmap
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              About
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 hover:text-cyan-300 rounded-lg">
              Contact
            </Link>
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl">
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
