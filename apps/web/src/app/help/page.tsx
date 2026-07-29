"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight, HelpCircle, FileText, Settings, Key, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function HelpPage() {
  const faqs = [
    { q: "How do I configure API keys for Groq or Gemini?", a: "Go to the Settings panel inside the Console workspace. Under 'AI Providers', configure keys for your preferred gateway endpoints. Key validation runs instantly." },
    { q: "Does my uploaded resume leave the browser?", a: "No. The parsing is done entirely in memory or via secure backend extraction. We do not index or store your raw PDF file unless you select Cloud DB Sync explicitly." },
    { q: "What is Platform Demo Mode?", a: "Demo Mode enables offline presentation mocks. It skips network calls and simulates standard outputs for offline founder presentation events." },
    { q: "How does the VM code execution fallback work?", a: "If the remote Piston compile servers are offline or rate-limiting, the playground executes Javascript/TypeScript code in a local secure virtual machine context in your browser/server process, capturing stdout and evaluation times." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navbar Hero */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-white text-base tracking-tight hover:opacity-90 transition-opacity">
            <span className="bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">Career Agents</span>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
              Launch Console
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] uppercase font-bold tracking-wider text-indigo-400">
            <HelpCircle className="w-3.5 h-3.5" /> Help Center & Support
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How can we <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">help you</span> today?
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Find documentation, platform configuration guides, and step-by-step assistance for Career Agents.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-900 bg-slate-900/30">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Settings className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Getting Started</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn how to initialize your workspace settings, setup custom integrations, and configure themes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-900 bg-slate-900/30">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Key className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">API Gateway Configuration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect LLM endpoints like OpenAI, Gemini, Groq, and OpenRouter with automatic provider persistence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-900 bg-slate-900/30">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Resume Studio & ATS</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure parsing rules for PDF, DOCX, TXT, and Markdown files to maximize keyword extraction.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                <h4 className="font-bold text-sm text-white">{faq.q}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-slate-900 bg-slate-950 py-16 text-center space-y-4">
        <div className="max-w-xl mx-auto px-6 space-y-2">
          <BookOpen className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white tracking-tight">Need further help or want to report a bug?</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Check out our developer docs, join discussions on Discord, or open an issue on the repository page.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/docs">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
                Browse Docs
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs font-semibold">
                Submit Support Request
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
