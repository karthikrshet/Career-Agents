"use client";

import { ArrowLeft, BookOpen, Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const BLOG_POSTS = {
  "orchestrating-146-specialized-agents": {
    title: "Orchestrating 146 Specialized Agents Concurrently",
    author: "Lead Architect",
    date: "July 28, 2026",
    readTime: "6 min read",
    content: `
At Career Agents, our primary challenge is helping developers navigate their careers with maximum coverage of various domains—ranging from FAANG companies to cybersecurity start-ups. In total, the system maintains **146 specialized AI agents**, each calibrated for highly target-specific prompt tasks.

### The Problem: Single-Agent Coherence Bottlenecks
Traditional chat agents suffer from prompt pollution when tasked with diverse operations simultaneously. An agent designed to check resume compliance under the ATS standards should not worry about how to structure a response for a Google behavioral mock interview.

### The Solution: Multi-Agent Hub and Spoke Architecture
We built a centralized brain router that processes instructions in two distinct phases:

1. **Intent Classification & Extraction**: When you submit a request, the router maps your text vectors against the registry map to extract active target parameters.
2. **Context Routing**: The router delegates execution to a specialized subgroup (e.g. Resume Studio, Interview Lab, or FAANG Tracker) dynamically.

By limiting each sub-agent's context window only to its micro-registry definition and task rules, we maintain near-zero prompt hallucination rates and slash API response latency by **45%** on average.
`
  },
  "forensic-resume-star-audits": {
    title: "Inside the Forensic Resume STAR Bullet Audits",
    author: "Co-Maintainer",
    date: "July 12, 2026",
    readTime: "8 min read",
    content: `
Resumes remain the single most critical gating mechanism in the modern recruitment cycle. However, most resume scanners operate on simple keyword matching. 

### What is a Forensic Bullet Audit?
Our Resume Studio approaches evaluations from a multi-dimensional perspective:

- **STAR Compliance Check**: We scan every bullet point to identify if it maps out the Situation, Task, Action, and Result explicitly.
- **Metric Verification**: Bullet points that lack numerical indicators of success (e.g. \`slashed DB overhead by 30%\`) are flagged.
- **Active Verb Mapping**: We maintain a dictionary of over 500 active action verbs, flagging passive phrases like \`was responsible for\` or \`participated in\`.

### Tuning the Semantic Matcher
The matching engine leverages custom taxonomies to identify transferable skills. For example, if a job description lists \`Node.js\`, our parser checks if your resume mentions \`Next.js\` or \`TypeScript\`, applying a weighted confidence multiplier of **95%** for sibling matches instead of marking it as missing.
`
  },
  "ssrf-hardening-secure-sandboxes": {
    title: "SSRF Hardening and Secure Code Sandboxes",
    author: "SecOps Engineer",
    date: "June 29, 2026",
    readTime: "5 min read",
    content: `
Running user-submitted code snippets is a primary feature of our Code Playground. However, executing arbitrary code or pulling remote documents poses severe security risks.

### Hardening the File Parser
When users submit URLs to pull resume drafts, the backend runs strict SSRF validation filters. Any URL resolving to a local subnet (e.g. \`127.0.0.1\`, \`10.0.0.0/8\`, or \`169.254.169.254\`) is dropped instantly.

### Sandboxing Code Executions
For compiled languages, we delegate execution to remote Piston compile servers. If those servers are offline, our fallback playground runs Javascript/TypeScript code safely using a browser-level secure sandboxed VM context. The sandbox isolates memory states, overrides the \`fetch\` and \`XMLHttpRequest\` prototypes, and terminates executing threads exceeding the **1500ms** timeout threshold.
`
  }
};

interface BlogDetailsProps {
  params: {
    slug: string;
  };
}

export default function BlogDetailsPage({ params }: BlogDetailsProps) {
  const post = BLOG_POSTS[params.slug as keyof typeof BLOG_POSTS];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative py-20 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to blog
        </Link>

        {/* Metadata */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ENGINEERING SPECIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-2 border-b border-slate-900 pb-6">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
          {post.content.trim().split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-lg font-bold text-white pt-4 tracking-tight">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={index} className="space-y-2 pl-4 list-disc">
                  {paragraph.split("\n").map((li, liIdx) => (
                    <li key={liIdx} className="text-slate-300">
                      {li.replace("- ", "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}
