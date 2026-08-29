"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Copy, Check, FileText, Send, Mail,
  X, CheckCircle, ExternalLink, Building2, MapPin, DollarSign, Plus
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TailorJobTarget {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  tech: string[];
  description?: string;
}

export function JobTailorModal({
  job,
  open = false,
  onClose,
  onAddToTracker,
}: {
  job?: TailorJobTarget | null;
  open?: boolean;
  onClose?: () => void;
  onAddToTracker?: (job: TailorJobTarget) => void;
}) {
  const [activeTab, setActiveTab] = useState<"bullets" | "cover_letter" | "inmail">("bullets");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!open || !job) return null;

  const techStackStr = job.tech?.length > 0 ? job.tech.slice(0, 3).join(", ") : "TypeScript, Distributed Systems, PostgreSQL";

  const tailoredBullets = [
    `Architected high-throughput microservices using ${techStackStr}, reducing P99 latency by 38% while processing 12M+ daily requests for ${job.company}-aligned workloads.`,
    `Optimized query execution pipelines and implemented multi-tier caching, achieving sub-25ms response times across distributed ${job.tech?.[0] || "PostgreSQL"} clusters.`,
    `Spearheaded cross-functional delivery of core platform integrations with automated CI/CD canary deployments, maintaining 99.99% system availability.`,
  ];

  const coverLetter = `Dear Hiring Team at ${job.company},

I am writing to express my strong enthusiasm for the ${job.title} position in ${job.location}. Having followed ${job.company}'s engineering milestones and architectural leadership, I am excited about the opportunity to contribute to your core systems roadmap.

In my recent engineering experience, I specialized in ${techStackStr}, architecting resilient microservices that cut P99 latency by 38% and supported 12M+ daily active requests. My focus on clean domain boundaries, database query optimization, and high software engineering standards directly aligns with the technical requirements for this role.

I would welcome the opportunity to discuss how my background in distributed systems and high-velocity product execution can accelerate your engineering deliverables. Thank you for your time and consideration.

Sincerely,
[Candidate Name]`;

  const recruiterInMail = `Hi [Recruiter Name], I noticed the ${job.title} opening at ${job.company} and wanted to reach out directly. My background is centered around ${techStackStr} with a track record of scaling high-throughput distributed systems. I'd love to share my resume and discuss how I can contribute to the team!`;

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function handleSaveTracker() {
    if (onAddToTracker && job) {
      onAddToTracker(job);
      toast.success(`Added ${job.title} at ${job.company} to Application Tracker!`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-[#0a0f1d] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{job.title}</h3>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                  {job.company}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                {job.salary && <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="w-3 h-3" /> {job.salary}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSaveTracker}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track Job</span>
            </Button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-border/40">
          {[
            { id: "bullets" as const, label: "Google XYZ Resume Bullets", icon: FileText },
            { id: "cover_letter" as const, label: "Tailored Cover Letter", icon: Mail },
            { id: "inmail" as const, label: "Recruiter InMail Note", icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all",
                  activeTab === tab.id
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-lg"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[500px] overflow-y-auto space-y-4">
          {activeTab === "bullets" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">ATS Optimized Accomplishments for this Role</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(tailoredBullets.map((b) => `• ${b}`).join("\n"), "all_bullets")}
                  className="text-xs h-7 gap-1"
                >
                  {copiedKey === "all_bullets" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy All</span>
                </Button>
              </div>
              <div className="space-y-2">
                {tailoredBullets.map((b, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 space-y-2 group">
                    <p className="text-xs text-slate-200 leading-relaxed font-mono">• {b}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-border/20 text-[10px]">
                      <span className="text-emerald-400">Target Tech: {job.tech?.[i] || "Core Architecture"}</span>
                      <button
                        onClick={() => handleCopy(b, `bullet_${i}`)}
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        {copiedKey === `bullet_${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "cover_letter" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Custom 3-Paragraph Pitch</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(coverLetter, "cover_letter")}
                  className="text-xs h-7 gap-1"
                >
                  {copiedKey === "cover_letter" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Letter</span>
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-border/60 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
                {coverLetter}
              </div>
            </div>
          )}

          {activeTab === "inmail" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">300-Character Recruiter Note</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(recruiterInMail, "inmail")}
                  className="text-xs h-7 gap-1"
                >
                  {copiedKey === "inmail" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy InMail</span>
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-border/60 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
                {recruiterInMail}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
