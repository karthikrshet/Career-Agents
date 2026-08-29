"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Target, CheckCircle, XCircle, AlertTriangle, Sparkles,
  ArrowRight, Copy, Check, Shield, Zap, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const SAMPLE_JDS: Record<string, { title: string; text: string }> = {
  google_l5: {
    title: "Google — Senior Backend SWE (L5)",
    text: "Requirements: 5+ years building distributed backend systems in Go, C++, or Java. Deep expertise in distributed databases (Spanner/Postgres), high-throughput RPCs (gRPC), Kubernetes container orchestration, concurrency, and P99 latency optimization. Experience mentoring engineers and leading architecture design.",
  },
  meta_e5: {
    title: "Meta — Senior Full Stack / Product SWE (E5)",
    text: "Requirements: 4+ years of production experience in React, TypeScript, GraphQL, Python/Hack. Experience designing scalable feed architectures, distributed caching with Memcached/Redis, WebSocket real-time streams, and measurable user metric growth. Strong cross-functional collaboration.",
  },
  stripe_infra: {
    title: "Stripe — Infrastructure / Platform Engineer",
    text: "Requirements: Experience with distributed systems reliability, Ruby/Go/Java, PostgreSQL, Kafka event streaming, AWS cloud infrastructure, Docker, CI/CD pipelines, and financial ledger idempotency. Passion for high software engineering standards and zero-downtime migrations.",
  },
};

export function JobDescriptionMatcher({
  resumeText = "",
  onInjectKeywords,
}: {
  resumeText?: string;
  onInjectKeywords?: (keywords: string[]) => void;
}) {
  const [selectedSample, setSelectedSample] = useState<string>("google_l5");
  const [jdText, setJdText] = useState(SAMPLE_JDS.google_l5.text);

  // Extract keywords from JD and compare with resume
  const targetKeywords = React.useMemo(() => {
    const commonKeywords = [
      "Distributed Systems", "Kubernetes", "Docker", "PostgreSQL", "Redis",
      "Kafka", "gRPC", "Go", "TypeScript", "React", "Python", "GraphQL",
      "AWS", "CI/CD", "Latency Optimization", "Concurrency", "Microservices",
      "Idempotency", "System Design", "Cloud Infrastructure"
    ];

    const lowerJd = jdText.toLowerCase();
    const lowerResume = resumeText.toLowerCase();

    const inJd = commonKeywords.filter((kw) => lowerJd.includes(kw.toLowerCase()));
    const matched = inJd.filter((kw) => lowerResume.includes(kw.toLowerCase()) || lowerResume.length < 50);
    const missing = inJd.filter((kw) => !matched.includes(kw));

    const matchRate = inJd.length > 0 ? Math.round((matched.length / inJd.length) * 100) : 88;

    return { inJd, matched, missing, matchRate };
  }, [jdText, resumeText]);

  function handleSelectSample(key: string) {
    setSelectedSample(key);
    setJdText(SAMPLE_JDS[key].text);
  }

  function handleInject() {
    if (targetKeywords.missing.length === 0) {
      toast.info("All target keywords are already present in your resume!");
      return;
    }
    if (onInjectKeywords) {
      onInjectKeywords(targetKeywords.missing);
      toast.success(`Injected ${targetKeywords.missing.length} missing keywords into skills section!`);
    } else {
      navigator.clipboard.writeText(targetKeywords.missing.join(", "));
      toast.success("Copied missing keywords to clipboard!");
    }
  }

  return (
    <Card className="glass border-cyan-500/30 overflow-hidden shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 pb-4 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-white">
                  ATS Job Description & Keyword Matcher
                </CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                  Real-time Scanner
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pinpoint exact keyword gaps between your resume and target job posting to bypass ATS filters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-border/60">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Match Rating</p>
              <p className="text-lg font-bold font-mono text-cyan-400">{targetKeywords.matchRate}%</p>
            </div>
            <Badge
              className={cn(
                "text-xs px-2.5 py-1 font-bold",
                targetKeywords.matchRate >= 80
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              )}
            >
              {targetKeywords.matchRate >= 80 ? "HIGH MATCH" : "KEYWORD GAPS"}
            </Badge>
          </div>
        </div>

        {/* Quick Sample JD selector */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground shrink-0">
            Target Job Templates:
          </span>
          {Object.entries(SAMPLE_JDS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => handleSelectSample(key)}
              className={cn(
                "px-2.5 py-1 rounded-lg border text-[11px] font-semibold truncate transition-all shrink-0",
                selectedSample === key
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                  : "bg-slate-900/60 border-border/60 text-slate-300 hover:text-white"
              )}
            >
              {item.title}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Job Description Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Target Job Description (Paste from LinkedIn / Greenhouse / Lever / Workday)
          </label>
          <textarea
            className="w-full h-24 p-3 rounded-xl bg-secondary/50 border border-border/80 text-xs text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste target job description here..."
          />
        </div>

        {/* Keyword Match Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matched Keywords */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" />
                <span>Matched ATS Keywords ({targetKeywords.matched.length})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {targetKeywords.matched.map((kw) => (
                <Badge
                  key={kw}
                  className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[11px] font-mono"
                >
                  ✓ {kw}
                </Badge>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Missing ATS Keywords ({targetKeywords.missing.length})</span>
              </div>
              <button
                onClick={handleInject}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-Inject
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {targetKeywords.missing.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No missing keywords detected!</p>
              ) : (
                targetKeywords.missing.map((kw) => (
                  <Badge
                    key={kw}
                    className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[11px] font-mono"
                  >
                    + {kw}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
