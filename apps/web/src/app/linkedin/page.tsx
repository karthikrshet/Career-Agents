"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2, Zap, Loader2, AlertCircle, Copy,
  CheckCircle, TrendingUp, Eye, Target, RefreshCw,
  Sparkles, Share2, Award, MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { cn, scoreToColor, scoreToGrade, scoreToBgColor, resolveApiKey } from "@/lib/utils";
import { LinkedInPostGenerator } from "@/components/linkedin/LinkedInPostGenerator";
import type { LinkedInAnalysis } from "@/types";

// ─── Local analysis engine ───────────────────────────────────────────────
const PASSIVE_PATTERNS = [
  /\b(responsible for|was involved|worked with|helped|assisted|managed)\b/gi,
];
const LINKEDIN_KEYWORDS = [
  "software engineer", "full stack", "product", "leadership", "impact",
  "scalable", "delivered", "growth", "data-driven", "collaboration",
  "cross-functional", "stakeholder", "strategy", "innovation",
];

function analyzeLinkedIn(headline: string, summary: string): LinkedInAnalysis {
  const fullText = `${headline} ${summary}`;
  const wordCount = summary.split(/\s+/).filter(Boolean).length;

  const headlineIssues: string[] = [];
  if (headline.length < 20) headlineIssues.push("Headline too short — aim for 120+ characters.");
  if (!/\|/.test(headline) && !/ - /.test(headline)) headlineIssues.push("Use | separators to pack more keywords into your headline.");
  if (!/engineer|developer|designer|manager|analyst|scientist|founder/i.test(headline))
    headlineIssues.push("Include your primary job title in the headline.");

  const rewrites = [
    `${headline || "Senior Software Engineer"} | Distributed Systems & Cloud Architecture | Go · TypeScript · PostgreSQL`,
    `Building high-throughput scalable services | Ex-[Previous Co] | Open to Senior & Staff SWE Loops`,
  ];

  const missingKeywords = LINKEDIN_KEYWORDS.filter(
    (kw) => !new RegExp(kw, "i").test(fullText)
  ).slice(0, 6);

  const keywordDensity = Math.round(
    (LINKEDIN_KEYWORDS.filter((kw) => new RegExp(kw, "i").test(fullText)).length /
      LINKEDIN_KEYWORDS.length) * 100
  );

  const summaryIssues: string[] = [];
  if (wordCount < 100) summaryIssues.push("Write at least 100 words for maximum LinkedIn search visibility.");
  if (PASSIVE_PATTERNS.some((p) => p.test(summary))) summaryIssues.push("Replace passive phrases (responsible for, helped) with active verbs.");
  if (!/contact|email|schedule|reach/i.test(summary)) summaryIssues.push("End with a clear call-to-action (e.g. email or calendar link).");

  const baseScore = 40;
  let score = baseScore;
  if (headline.length > 50) score += 15;
  if (wordCount > 100) score += 15;
  score += Math.min(20, keywordDensity / 5);
  if (headlineIssues.length === 0) score += 10;
  score = Math.min(100, score);

  return {
    overallScore: Math.round(score),
    recruiterScore: Math.round(score * 0.9),
    visibilityIndex: score >= 70 ? "High" : score >= 50 ? "Medium" : "Low",
    headlineAnalysis: { current: headline, issues: headlineIssues, rewrites },
    summaryAnalysis: { wordCount, keywordDensity, missingKeywords, suggestions: summaryIssues },
    suggestedSkills: ["System Design", "TypeScript", "Distributed Systems", "CI/CD", "PostgreSQL", "AWS"],
    analyzedAt: new Date().toISOString(),
  };
}

export default function LinkedInPage() {
  const linkedinAnalysis = useStore((s) => s.linkedinAnalysis);
  const setLinkedinAnalysis = useStore((s) => s.setLinkedinAnalysis);
  const settings = useStore((s) => s.settings);

  const [headline, setHeadline] = useState(
    "Senior Software Engineer | Full-Stack & Cloud Architecture | TypeScript · React · Go · PostgreSQL"
  );
  const [summary, setSummary] = useState(
    "Senior Software Engineer with 6+ years of experience architecting distributed backend services and high-scale web platforms. Proven track record of reducing API latency by 42% and processing 15M+ daily requests. Passionate about developer tooling, clean code architecture, and mentoring engineering teams. Reach out at: alex@example.com."
  );
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!headline.trim()) {
      toast.error("Enter your LinkedIn headline");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = analyzeLinkedIn(headline, summary);
    setLinkedinAnalysis(result);
    setLoading(false);
    toast.success(`Profile analyzed — ${result.overallScore}% recruiter search score`);
  }

  const data = linkedinAnalysis;

  return (
    <div className="flex flex-col h-full overflow-auto bg-[#03060f] text-slate-100 font-sans">
      <Topbar
        title="LinkedIn Profile & Inbound Magnet Studio"
        subtitle="Recruiter search visibility audit, headline architecture, and viral thought-leadership post generator"
      />

      <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass border-cyan-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-400" />
                <span>LinkedIn Headline & Title Pipe</span>
              </CardTitle>
              <CardDescription>The #1 field indexed by recruiter search algorithms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                className="w-full h-24 p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                placeholder="e.g. Senior Software Engineer | Distributed Systems | Ex-FAANG | Go · TypeScript"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{headline.length} / 220 characters</span>
                <span className={headline.length >= 80 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {headline.length >= 80 ? "Optimal Length" : "Too Short"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-cyan-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-violet-400" />
                <span>About Section / Executive Summary</span>
              </CardTitle>
              <CardDescription>First-person narrative showcasing quantifiable wins & CTA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                className="w-full h-24 p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                placeholder="Share your technical superpowers, high-scale deliverables, and email contact..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{summary.split(/\s+/).filter(Boolean).length} words</span>
                <span className={summary.split(/\s+/).filter(Boolean).length >= 80 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {summary.split(/\s+/).filter(Boolean).length >= 80 ? "High Visibility" : "Needs 100+ Words"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAnalyze}
          disabled={loading || !headline.trim()}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold h-11 rounded-xl shadow-lg"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
          Run Inbound Search Visibility Audit
        </Button>

        {/* Audit Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Score Summary Card */}
                <Card className="glass border-border/60 p-5 space-y-4">
                  <div className="text-center p-4 rounded-2xl bg-secondary/40 border border-border/60">
                    <p className="text-3xl font-bold font-mono text-cyan-400">{data.overallScore}%</p>
                    <p className="text-xs uppercase font-bold text-muted-foreground mt-0.5">Recruiter Search Index</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Recruiter Pass Rate", value: data.recruiterScore },
                      { label: "Keyword Density", value: data.summaryAnalysis.keywordDensity },
                      { label: "Profile Word Volume", value: Math.min(100, Math.round((data.summaryAnalysis.wordCount / 200) * 100)) },
                    ].map((m) => (
                      <div key={m.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span className={cn("font-bold font-mono", scoreToColor(m.value))}>{m.value}%</span>
                        </div>
                        <Progress value={m.value} className="h-1.5" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Inbound Visibility</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                      {data.visibilityIndex} Rating
                    </Badge>
                  </div>
                </Card>

                {/* Headline Suggestions & Keyword Breakdown */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="glass border-border/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-white">Suggested High-Performing Headlines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {data.headlineAnalysis.rewrites.map((rw, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-secondary/40 border border-border/60">
                          <p className="text-xs text-slate-200 font-medium truncate">{rw}</p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(rw);
                              toast.success("Copied headline to clipboard!");
                            }}
                            className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs shrink-0 flex items-center gap-1 font-semibold"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Missing Keywords & Skills */}
                  <Card className="glass border-border/60">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        <CardTitle className="text-sm font-bold text-white">Recommended Keywords to Index</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {data.suggestedSkills.map((sk) => (
                          <Badge
                            key={sk}
                            className="bg-cyan-500/15 text-cyan-300 border-cyan-500/30 text-[11px] font-mono"
                          >
                            + {sk}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Viral AI Tech Thought-Leadership Post Generator */}
              <LinkedInPostGenerator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
