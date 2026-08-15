"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Heart, ShieldCheck, Terminal, Bot } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const columns = [
    {
      title: "PRODUCT",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Resume Studio", href: "/resume" },
        { name: "GitHub Analyzer", href: "/github" },
        { name: "Interview Lab", href: "/interview" },
        { name: "Coding Studio", href: "/playground" },
        { name: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "DEVELOPERS",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "API Reference", href: "/docs" },
        { name: "MCP Server", href: "/mcp" },
        { name: "Open Source", href: "/opensource" },
        { name: "QA Diagnostics", href: "/reports" },
        { name: "GitHub Repo →", href: "https://github.com/karthikrshet/Career-Agents" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Changelog", href: "/changelog" },
        { name: "Roadmap", href: "/roadmap" },
        { name: "Credits & Acknowledgments", href: "/credits" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "RESOURCES",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Community", href: "/community" },
        { name: "Career Guides", href: "/guides" },
        { name: "Resume Templates", href: "/templates" },
        { name: "Interview Questions", href: "/prephub" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Security Overview", href: "/security" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Data Processing (DPA)", href: "/dpa" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#030612] text-slate-400 py-14 px-4 sm:px-6 lg:px-12 z-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Brand Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-white/[0.08]">
          <div className="space-y-2">
            <Logo size="lg" variant="footer" showVersion={true} />
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed font-normal">
              The Open-Source AI Career Intelligence Platform with 167 specialized agents across 19 technical divisions.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Local-First
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
              <Terminal className="w-3.5 h-3.5 text-sky-400" /> MCP Ready
            </span>
          </div>
        </div>

        {/* Sitemap Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {col.links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.name}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} Career Agents.</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
            <span>•</span>
            <Link href="/credits" className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-slate-400">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>by Karthik R Shet &amp; Open Source Contributors</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
