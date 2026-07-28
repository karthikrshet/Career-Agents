// apps/web/src/app/terms/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-20 relative">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-6">Terms of Service</h1>
        <p className="text-xs text-slate-500 mb-8">Last updated: July 29, 2026</p>

        <div className="space-y-6 text-xs text-slate-400 leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white">1. Service Licensing</h3>
            <p>Career Agents is licensed under the open-source MIT License. You are free to download, edit, copy, and bundle it for commercial or private operations subject to the license conditions.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white">2. Acceptable Use</h3>
            <p>You may not launch automated scrapers or flood request traffic against our hosted completion API gateways. Excessive API calls will trigger rate limiter blocks and IP restrictions.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white">3. Disclaimer of Warranties</h3>
            <p>This software is provided 'as is', without warranty of any kind, express or implied. Under no circumstances shall the authors be liable for any claims or damages.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
