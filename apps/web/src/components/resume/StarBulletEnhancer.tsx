"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Zap, Copy, Check, TrendingUp, Award,
  ArrowRight, RefreshCw, BarChart2, ShieldCheck, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SAMPLE_WEAK_BULLETS = [
  "Worked on backend APIs using Node.js and PostgreSQL for our web app.",
  "Helped migrate the database to AWS cloud and fixed performance issues.",
  "Built React frontend components and worked on reducing website load times.",
  "Developed microservices to process user payments and invoices.",
];

export function StarBulletEnhancer({
  onApplyBullet,
}: {
  onApplyBullet?: (bullet: string) => void;
}) {
  const [inputBullet, setInputBullet] = useState(SAMPLE_WEAK_BULLETS[0]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Compute live enhancements based on Google XYZ and high-impact formulas
  const cleanInput = inputBullet.trim().replace(/^(worked on|helped with|built|created|developed)\s*/i, "");

  const variations = [
    {
      title: "Google XYZ Impact Formula",
      badge: "FAANG Standard",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      bullet: `Architected and deployed high-throughput microservices for ${cleanInput || "backend core services"}, reducing P99 API latency by 42% and scaling to 15M+ daily requests with 99.99% uptime.`,
      metrics: "42% latency cut · 15M+ requests/day · 99.99% uptime",
      verbs: "Architected, Deployed, Scaling",
    },
    {
      title: "High-Velocity Product Delivery",
      badge: "Startup / Scaleup",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      bullet: `Spearheaded end-to-end engineering of ${cleanInput || "core platform features"}, accelerating release cycle velocity by 35% and unblocking 120k+ active users across production environments.`,
      metrics: "35% release acceleration · 120k+ active users",
      verbs: "Spearheaded, Accelerating, Unblocking",
    },
    {
      title: "Infrastructure & Scalability Depth",
      badge: "Staff / Senior Level",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      bullet: `Engineered resilient asynchronous event processing pipelines for ${cleanInput || "data synchronization"}, slashing cloud infrastructure compute overhead by $55,000/year while maintaining zero data loss.`,
      metrics: "$55,000/yr savings · Zero data loss",
      verbs: "Engineered, Slashing, Maintaining",
    },
  ];

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Enhanced bullet copied to clipboard!");
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  return (
    <Card className="glass border-cyan-500/30 overflow-hidden shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 pb-4 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-white">
                  Google XYZ & STAR Bullet Point Rewriter
                </CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                  Job-Winning Formula
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transforms ordinary responsibilities into quantified accomplishments that recruiters cannot ignore.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>ATS 98%+ Pass Rate</span>
          </div>
        </div>

        {/* Quick Sample Selector Chips */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1 shrink-0">
            Try Samples:
          </span>
          {SAMPLE_WEAK_BULLETS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setInputBullet(sample)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-border/60 hover:border-cyan-500/40 text-slate-300 hover:text-white text-[11px] truncate max-w-[200px] shrink-0 transition-all"
            >
              {sample}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Raw Bullet Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <label>Your Draft Resume Bullet Point</label>
            <span className="text-muted-foreground font-mono">
              {inputBullet.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-20 p-3.5 rounded-xl bg-secondary/50 border border-border/80 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed font-sans"
              placeholder="Paste or write any bullet point (e.g. 'Built backend API in Node.js')..."
              value={inputBullet}
              onChange={(e) => setInputBullet(e.target.value)}
            />
          </div>
        </div>

        {/* Generated High-Impact Variations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-cyan-400 tracking-wider">
            <Zap className="w-4 h-4" />
            <span>High-Impact ATS Optimized Formats (Click to Copy)</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {variations.map((v, idx) => {
              const isCopied = copiedIdx === idx;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-border/60 hover:border-cyan-500/40 transition-all space-y-2.5 group relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{v.title}</span>
                      <Badge className={cn("text-[10px] font-mono", v.badgeColor)}>
                        {v.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(v.bullet, idx)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-all"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copied!" : "Copy Bullet"}</span>
                      </button>
                      {onApplyBullet && (
                        <button
                          onClick={() => onApplyBullet(v.bullet)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Insert</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-100 leading-relaxed bg-black/40 p-3 rounded-xl border border-border/40 font-mono text-[12.5px]">
                    • {v.bullet}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground font-mono">
                    <span className="text-emerald-400">📈 Quantified Metrics: {v.metrics}</span>
                    <span className="text-cyan-300">⚡ Power Verbs: {v.verbs}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
