"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2, Zap, Loader2, AlertCircle, Copy,
  CheckCircle, TrendingUp, Eye, Target, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn, scoreToColor, scoreToGrade, scoreToBgColor } from "@/lib/utils";
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
    `${headline || "Senior Software Engineer"} | Full-Stack Expert | TypeScript · React · System Design`,
    `Building ${headline || "scalable systems"} | ${wordCount > 0 ? "Open to" : "Seeking"} Senior IC & Staff Roles`,
  ];

  const missingKeywords = LINKEDIN_KEYWORDS.filter(
    (kw) => !new RegExp(kw, "i").test(fullText)
  ).slice(0, 6);

  const keywordDensity = Math.round(
    (LINKEDIN_KEYWORDS.filter((kw) => new RegExp(kw, "i").test(fullText)).length /
      LINKEDIN_KEYWORDS.length) * 100
  );

  const summaryIssues: string[] = [];
  if (wordCount < 100) summaryIssues.push("Write at least 100 words for maximum Link2 search visibility.");
  if (PASSIVE_PATTERNS.some((p) => p.test(summary))) summaryIssues.push("Replace passive phrases (responsible for, helped, assisted) with active verbs.");
  if (!/contact|email|schedule|reach/i.test(summary)) summaryIssues.push("End with a clear call-to-action (e.g., contact, email, link).");

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
    suggestedSkills: ["System Design", "TypeScript", "Distributed Systems", "CI/CD", "Agile"],
    analyzedAt: new Date().toISOString(),
  };
}

export default function LinkedInPage() {
  const linkedinAnalysis = useStore((s) => s.linkedinAnalysis);
  const setLinkedinAnalysis = useStore((s) => s.setLinkedinAnalysis);
  const settings = useStore((s) => s.settings);

  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAnalyze() {
    if (!headline.trim()) { toast.error("Enter your Link2 headline"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = analyzeLinkedIn(headline, summary);
    setLinkedinAnalysis(result);
    setLoading(false);
    toast.success(`Profile analyzed — ${result.overallScore}% visibility score`);
  }

  async function handleAIRewrite() {
    if (!settings.aiProvider.apiKey) {
      toast.error("Add your AI provider API key in Settings.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/Link2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, summary, config: settings.aiProvider }),
      });
      const data = await res.json();
      if (data.rewrite) {
        setLinkedinAnalysis({ ...linkedinAnalysis!, headlineAnalysis: { ...linkedinAnalysis!.headlineAnalysis, rewrites: [data.rewrite, ...linkedinAnalysis!.headlineAnalysis.rewrites] } });
        toast.success("AI rewrite generated");
      }
    } catch {
      toast.error("AI rewrite failed");
    } finally {
      setAiLoading(false);
    }
  }

  const data = linkedinAnalysis;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="Link2 Optimizer" subtitle="Visibility score, headline rewrites, keyword density analysis" />

      <div className="flex-1 p-6 space-y-6">
        {/* Input panel */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-400" />
              Enter Your Link2 Profile Data
            </CardTitle>
            <CardDescription>Paste your current headline and About section for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Current Headline</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Software Engineer at Google | Full-Stack · TypeScript · React"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={220}
              />
              <p className="text-[10px] text-muted-foreground mt-1">{headline.length}/220 characters</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">About / Summary Section</label>
              <textarea
                className="w-full h-32 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Paste your Link2 About section here..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAnalyze} disabled={loading || !headline.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Analyze Profile
              </Button>
              {data && (
                <Button variant="outline" onClick={handleAIRewrite} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  AI Rewrite
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Score card */}
              <div className="lg:col-span-1 space-y-4">
                <Card className={cn("glass", scoreToBgColor(data.overallScore))}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold tabular-nums">{data.overallScore}</div>
                    <div className="text-xs mt-1 font-medium">{scoreToGrade(data.overallScore)}</div>
                    <div className="text-[10px] opacity-70">Visibility Score</div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4 space-y-3">
                    {[
                      { label: "Recruiter Score", value: data.recruiterScore },
                      { label: "Keyword Density", value: data.summaryAnalysis.keywordDensity },
                      { label: "Word Count", value: Math.min(100, Math.round((data.summaryAnalysis.wordCount / 300) * 100)) },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{m.label}</span>
                          <span className={cn("text-xs font-semibold", scoreToColor(m.value))}>{m.value}%</span>
                        </div>
                        <Progress value={m.value} className="h-1.5" />
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Visibility Index</p>
                      <Badge
                        variant={data.visibilityIndex === "High" ? "success" : data.visibilityIndex === "Medium" ? "warning" : "destructive"}
                        className="mt-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {data.visibilityIndex}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details panel */}
              <div className="lg:col-span-2 space-y-4">
                {/* Headline analysis */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Headline Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.headlineAnalysis.issues.length > 0 && (
                      <div className="space-y-2">
                        {data.headlineAnalysis.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium mb-2">Suggested Headlines</p>
                      <div className="space-y-2">
                        {data.headlineAnalysis.rewrites.map((rw, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
                            <p className="flex-1 text-sm text-foreground/90">{rw}</p>
                            <button
                              onClick={() => { navigator.clipboard.writeText(rw); toast.success("Copied!"); }}
                              className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Missing keywords */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      <CardTitle className="text-sm">Missing Keywords</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {data.summaryAnalysis.missingKeywords.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => { navigator.clipboard.writeText(kw); toast.success(`Copied: ${kw}`); }}
                          className="px-2.5 py-1 rounded-full text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-medium mb-2">Suggested Skills to Add</p>
                      <div className="flex flex-wrap gap-1.5">
                        {data.suggestedSkills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400">{s}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {data.summaryAnalysis.suggestions.length > 0 && (
                  <Card className="glass">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Summary Improvements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {data.summaryAnalysis.suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


