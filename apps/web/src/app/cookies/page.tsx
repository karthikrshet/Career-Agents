"use client";

import Link from "next/link";
import { Shield, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] uppercase font-bold tracking-wider text-indigo-400">
            <Shield className="w-3.5 h-3.5" /> Privacy & Cookies Transparency
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Cookie <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Understand how we use cookies and state persistence options to manage your preferences.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full space-y-8 text-slate-300">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">1. What are Cookies?</h3>
          <p className="text-xs leading-relaxed">
            Cookies are small text files placed on your device to store preferences, settings, and session status when you browse websites.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">2. How We Use Cookies</h3>
          <p className="text-xs leading-relaxed">
            Career Agents utilizes cookies and `localStorage` serialized frames strictly for essential app functionalities:
          </p>
          <ul className="text-xs space-y-2 list-disc list-inside">
            <li><strong>Session Management:</strong> Storing JWT login parameters to keep you authenticated inside NextAuth paths.</li>
            <li><strong>User Preferences:</strong> Storing theme flags (dark/light), active AI providers, models cache configurations, and playground text buffers.</li>
            <li><strong>Workflow Configurations:</strong> Storing state values, node properties, and steps layouts in the local builder.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">3. Your Cookie Control Rights</h3>
          <p className="text-xs leading-relaxed">
            You can select 'Decline' in our GDPR banner or configure your browser block options. Note that disabling essential cookies will restrict auth sessions and reset provider persistence.
          </p>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-slate-900 bg-slate-950 py-16 text-center space-y-4">
        <div className="max-w-xl mx-auto px-6 space-y-2">
          <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white tracking-tight">Complete Privacy Overview</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Read our Privacy Policy to understand database storage encryption and model processing parameters.
          </p>
          <div className="pt-2">
            <Link href="/privacy">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
                Go to Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
