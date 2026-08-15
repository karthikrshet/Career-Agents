"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight, GitBranch, Sparkles, Heart, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
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
            <Users className="w-3.5 h-3.5" /> Global Developer Community
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Connect with Thousands of <span className="text-sky-400">Software Engineers</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Discuss interview strategy, design custom agent prompt templates, and participate in RFC proposals for the Career Agents ecosystem.
          </p>
        </div>

        {/* Community Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">GitHub Discussions &amp; RFCs</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Ask architectural questions, propose new specialized agent roles, and contribute to the open-source pipeline roadmap.
              </p>
            </div>
            <a
              href="https://github.com/karthikrshet/Career-Agents/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-4 py-2 rounded-lg">
                <span>Open Discussions</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-[#070b14] border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Community Discord Server</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Join live audio mock prep channels, share interview feedback, and get troubleshooting support for local MCP setups.
              </p>
            </div>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10 text-xs font-medium px-4 py-2 rounded-lg">
                <span>Join Discord</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-sky-400" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
