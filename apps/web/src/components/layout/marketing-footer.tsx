"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Shield, MessageSquare, Mail, Heart, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function MarketingFooter() {
  const [cookieConsent, setCookieConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setCookieConsent(false);
    }
  }, []);

  const handleConsent = (decision: "accepted" | "declined") => {
    localStorage.setItem("cookie_consent", decision);
    setCookieConsent(true);
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950 relative z-10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Newsletter & Brand Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 pb-16 border-b border-slate-900/80 mb-16">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Career Agents Logo" width={40} height={40} className="w-10 h-10" />
              <span className="font-bold text-xl tracking-tight text-white">Career Agents</span>
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                Open Source
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The 146-agent Career Operating System. Join our newsletter to get weekly open-source ecosystem updates, registry models, and career frameworks.
            </p>
          </div>
          <div className="flex w-full max-w-md items-center space-x-2">
            <input 
              type="email" 
              placeholder="developer@career-agents.com" 
              className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20">
              Subscribe
            </Button>
          </div>
        </div>

        {/* 5-Column Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-12 text-xs text-slate-400 mb-16">
          
          <div className="space-y-4">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">Product</h5>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/resume" className="hover:text-indigo-400 transition-colors">Resume Studio</Link></li>
              <li><Link href="/github" className="hover:text-indigo-400 transition-colors">GitHub Analyzer</Link></li>
              <li><Link href="/interview" className="hover:text-indigo-400 transition-colors">Interview Lab</Link></li>
              <li><Link href="/jobs" className="hover:text-indigo-400 transition-colors">Job Hub</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">Developers</h5>
            <ul className="space-y-3">
              <li><Link href="/docs" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
              <li><Link href="/api/docs" className="hover:text-indigo-400 transition-colors">API Reference</Link></li>
              <li><Link href="/mcp" className="hover:text-indigo-400 transition-colors">MCP Server</Link></li>
              <li><Link href="/opensource" className="hover:text-indigo-400 transition-colors">Open Source</Link></li>
              <li><Link href="/demo" className="hover:text-indigo-400 transition-colors">QA Diagnostics</Link></li>
              <li><a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors flex items-center gap-1">GitHub Repo <ArrowRight className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">Company</h5>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
              <li><Link href="/changelog" className="hover:text-indigo-400 transition-colors">Changelog</Link></li>
              <li><Link href="/roadmap" className="hover:text-indigo-400 transition-colors">Roadmap</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">Resources</h5>
            <ul className="space-y-3">
              <li><Link href="/help" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link href="/community" className="hover:text-indigo-400 transition-colors">Community</Link></li>
              <li><Link href="/guides" className="hover:text-indigo-400 transition-colors">Career Guides</Link></li>
              <li><Link href="/templates" className="hover:text-indigo-400 transition-colors">Resume Templates</Link></li>
              <li><Link href="/interview" className="hover:text-indigo-400 transition-colors">Interview Questions</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">Legal</h5>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-indigo-400 transition-colors">Security Overview</Link></li>
              <li><Link href="/cookies" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/dpa" className="hover:text-indigo-400 transition-colors">Data Processing (DPA)</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Social & Copyright row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-900 text-[11px] text-slate-500">
          
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Career Agents. All rights reserved.</span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-slate-800" />
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All Systems Operational
            </span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-slate-800" />
            <span className="hidden md:inline-flex text-slate-400 font-mono">v10.0.0</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            </a>
            <a href="https://twitter.com/karthikrshet" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="https://discord.gg/careeragents" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">Discord</span>
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>

      {/* GDPR Cookie Consent */}
      <AnimatePresence>
        {!cookieConsent && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm bg-slate-900 border border-slate-800 shadow-2xl p-4 rounded-xl z-50 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white">We use cookies</h4>
              </div>
              <button onClick={() => handleConsent("declined")} className="text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              We use essential cookies to maintain your session and preferences. We do not track you across other sites.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleConsent("accepted")} className="w-full bg-white text-black hover:bg-slate-200 text-xs h-8">
                Accept all
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleConsent("declined")} className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 text-xs h-8">
                Decline
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
