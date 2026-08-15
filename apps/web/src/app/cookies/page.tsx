"use client";

import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Shield className="w-3.5 h-3.5" /> Cookie Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Cookie Policy</h1>
          <p className="text-xs font-mono text-slate-500">Effective Date: August 15, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal p-6 sm:p-8 rounded-2xl bg-[#070b14] border border-white/10">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">1. Essential Functional Cookies Only</h2>
            <p>
              Career Agents only sets strictly necessary functional cookies and browser storage items required for session management, user theme preferences (dark mode), and active LLM provider selection.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">2. No Third-Party Tracking</h2>
            <p>
              We do not inject third-party advertising pixels, behavioral marketing beacons, or cross-site tracking scripts into your browsing sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-white">3. Managing Local Storage</h2>
            <p>
              You can clear all stored resumes, mock recordings, and candidate metrics at any time directly through your browser's Developer Tools or via the in-app Settings panel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
