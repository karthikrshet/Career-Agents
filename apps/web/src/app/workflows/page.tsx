"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Play, ChevronDown, ChevronUp,
  ArrowDown, Zap, CheckCircle, Loader2, GripVertical,
  FileText, GitBranch, Link2, Mic, BarChart3, Bot, Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

// ─── Workflow step types ─────────────────────────────────────────────────────
interface WorkflowStep {
  id: string;
  type: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  status: "idle" | "running" | "done" | "error";
  outputSummary?: string;
}

const STEP_CATALOG = [
  { type: "resume-upload", label: "Resume Upload", icon: FileText, color: "sky", description: "Upload and parse your resume (PDF/DOCX)" },
  { type: "ats-review", label: "ATS Review", icon: Zap, color: "amber", description: "Score resume against ATS requirements" },
  { type: "github-audit", label: "GitHub Audit", icon: GitBranch, color: "emerald", description: "Analyze GitHub portfolio quality" },
  { type: "linkedin-review", label: "LinkedIn Review", icon: Link2, color: "blue", description: "Optimize LinkedIn profile score" },
  { type: "job-match", label: "Job Match", icon: Briefcase, color: "violet", description: "Match resume to relevant job listings" },
  { type: "interview-prep", label: "Interview Prep", icon: Mic, color: "rose", description: "Start mock interview session" },
  { type: "copilot-advice", label: "AI Copilot Advice", icon: Bot, color: "indigo", description: "Get personalized career guidance" },
  { type: "generate-report", label: "Generate Report", icon: BarChart3, color: "orange", description: "Export full career analytics report" },
];

const PRESET_WORKFLOWS = [
  {
    name: "Full Job Application Pipeline",
    emoji: "🚀",
    steps: ["resume-upload", "ats-review", "github-audit", "linkedin-review", "job-match", "interview-prep", "generate-report"],
  },
  {
    name: "Interview Ready Sprint",
    emoji: "🎯",
    steps: ["resume-upload", "ats-review", "copilot-advice", "interview-prep"],
  },
  {
    name: "Profile Optimization",
    emoji: "✨",
    steps: ["resume-upload", "linkedin-review", "github-audit", "copilot-advice"],
  },
];

const COLOR_MAP: Record<string, string> = {
  sky: "border-sky-500/30 bg-sky-500/8 text-sky-400",
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-400",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-400",
  blue: "border-blue-500/30 bg-blue-500/8 text-blue-400",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-400",
  rose: "border-rose-500/30 bg-rose-500/8 text-rose-400",
  indigo: "border-indigo-500/30 bg-indigo-500/8 text-indigo-400",
  orange: "border-orange-500/30 bg-orange-500/8 text-orange-400",
};

const STEP_OUTPUTS: Record<string, string> = {
  "resume-upload": "Resume parsed successfully — 847 tokens, PDF format detected",
  "ats-review": "ATS Score: 78/100 — 3 missing keywords identified",
  "github-audit": "GitHub Score: 82/100 — 12 repos, 3 pinned, README quality: B+",
  "linkedin-review": "LinkedIn Score: 71/100 — Headline optimized, 2 summary improvements",
  "job-match": "Matched 8 relevant positions — Highest ATS match: Vercel (94%)",
  "interview-prep": "Mock session configured — 5 behavioral + 3 system design questions ready",
  "copilot-advice": "AI recommendations generated — 4 priority action items identified",
  "generate-report": "Career Report v4.0 exported — PDF + Markdown formats ready",
};

function makeStep(type: string): WorkflowStep {
  const catalog = STEP_CATALOG.find(s => s.type === type)!;
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    label: catalog.label,
    icon: catalog.icon,
    color: catalog.color,
    description: catalog.description,
    status: "idle",
  };
}

export default function WorkflowPage() {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [running, setRunning] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null);

  function addStep(type: string) {
    setSteps(prev => [...prev, makeStep(type)]);
    setShowCatalog(false);
  }

  function removeStep(id: string) {
    setSteps(prev => prev.filter(s => s.id !== id));
  }

  function moveStep(id: string, dir: "up" | "down") {
    setSteps(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (dir === "up" && idx === 0) return prev;
      if (dir === "down" && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  function loadPreset(preset: typeof PRESET_WORKFLOWS[0]) {
    setSteps(preset.steps.map(makeStep));
    toast.success(`Loaded "${preset.name}" workflow`);
  }

  async function runWorkflow() {
    if (steps.length === 0) { toast.error("Add at least one step to run the workflow"); return; }
    setRunning(true);
    // Reset all
    setSteps(prev => prev.map(s => ({ ...s, status: "idle", outputSummary: undefined })));

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIdx(i);
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: "running" } : s));
      // Simulate execution delay (300-900ms per step)
      await new Promise(r => setTimeout(r, 300 + Math.random() * 600));
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: "done", outputSummary: STEP_OUTPUTS[s.type] || "Step completed successfully" } : s
      ));
    }

    setCurrentStepIdx(null);
    setRunning(false);
    toast.success("Workflow completed! All steps executed successfully.");
  }

  function resetWorkflow() {
    setSteps(prev => prev.map(s => ({ ...s, status: "idle", outputSummary: undefined })));
    setCurrentStepIdx(null);
  }

  const allDone = steps.length > 0 && steps.every(s => s.status === "done");
  const completedCount = steps.filter(s => s.status === "done").length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar
        title="Workflow Builder"
        subtitle="Design and automate your career action pipeline"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Canvas Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Preset Workflows */}
            <Card className="border-border/40">
              <CardContent className="p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Start Presets</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESET_WORKFLOWS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => loadPreset(preset)}
                      className="text-left p-3 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                      <p className="text-lg mb-1">{preset.emoji}</p>
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{preset.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{preset.steps.length} steps</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workflow Canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Workflow Canvas {steps.length > 0 && `· ${steps.length} steps`}
                </p>
                {steps.length > 0 && (
                  <div className="flex gap-2">
                    {allDone && (
                      <Button variant="outline" size="sm" onClick={resetWorkflow} className="h-7 text-xs gap-1.5">
                        Reset
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={runWorkflow}
                      disabled={running || steps.length === 0}
                      className="h-7 text-xs gap-1.5"
                    >
                      {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      {running ? `Running ${currentStepIdx !== null ? currentStepIdx + 1 : 0}/${steps.length}` : "Run Workflow"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Progress bar when running */}
              {running && (
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {steps.length === 0 ? (
                <div className="border-2 border-dashed border-border/40 rounded-2xl py-20 flex flex-col items-center text-center text-muted-foreground">
                  <Zap className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm">Add steps from the catalog to build your workflow</p>
                  <p className="text-xs mt-1 opacity-60">Or load a preset template above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {steps.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.id}>
                        <motion.div
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <div className={cn(
                            "rounded-xl border p-4 transition-all",
                            step.status === "running" && "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10",
                            step.status === "done" && "border-emerald-500/30 bg-emerald-500/5",
                            step.status === "idle" && "border-border/50 bg-card/50",
                          )}>
                            <div className="flex items-start gap-3">
                              <div className={cn("p-2 rounded-lg border shrink-0", COLOR_MAP[step.color])}>
                                <StepIcon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[10px] text-muted-foreground font-mono">Step {i + 1}</span>
                                  {step.status === "running" && (
                                    <span className="flex items-center gap-1 text-[10px] text-primary">
                                      <Loader2 className="w-2.5 h-2.5 animate-spin" /> Running...
                                    </span>
                                  )}
                                  {step.status === "done" && (
                                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                      <CheckCircle className="w-2.5 h-2.5" /> Done
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                                {step.outputSummary && (
                                  <motion.p
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[11px] text-emerald-400/80 mt-1.5 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20"
                                  >
                                    ✓ {step.outputSummary}
                                  </motion.p>
                                )}
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => moveStep(step.id, "up")} disabled={i === 0} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30">
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => moveStep(step.id, "down")} disabled={i === steps.length - 1} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30">
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => removeStep(step.id)} disabled={running} className="p-1 rounded text-muted-foreground hover:text-red-400 disabled:opacity-30">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {i < steps.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Catalog Column */}
          <div className="space-y-4">
            <Card className="border-border/40 sticky top-0">
              <CardContent className="p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Step Catalog</p>
                <p className="text-xs text-muted-foreground">Click any step to add it to your workflow canvas.</p>
                <div className="space-y-2">
                  {STEP_CATALOG.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.type}
                        onClick={() => addStep(s.type)}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        <div className={cn("p-1.5 rounded-lg border shrink-0", COLOR_MAP[s.color])}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{s.label}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{s.description}</p>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    );
                  })}
                </div>

                {allDone && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-emerald-400">Workflow Complete!</p>
                    <p className="text-[10px] text-muted-foreground mt-1">All {steps.length} steps executed successfully.</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
