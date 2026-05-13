// apps/web/src/app/blog/page.tsx
"use client";

import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "Orchestrating 146 Specialized Agents Concurrently",
      desc: "How we built the low-latency intent classifier and planner to delegate career coaching instructions.",
      author: "Lead Architect",
      date: "July 28, 2026",
      readTime: "6 min read"
    },
    {
      title: "Inside the Forensic Resume STAR Bullet Audits",
      desc: "An in-depth look at semantic density mapping, metric compliance audits, and passive verb replacements.",
      author: "Co-Maintainer",
      date: "July 12, 2026",
      readTime: "8 min read"
    },
    {
      title: "SSRF Hardening and Secure Code Sandboxes",
      desc: "Protecting local networks during document retrieval and executing user scripts safely via Piston.",
      author: "SecOps Engineer",
      date: "June 29, 2026",
      readTime: "5 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative py-20">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <div className="max-w-2xl mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Developer Blog
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            System design, AI models integrations, and career strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {posts.map(post => (
            <div key={post.title} className="border border-slate-900 bg-slate-950/40 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition">
              <div>
                <div className="flex items-center gap-2 text-[9px] text-slate-500 mb-3">
                  <BookOpen className="w-3 h-3 text-indigo-400" />
                  <span>Engineering</span>
                </div>
                <h3 className="text-xs font-bold text-white mb-2 leading-snug hover:text-indigo-300 cursor-pointer">{post.title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-6">{post.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-[9px] text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
