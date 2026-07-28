// apps/web/src/app/privacy/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-20 relative">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-6">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mb-8">Last updated: July 29, 2026</p>

        <div className="space-y-6 text-xs text-slate-400 leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white">1. Information We Collect</h3>
            <p>We only collect anonymized telemetry data (session length, page views, and component usage triggers) on our hosted deployment. If you fork, download, or run this repository locally in sandbox environments, no tracking events are sent to our database.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white">2. Resume and Input Containing Credentials</h3>
            <p>Uploaded documents, resume files, and code scripts are processed temporarily to run evaluations and compile outputs. Your files are not cached, saved, or used to fine-tune third-party LLM providers.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-white">3. Third Party Providers</h3>
            <p>API requests are routed to selected providers (Gemini, Claude, OpenAI) based on your custom active settings. These requests are subject to the respective providers' privacy policies.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
