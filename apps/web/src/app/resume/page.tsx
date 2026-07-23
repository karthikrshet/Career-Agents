"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, CheckCircle, AlertCircle, AlertTriangle,
  Download, Loader2, Zap, X, ChevronDown, ChevronUp, Target,
  Sparkles, ArrowRight, Copy
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { analyzeResumeText } from "@/lib/resume-engine";
import { cn, scoreToColor, scoreToGrade, scoreToBgColor } from "@/lib/utils";
import type { ResumeAnalysis } from "@/types";

type Step = "upload" | "analyzing" | "results";

export default function ResumePage() {
  const resumeAnalysis = useStore((s) => s.resumeAnalysis);
  const setResumeAnalysis = useStore((s) => s.setResumeAnalysis);
  const settings = useStore((s) => s.settings);

  const [step, setStep] = useState<Step>(resumeAnalysis ? "results" : "upload");
  const [analyzing, setAnalyzing] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [expandedBullets, setExpandedBullets] = useState(false);
  const [aiRewriting, setAiRewriting] = useState(false);

  const processText = useCallback(async (text: string, name: string) => {
    if (text.trim().length < 50) {
      toast.error("Resume text too short. Please upload a more complete resume.");
      return;
    }
    setStep("analyzing");
    setAnalyzing(true);
    try {
      const analysis = await analyzeResumeText(text, name);
      setResumeAnalysis(analysis);
      setStep("results");
      toast.success(`Analysis complete — ${analysis.overallScore}% ATS score`);
    } catch (e) {
      toast.error("Analysis failed. Please try again.");
      setStep("upload");
    } finally {
      setAnalyzing(false);
    }
  }, [setResumeAnalysis]);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const text = await file.text();
    processText(text, file.name);
  }, [processText]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"], "text/markdown": [".md"] },
    multiple: false,
  });

  async function handleAIRewrite() {
    if (!resumeAnalysis) return;
    if (!settings.aiProvider.apiKey) {
      toast.error("Add your AI provider API key in Settings to enable AI rewrites.");
      return;
    }
    setAiRewriting(true);
    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: resumeAnalysis.rawText,
          config: settings.aiProvider,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResumeAnalysis({ ...resumeAnalysis, aiRewrite: data.rewrite });
      toast.success("AI rewrite complete");
    } catch (e: any) {
      toast.error(e.message || "AI rewrite failed");
    } finally {
      setAiRewriting(false);
    }
  }

  function downloadReport() {
    if (!resumeAnalysis) return;
    const md = `# Resume Analysis Report
**File:** ${resumeAnalysis.fileName}
**Date:** ${new Date(resumeAnalysis.analyzedAt).toLocaleDateString()}
**ATS Score:** ${resumeAnalysis.overallScore}/100

## Sections Detected
${Object.entries(resumeAnalysis.sections).map(([k, v]) => `- ${k}: ${v ? "Present" : "Missing"}`).join("\n")}

## Missing Keywords
${resumeAnalysis.missingKeywords.join(", ")}

## Weak Bullets Found
${resumeAnalysis.weakBullets.map((b) => `- **Original:** ${b.original}\n  **Suggested:** ${b.suggested}`).join("\n\n")}

## Recommendations
${resumeAnalysis.recommendations.map((r) => `- ${r}`).join("\n")}
`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  }

  const analysis = resumeAnalysis;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar
        title="Resume Studio"
        subtitle="ATS analysis, bullet optimization, keyword intelligence"
      />

      <div className="flex-1 p-6 space-y-6">
        <AnimatePresence mode="wait">
          {/* Upload step */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-sky-400" />
                </div>
                <h2 className="text-xl font-semibold">Upload Your Resume</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Get an instant ATS score, weak bullet analysis, and missing keyword report.
                </p>
              </div>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={cn(
                  "relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <input {...getInputProps()} />
                <Upload className={cn("w-10 h-10 mx-auto mb-3", isDragActive ? "text-primary" : "text-muted-foreground/40")} />
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">TXT or Markdown — PDF support coming soon</p>
                <Button size="sm" className="mt-4" variant="outline">Browse Files</Button>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Paste mode */}
              <Button variant="outline" className="w-full" onClick={() => setPasteMode(!pasteMode)}>
                <FileText className="w-4 h-4 mr-2" />
                Paste Resume Text
                {pasteMode ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </Button>

              <AnimatePresence>
                {pasteMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <textarea
                      className="w-full h-48 px-4 py-3 rounded-xl bg-secondary border border-border text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      placeholder="Paste your resume content here..."
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                    />
                    <Button
                      className="w-full"
                      disabled={pastedText.length < 50}
                      onClick={() => processText(pastedText, "pasted-resume.txt")}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Resume
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Analyzing step */}
          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold">Analyzing Resume</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Running ATS scan, detecting weak bullets, finding keyword gaps...
                </p>
              </div>
            </motion.div>
          )}

          {/* Results step */}
          {step === "results" && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score header */}
              <div className="flex flex-wrap items-start gap-4">
                <Card className={cn("glass flex-shrink-0", scoreToBgColor(analysis.overallScore))}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold tabular-nums">{analysis.overallScore}</div>
                    <div className="text-xs mt-1 font-medium">{scoreToGrade(analysis.overallScore)}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">ATS Score</div>
                  </CardContent>
                </Card>

                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(analysis.sections).map(([key, present]) => (
                    <div key={key} className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border text-sm",
                      present
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                        : "border-red-500/20 bg-red-500/5 text-red-400"
                    )}>
                      {present
                        ? <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        : <X className="w-3.5 h-3.5 shrink-0" />
                      }
                      <span className="capitalize text-xs font-medium">
                        {key.replace("has", "").replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 ml-auto">
                  <Button size="sm" onClick={handleAIRewrite} disabled={aiRewriting}>
                    {aiRewriting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Rewrite
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadReport}>
                    <Download className="w-4 h-4" />
                    Export Report
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setStep("upload"); }}>
                    <Upload className="w-4 h-4" />
                    New Resume
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Missing Keywords */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      <CardTitle className="text-base">Missing Keywords</CardTitle>
                      <Badge variant="warning">{analysis.missingKeywords.length}</Badge>
                    </div>
                    <CardDescription>Add these to your Skills section to pass ATS filters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => {
                            navigator.clipboard.writeText(kw);
                            toast.success(`Copied: ${kw}`);
                          }}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Detected keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.detectedKeywords.slice(0, 10).map((kw) => (
                          <span key={kw} className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-sky-400" />
                      <CardTitle className="text-base">Recommendations</CardTitle>
                      <Badge variant="info">{analysis.recommendations.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Weak Bullets */}
              {analysis.weakBullets.length > 0 && (
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setExpandedBullets(!expandedBullets)}
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <CardTitle className="text-base">Weak Bullets</CardTitle>
                      <Badge variant="warning">{analysis.weakBullets.length}</Badge>
                      <div className="ml-auto">
                        {expandedBullets ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                    <CardDescription>Click to expand — view rewrites for passive-voice and unquantified bullets</CardDescription>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedBullets && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <CardContent className="pt-0 space-y-4">
                          {analysis.weakBullets.map((bullet, i) => (
                            <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                              <div className="flex items-start gap-2">
                                <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground line-through">{bullet.original}</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">{bullet.suggested}</p>
                              </div>
                              <Badge variant="warning" className="text-[10px]">
                                {bullet.issue === "passive_verb" ? "Passive Verb" : "No Metric"}
                              </Badge>
                            </div>
                          ))}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )}

              {/* AI Rewrite panel */}
              {analysis.aiRewrite && (
                <Card className="glass glass-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <CardTitle className="text-base">AI Rewrite</CardTitle>
                      <Badge variant="default">AI Generated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm whitespace-pre-wrap text-foreground/80 font-sans leading-relaxed">
                      {analysis.aiRewrite}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        navigator.clipboard.writeText(analysis.aiRewrite!);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy to Clipboard
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


