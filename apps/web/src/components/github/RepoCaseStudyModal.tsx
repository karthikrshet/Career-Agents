"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Copy, Check, Sparkles, X, GitBranch,
  Star, GitFork, Cpu, ShieldCheck, Download
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepo } from "@/types";

export function RepoCaseStudyModal({
  repo,
  open = false,
  onClose,
}: {
  repo?: GitHubRepo | null;
  open?: boolean;
  onClose?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!open || !repo) return null;

  const caseStudyMarkdown = `# Architectural Case Study: ${repo.name}
**Primary Language / Stack:** ${repo.language || "TypeScript / Python"} | **Stars:** ${repo.stars || 0} | **Forks:** ${repo.forks || 0}
**Repository Link:** https://github.com/${repo.name}

## 1. Problem Statement & Scope
${repo.description || "Engineered a production-grade distributed system designed to solve high-throughput data processing and real-time synchronization bottlenecks."}

## 2. Architectural Design & Engineering Decisions
- **Microservices Core:** Decoupled business logic into stateless compute modules deployed on containerized clusters.
- **Data Access & Storage:** Implemented multi-tier caching with Redis and PostgreSQL compound indexes, achieving sub-30ms P99 query latency.
- **Fault Tolerance:** Configured retry policies with exponential backoff and circuit-breaker patterns to guarantee zero data loss.

## 3. Measurable Outcomes & Metrics for Resume
- Reduced average end-to-end response latency by 38% under peak concurrent traffic.
- Automated CI/CD testing pipeline with 90%+ code coverage across integration and unit test suites.
- Shipped clean, modular architecture adhering to SOLID principles and comprehensive OpenAPI documentation.
`;

  function handleCopy() {
    navigator.clipboard.writeText(caseStudyMarkdown);
    setCopied(true);
    toast.success("Architecture case study copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-[#0a0f1d] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Repository Architectural Case Study</h3>
              <p className="text-xs text-muted-foreground">{repo.name} · Resume & Portfolio Format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleCopy} className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs h-8">
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              <span>{copied ? "Copied!" : "Copy Markdown"}</span>
            </Button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[500px] overflow-y-auto space-y-4">
          <div className="p-4 rounded-2xl bg-black/60 border border-border/60 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
            {caseStudyMarkdown}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
