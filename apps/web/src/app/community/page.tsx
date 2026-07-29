"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight, GitBranch, ShieldAlert, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function CommunityPage() {
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
            <Sparkles className="w-3.5 h-3.5" /> Platform Community Ecosystem
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Connect with thousands of <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">AI Engineers</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discuss prompt strategies, custom agent definitions, workflow extensions, and share interview preparation guides.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-12">
        {/* Core Spaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-900 bg-slate-900/30">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">GitHub Discussions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask questions, share ideas, and showcase what you've built using the Career Agents framework. Participate in the RFC process for registry upgrades.
              </p>
              <a href="https://github.com/karthikrshet/Career-Agents/discussions" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-8">
                  Open Discussions <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="border-slate-900 bg-slate-900/30">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Discord Chat Server</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Join real-time channels to chat with other job seekers and developers. Get support for local MCP setup and VM compiling execution.
              </p>
              <a href="https://discord.gg/careeragents" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button size="sm" variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs font-semibold h-8">
                  Join Discord <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Community Guidelines */}
        <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/20 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Community Code of Conduct</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            We are dedicated to providing a harassment-free community experience for everyone, regardless of background, gender, sexual orientation, disability, physical appearance, or technology choices. We expect cooperation from all participants to help ensure a safe, inclusive, and welcoming environment.
          </p>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-slate-900 bg-slate-950 py-16 text-center space-y-4">
        <div className="max-w-xl mx-auto px-6 space-y-2">
          <Heart className="w-8 h-8 text-rose-500 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white tracking-tight">Contributing to Career Agents</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            As an open-source tool, we rely heavily on community contributions. Whether you submit bug reports, improve docs, or implement new agents, you make the platform better.
          </p>
          <div className="pt-2">
            <Link href="/opensource">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10">
                Explore Open Source Program
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
