"use client";

import Link from "next/link";
import { ArrowLeft, HelpCircle, Settings, Key, BookOpen, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I configure API keys for Groq, Gemini, or OpenAI?",
      a: "Go to Settings in the console workspace. Under 'AI Providers', you can add keys for your preferred gateway endpoints. Key validation runs locally and keys never leave your device.",
    },
    {
      q: "Does my uploaded resume leave my browser?",
      a: "No. The parsing and extraction are conducted locally in-memory or via private local SQLite database. We never sell, index, or train models on your candidate profile data.",
    },
    {
      q: "How do I connect the MCP Server to Claude Code or Cursor?",
      a: "Our MCP server is JSON-RPC 2.0 compliant. Run `npm run mcp` inside your terminal, then copy the server config block from `/mcp` directly into your `.cursor/mcp.json` or Claude Desktop configuration.",
    },
    {
      q: "How does the Coding Studio 20-Language execution sandbox work?",
      a: "The playground connects to high-throughput isolated sandboxes supporting C++, Java, Python, TypeScript, Rust, Go, and Swift with sub-50ms execution test judging.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <HelpCircle className="w-3.5 h-3.5" /> Knowledge Base &amp; FAQ
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How Can We <span className="text-sky-400">Help You?</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Find documentation, platform configuration guides, and step-by-step troubleshooting for Career Agents.
          </p>
        </div>

        {/* Help Topic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Getting Started</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Learn how to initialize your local SQLite workspace, import resumes, and configure theme preferences.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">LLM Gateways</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Connect OpenAI, Gemini, Groq, Anthropic, or Ollama local models with automatic fallback loops.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">MCP Protocol</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Expose 31 career optimization tools directly to Claude Code, Cursor, Windsurf, or Antigravity IDE.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 rounded-2xl bg-[#070b14] border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help Box */}
        <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Still have questions?</h3>
            <p className="text-xs text-slate-400 mt-0.5">Our developer team is available to help with integration support.</p>
          </div>
          <Link href="/contact">
            <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg shrink-0">
              <span>Contact Support</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
