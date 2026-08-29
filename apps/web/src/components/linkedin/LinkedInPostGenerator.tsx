"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Copy, Check, TrendingUp, Zap,
  MessageSquare, Share2, Award, ThumbsUp, Send
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LinkedInPostGenerator({
  candidateName = "Engineer",
  targetRole = "Senior Software Engineer",
}: {
  candidateName?: string;
  targetRole?: string;
}) {
  const [topicType, setTopicType] = useState<"scaling" | "outage" | "transition" | "opensource">("scaling");
  const [copied, setCopied] = useState(false);

  const posts = {
    scaling: {
      label: "System Scaling & Performance",
      hook: "How we cut P99 API latency by 42% on a 500M+ row PostgreSQL cluster 🚀",
      body: `Scaling distributed backend systems often comes down to 3 unsexy fundamentals:

1️⃣ Indexing Strategy: B-Tree compound indexes on our high-cardinality foreign keys eliminated 80% of sequential table scans.
2️⃣ Two-Tier Caching: Placing Redis read-through caching in front of hot endpoints dropped primary DB CPU utilization from 88% to 24%.
3️⃣ Asynchronous Event Queues: Decoupling write-heavy notification pipelines via Kafka ensured zero request timeouts under peak traffic.

The biggest lesson? Premature microservices won't fix poor query design. Fix the data access layer first.

What is your go-to database optimization before adding more hardware? 👇

#SoftwareEngineering #SystemDesign #PostgreSQL #Backend #Scalability #DevCommunity`,
    },
    outage: {
      label: "Outage Postmortem & Engineering Lessons",
      hook: "The day a simple configuration typo took down our staging cluster — and what we built to never let it happen again 🛠️",
      body: `Blameless postmortems are the superpower of high-performing engineering teams.

Here is what went wrong and how we hardened our release pipelines:
• The Root Cause: An unvalidated environment variable triggered an unhandled connection pool exhaustion.
• The Immediate Fix: Rolled back within 4 minutes via automated Kubernetes canary health checks.
• The Long-Term Guardrail: Added schema-enforced Zod configuration validation at boot time and circuit-breaker fallbacks.

If you don't test your disaster recovery, your production environment will test it for you.

How does your team handle environment variable verification in CI/CD?

#DevOps #Kubernetes #SiteReliability #Postmortem #EngineeringCulture`,
    },
    transition: {
      label: "Career Reflection & Senior SWE Mindset",
      hook: "The biggest difference between a Mid-Level and a Senior Engineer isn't code speed — it's judgment 💡",
      body: `Early in my tech career, I measured productivity by how many pull requests I merged.

Today, the most impactful engineering contributions often look like:
• Deleting 1,000 lines of redundant code instead of adding 500.
• Saying 'no' to over-engineered architectures that add operational toil.
• Writing clear technical design docs that align product managers and engineers before a single line of code is written.
• Mentoring and unblocking peers to multiply team velocity.

Code is the easy part. Managing complexity and communicating trade-offs is where real leverage happens.

What mindset shift helped you level up most in your career?

#SoftwareEngineering #TechLeadership #CareerGrowth #Mentorship #SeniorEngineer`,
    },
    opensource: {
      label: "Open Source Milestone & Architecture",
      hook: "Excited to share our open source Career-Agents platform: An AI-powered Career Operating System 🌐",
      body: `We built Career-Agents to solve a fundamental problem in tech careers: fragmented job applications, unquantified resumes, and generic interview prep.

What we engineered inside:
✨ 167 AI Agent Personas mapped across engineering divisions
✨ Real-time ATS Resume forensic scanning with Google XYZ formulas
✨ Multi-Agent Swarm Deliberation (Staff Architect + Bar Raiser + Hiring Director)
✨ 20-Language Interactive Coding Studio & System Design Whiteboard

100% open source and community-driven.

Check it out and let us know what features you'd like to see next! 👇

#OpenSource #AI #WebDev #TypeScript #NextJS #CareerCopilot`,
    },
  };

  const current = posts[topicType];
  const fullPostText = `${current.hook}\n\n${current.body}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullPostText);
    setCopied(true);
    toast.success("LinkedIn post copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="glass border-cyan-500/30 overflow-hidden shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 pb-4 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-white">
                  Viral AI Tech Post & Thought-Leadership Generator
                </CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                  Inbound Magnet
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generate high-engagement engineering posts that attract recruiters and hiring managers to your profile.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-md transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Post"}</span>
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {[
            { id: "scaling" as const, label: "⚡ System Scaling" },
            { id: "outage" as const, label: "🛠️ Postmortem / Fix" },
            { id: "transition" as const, label: "💡 Senior Mindset" },
            { id: "opensource" as const, label: "🌐 Open Source Release" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTopicType(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0",
                topicType === tab.id
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm"
                  : "bg-slate-900/60 border-border/60 text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">{current.label}</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {fullPostText.length} characters · 2 min read
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/50 border border-border/60 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
          {fullPostText}
        </div>
      </CardContent>
    </Card>
  );
}
