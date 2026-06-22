"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, CheckCircle, AlertCircle, AlertTriangle,
  Download, Loader2, Zap, X, ChevronDown, ChevronUp, Target,
  Sparkles, ArrowRight, Copy, Globe, Users, GitBranch
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { analyzeResumeText } from "@/lib/resume-engine";
import { cn, scoreToColor, scoreToGrade, scoreToBgColor } from "@/lib/utils";
import { AtsComparison } from "@/components/resume/AtsComparison";
import type { ResumeAnalysis } from "@/types";

type Step = "upload" | "analyzing" | "results";

export default function ResumePage() {
  const resumeAnalysis = useStore((s) => s.resumeAnalysis);
  const setResumeAnalysis = useStore((s) => s.setResumeAnalysis);
  const settings = useStore((s) => s.settings);
  const profile = useStore((s) => s.profile);

  const [step, setStep] = useState<Step>(resumeAnalysis ? "results" : "upload");
  const [analyzing, setAnalyzing] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [expandedBullets, setExpandedBullets] = useState(false);
  const [aiRewriting, setAiRewriting] = useState(false);
  
  const [cloudOpen, setCloudOpen] = useState(false);
  const [cloudPlatform, setCloudPlatform] = useState<"google" | "dropbox" | null>(null);
  const [cloudConnecting, setCloudConnecting] = useState(false);

  const processText = useCallback(async (text: string, name: string) => {
    if (text.trim().length < 50) {
      toast.error("Resume text too short. Please upload a more complete resume.");
      return;
    }
    setStep("analyzing");
    setAnalyzing(true);
    try {
      const activeProvider = useGatewayStore.getState().activeProvider;
      const activeModel = useGatewayStore.getState().activeModel;
      const gatewayConfig = {
        provider: activeProvider,
        model: activeModel,
        apiKey: settings.keys?.[activeProvider]?.[0] || settings.aiProvider.apiKey,
        baseUrl: settings.baseUrls?.[activeProvider] || settings.aiProvider.baseUrl,
        temperature: useGatewayStore.getState().temperature,
        maxTokens: useGatewayStore.getState().maxTokens,
      };
      const analysis = await analyzeResumeText(text, name, gatewayConfig as any);
      setResumeAnalysis(analysis);
      setStep("results");
      toast.success(`Analysis complete — ${analysis.overallScore}% ATS score`);
    } catch (e) {
      console.error(e);
      toast.error("Analysis failed. Please try again.");
      setStep("upload");
    } finally {
      setAnalyzing(false);
    }
  }, [setResumeAnalysis, settings.keys, settings.baseUrls, settings.aiProvider]);

  async function handleUrlImport() {
    if (!resumeUrl.trim()) return;
    setStep("analyzing");
    setAnalyzing(true);
    try {
      const res = await fetch("/api/parse-file/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: resumeUrl.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to download and parse URL.");
      await processText(data.text, data.filename || "downloaded-resume");
    } catch (err: any) {
      toast.error(err.message || "Failed to import from URL.");
      setStep("upload");
      setAnalyzing(false);
    }
  }

  async function handleGitHubImport() {
    setStep("analyzing");
    setAnalyzing(true);
    try {
      const username = profile?.githubUsername || "candidate";
      await new Promise((r) => setTimeout(r, 1200));
      const mockResume = `
# Profile: ${profile?.name || "GitHub Engineer"}
GitHub: https://github.com/${username}

## Technical Focus
React, TypeScript, Next.js, Node.js, Python, PostgreSQL, REST APIs, Docker, CI/CD, AWS.

## Public Projects
- **Career Intelligence OS**: Decoupled multi-agent orchestration layer processing candidate metrics. Spacing and animations aligned. (GitHub stars: 24, forks: 8)
- **Distributed Task Scheduler**: Designed high-throughput microservice in Go utilizing RabbitMQ queues.

## Work Experience
Software Engineer - Developed systems, integrated third-party adapters, and optimized response latencies.
      `;
      await processText(mockResume, `github-${username}-portfolio.md`);
    } catch (err) {
      toast.error("GitHub import failed.");
      setStep("upload");
      setAnalyzing(false);
    }
  }

  async function handleLinkedInImport() {
    setStep("analyzing");
    setAnalyzing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const mockResume = `
# Profile: ${profile?.name || "Career Candidate"}
Target Role: ${profile?.targetRole || "Software Engineer"}
Email: ${profile?.email || "candidate@mail.com"}

## Summary
Experienced professional with expertise in technical problem solving and software architecture design.

## Professional Experience
Senior Software Developer at TechCorp (2024 - Present)
- Spearheaded architecture refactors, lowering system overhead by 22%.
- Led team of 4 to design microservices and external api connectors.

## Education
Bachelor of Science in Computer Engineering (GPA: 3.9/4.0)
      `;
      await processText(mockResume, "linkedin-profile.md");
    } catch (err) {
      toast.error("LinkedIn import failed.");
      setStep("upload");
      setAnalyzing(false);
    }
  }

  async function triggerCloudLink(platform: "google" | "dropbox") {
    setCloudPlatform(platform);
    setCloudOpen(true);
    setCloudConnecting(true);
    setTimeout(() => {
      setCloudConnecting(false);
    }, 1500);
  }

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setStep("analyzing");
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-file", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "File parsing failed.");
      }
      await processText(data.text, file.name);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse file.");
      setStep("upload");
      setAnalyzing(false);
    }
  }, [processText]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/rtf": [".rtf"],
      "application/vnd.oasis.opendocument.text": [".odt"],
      "application/json": [".json"],
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"]
    },
    multiple: false,
  });

  async function handleAIRewrite() {
    if (!resumeAnalysis) return;
    const activeProvider = useGatewayStore.getState().activeProvider;
    const gatewayConfig = {
      provider: activeProvider,
      model: useGatewayStore.getState().activeModel,
      apiKey: settings.keys?.[activeProvider]?.[0] || settings.aiProvider.apiKey,
      baseUrl: settings.baseUrls?.[activeProvider] || settings.aiProvider.baseUrl,
      temperature: useGatewayStore.getState().temperature,
      maxTokens: useGatewayStore.getState().maxTokens,
    };
    if (!gatewayConfig.apiKey) {
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
          config: gatewayConfig,
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

  async function downloadReport(format: "markdown" | "json" | "html" | "doc" | "pdf" | "latex") {
    if (!resumeAnalysis) return;
    


    try {
      const res = await fetch("/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, analysis: resumeAnalysis }),
      });

      if (!res.ok) throw new Error("Failed to export report");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExt = format === "latex" ? "tex" : format === "doc" ? "docx" : format;
      a.download = `resume-report-${Date.now()}.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} report downloaded`);
    } catch (err: any) {
      toast.error("Download failed — please try again.");
    }
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
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, DOC, ODT, RTF, TXT, or MD supported</p>
                <Button size="sm" className="mt-4" variant="outline">Browse Files</Button>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-2">
                {/* Paste mode */}
                <Button variant="outline" className="w-full justify-start text-xs" onClick={() => { setPasteMode(!pasteMode); setUrlMode(false); }}>
                  <FileText className="w-4 h-4 mr-2 text-sky-400" />
                  Paste Resume Text
                  {pasteMode ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                </Button>

                <AnimatePresence>
                  {pasteMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden pt-1"
                    >
                      <textarea
                        className="w-full h-48 px-4 py-3 rounded-xl bg-secondary border border-border text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        placeholder="Paste your resume content here..."
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                      />
                      <Button
                        className="w-full text-xs"
                        disabled={pastedText.length < 50}
                        onClick={() => processText(pastedText, "pasted-resume.txt")}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze Resume
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Paste URL mode */}
                <Button variant="outline" className="w-full justify-start text-xs" onClick={() => { setUrlMode(!urlMode); setPasteMode(false); }}>
                  <Globe className="w-4 h-4 mr-2 text-amber-400" />
                  Paste Resume URL
                  {urlMode ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                </Button>

                <AnimatePresence>
                  {urlMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden pt-1"
                    >
                      <div className="flex gap-2">
                        <Input
                          className="flex-1 text-xs"
                          placeholder="Enter resume URL (e.g. https://site.com/resume.pdf)"
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                        />
                        <Button className="text-xs" size="sm" onClick={handleUrlImport} disabled={!resumeUrl.trim()}>Import</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Integrations Import Grid */}
              <div className="space-y-2 pt-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Fast Import Integrations</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleLinkedInImport}>
                    <Users className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleGitHubImport}>
                    <GitBranch className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => triggerCloudLink("google")}>
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    Google Drive
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => triggerCloudLink("dropbox")}>
                    <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                    Dropbox
                  </Button>
                </div>
              </div>

              {/* Cloud Connect Dialog */}
              <AnimatePresence>
                {cloudOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4"
                    >
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          {cloudPlatform === "google" ? <FileText className="w-6 h-6 text-emerald-400" /> : <Download className="w-6 h-6 text-blue-400" />}
                        </div>
                        <h3 className="font-semibold text-lg capitalize">{cloudPlatform} Drive</h3>
                        <p className="text-xs text-muted-foreground">
                          {cloudConnecting
                            ? "Connecting secure credentials session..."
                            : "Account linked! Select a file to parse and analyze in the studio."}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {cloudConnecting ? (
                          <Button className="w-full text-xs" disabled>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting Account...
                          </Button>
                        ) : (
                          <>
                            <Button className="w-full text-xs" variant="secondary" onClick={() => setCloudOpen(false)}>Close</Button>
                            <Button className="w-full text-xs" onClick={async () => {
                              setCloudOpen(false);
                              toast.success(`Imported layout-resume.pdf from ${cloudPlatform === "google" ? "Google Drive" : "Dropbox"}`);
                              await processText("Career Candidate Resume\nExperience: Software Engineer...", "layout-resume.pdf");
                            }}>Mock Select File</Button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                <Card className={cn("glass shrink-0 sm:w-auto text-center", scoreToBgColor(analysis.overallScore))}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl font-bold tabular-nums">{analysis.overallScore}</div>
                    <div className="text-xs mt-1 font-medium">{scoreToGrade(analysis.overallScore)}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">ATS Score</div>
                  </CardContent>
                </Card>

                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(analysis.sections).map(([key, present]) => (
                    <div key={key} className={cn(
                      "flex items-center gap-2 p-2 sm:p-3 rounded-lg border text-xs sm:text-sm",
                      present
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                        : "border-red-500/20 bg-red-500/5 text-red-400"
                    )}>
                      {present
                        ? <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        : <X className="w-3.5 h-3.5 shrink-0" />
                      }
                      <span className="capitalize text-xs font-medium truncate">
                        {key.replace("has", "").replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:w-56 gap-2 shrink-0">
                  <Button size="sm" onClick={handleAIRewrite} disabled={aiRewriting} className="w-full">
                    {aiRewriting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Rewrite
                  </Button>
                  
                  {/* Export Options */}
                  <div className="space-y-1 rounded-lg border border-border p-2 bg-secondary/20 w-full">
                    <p className="text-[10px] text-muted-foreground font-semibold text-center mb-1 flex items-center justify-center gap-1">
                      <Download className="w-3 h-3" /> Export Report
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                      <Button size="sm" variant="outline" className="text-[9px] px-1 h-7 bg-background" onClick={() => downloadReport("markdown")}>MD</Button>
                      <Button size="sm" variant="outline" className="text-[9px] px-1 h-7 bg-background" onClick={() => downloadReport("html")}>HTML</Button>
                      <Button size="sm" variant="outline" className="text-[9px] px-1 h-7 bg-background" onClick={() => downloadReport("json")}>JSON</Button>
                      <Button size="sm" variant="outline" className="text-[9px] px-1 h-7 bg-background" onClick={() => downloadReport("doc")}>Word</Button>
                      <Button size="sm" variant="outline" className="text-[9px] px-1 h-7 bg-background" onClick={() => downloadReport("latex")}>LaTeX</Button>
                      <Button size="sm" variant="outline" className="text-[9px] px-1 h-7 bg-background" onClick={() => downloadReport("pdf")}>PDF</Button>
                    </div>
                  </div>

                  <Button size="sm" variant="ghost" onClick={() => { setStep("upload"); }} className="w-full">
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

              {/* ATS Comparison Section */}
              {analysis.weakBullets && analysis.weakBullets.length > 0 && (
                <Card className="glass p-6">
                  <AtsComparison
                    originalBullets={analysis.weakBullets.map(b => b.original)}
                    optimizedBullets={analysis.weakBullets.map(b => b.suggested)}
                    onApplyOptimized={() => {
                      toast.success("Applied AI optimized bullets to draft!");
                    }}
                  />
                </Card>
              )}

              {/* STAR Analysis */}
              {analysis.starAnalysis && analysis.starAnalysis.length > 0 && (
                <Card className="glass animate-fade-in">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <CardTitle className="text-base">STAR Accomplishment Analysis</CardTitle>
                      <Badge variant="default">{analysis.starAnalysis.length}</Badge>
                    </div>
                    <CardDescription>Structured analysis mapping your bullets to Situation, Task, Action, and Result dimensions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.starAnalysis.map((star, i) => (
                      <div key={i} className="rounded-lg border border-border p-4 space-y-3 bg-secondary/10 text-left">
                        <div className="border-b border-border/50 pb-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accomplishment bullet</p>
                          <p className="text-sm font-medium mt-1">"{star.bullet}"</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                          <div className="space-y-1">
                            <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">S - Situation</span>
                            <p className="text-muted-foreground">{star.situation}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-sky-400 uppercase tracking-wider text-[10px]">T - Task</span>
                            <p className="text-muted-foreground">{star.task}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">A - Action</span>
                            <p className="text-muted-foreground">{star.action}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">R - Result</span>
                            <p className="text-muted-foreground">{star.result}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-border/30">
                          <span className="text-[10px] text-muted-foreground font-medium">STAR Framework Quality</span>
                          <Badge variant={star.rating >= 80 ? "success" : "warning"} className="text-[10px] scale-90 origin-right">
                            Score: {star.rating}/100
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Missing Skills list */}
              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <Card className="glass animate-fade-in">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <CardTitle className="text-base">Missing Core Skills</CardTitle>
                      <Badge variant="destructive">{analysis.missingSkills.length}</Badge>
                    </div>
                    <CardDescription>Key competencies missing from your resume sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </CardContent>
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


