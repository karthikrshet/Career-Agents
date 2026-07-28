"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Shield, MessageSquare, Mail, Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    <footer className="border-t border-slate-900 bg-slate-950/40 relative z-10 py-16">
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-6 gap-8 text-xs text-slate-400 mb-12">
        <div className="space-y-4 col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Career Agents Logo" width={32} height={32} className="w-8 h-8" />
            <span className="font-semibold text-sm tracking-tight text-white">Career Agents</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
            The Open Source AI Career Operating System for software developers. Systemizing professional growth with multi-agent orchestration.
          </p>
          <div className="flex items-center gap-3 text-slate-500 pt-2">
            <a href="https://github.com/karthikrshet/Career-Agents" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a href="https://discord.gg/careeragents" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Discord">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="https://twitter.com/careeragents" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="mailto:support@careeragents.com" className="hover:text-white transition" aria-label="Email">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 mb-4 text-[10px] uppercase tracking-wider">Product</h5>
          <ul className="space-y-2 text-[10px] text-slate-500">
            <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            <li><Link href="/roadmap" className="hover:text-white transition">Roadmap</Link></li>
            <li><Link href="/changelog" className="hover:text-white transition">Changelog</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 mb-4 text-[10px] uppercase tracking-wider">Developers</h5>
          <ul className="space-y-2 text-[10px] text-slate-500">
            <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
            <li><Link href="/opensource" className="hover:text-white transition">Contributing</Link></li>
            <li><Link href="/mcp" className="hover:text-white transition">MCP Server</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Tech Blog</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 mb-4 text-[10px] uppercase tracking-wider">Company</h5>
          <ul className="space-y-2 text-[10px] text-slate-500">
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Sales</Link></li>
            <li><Link href="/security" className="hover:text-white transition">Security Portal</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 mb-4 text-[10px] uppercase tracking-wider">Newsletter</h5>
          <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
            Get product updates and new agent releases weekly.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="you@domain.com"
              required
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-slate-700 w-full"
            />
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg py-1.5 text-[10px] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-900/60 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 gap-4">
        <div className="flex items-center gap-1.5">
          <span>&copy; {new Date().getFullYear()} Career Agents.</span>
          <span className="flex items-center gap-0.5">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by karthikrshet.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          <span className="text-slate-700">|</span>
          <span>Version 4.0.0 (MIT License)</span>
        </div>
      </div>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {!cookieConsent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 max-w-sm border border-slate-900 bg-slate-950/95 backdrop-blur-md p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-3"
          >
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                We use cookies to analyze traffic on our hosted deployment. No tracking keys are stored for local clones or repository forks.
              </p>
            </div>
            <div className="flex justify-end gap-2 text-[10px]">
              <button
                onClick={() => handleConsent("declined")}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
              >
                Decline
              </button>
              <button
                onClick={() => handleConsent("accepted")}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition font-medium"
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
