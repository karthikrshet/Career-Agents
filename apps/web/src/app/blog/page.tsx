"use client";

import { ArrowLeft, BookOpen, Clock, User, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      slug: "orchestrating-167-specialized-agents",
      title: "Orchestrating 167 Specialized AI Agents Concurrently",
      desc: "How we built the sub-100ms intent classifier and DAG scheduler to delegate career coaching instructions across 19 divisions.",
      author: "Core Architecture Team",
      date: "August 10, 2026",
      readTime: "6 min read",
      tag: "Architecture",
    },
    {
      slug: "forensic-resume-star-audits",
      title: "Inside the Forensic Resume STAR Bullet Audits",
      desc: "An in-depth look at keyword calibration algorithms, metric density audits, and high-impact Google XYZ bullet rewriting.",
      author: "Resume Studio Lead",
      date: "July 24, 2026",
      readTime: "8 min read",
      tag: "ATS Systems",
    },
    {
      slug: "mcp-json-rpc-developer-tools",
      title: "Building 31 Model Context Protocol (MCP) Tools for Coding Assistants",
      desc: "Connecting local resume auditors, salary benchmark negotiators, and mock interview labs directly into Claude Code & Cursor.",
      author: "Protocols & Runtime",
      date: "July 12, 2026",
      readTime: "5 min read",
      tag: "MCP Protocols",
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
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Engineering &amp; Research
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Developer <span className="text-sky-400">Blog</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Deep architectural breakdowns on agent orchestration, ATS scoring heuristics, and Model Context Protocol (MCP) integrations.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.title}
              className="p-6 rounded-2xl bg-[#070b14] border border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-400/20">
                    {post.tag}
                  </span>
                  <span className="text-slate-400">{post.readTime}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {post.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{post.date}</span>
                <span className="text-sky-400 flex items-center gap-1 font-sans font-semibold">
                  Read Article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
