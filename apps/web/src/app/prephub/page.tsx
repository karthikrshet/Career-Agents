"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, CheckCircle, Circle, ChevronDown, ChevronUp, ExternalLink,
  Cpu, Layers, DollarSign, Award, BookOpen, Sparkles, ArrowRight,
  TrendingUp, Shield, BarChart2, Users, Flame, Zap
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// Comprehensive Tech Company Database with Architecture & Compensation Intelligence
const COMPANIES = [
  {
    id: "google",
    name: "Google",
    tier: 1 as const,
    logo: "🟢",
    hiringProcess: "Recruiter Screen → 1 Tech Phone Screen → 3-4 Onsite Coding + 1 System Design + 1 Googliness → Hiring Committee",
    url: "https://careers.google.com",
    techStack: ["Go", "C++", "Python", "Java", "Kubernetes", "Borg", "Spanner", "Bigtable"],
    medianSalary: "$264,000 (L5 SWE)",
    principles: [
      "Focus on the user and all else will follow",
      "Fast is better than slow",
      "Democracy on the web works",
      "Googliness (Intellectual humility & navigating ambiguity)",
    ],
    architectureHighlight: {
      title: "Google Spanner: Globally Distributed SQL Database",
      tech: "TrueTime API · Multi-Paxos consensus · MVCC",
      description: "Provides external consistency across worldwide datacenters with GPS/atomic clock synchronization.",
    },
    compensation: [
      { level: "L3 (Entry)", tc: "$195k - $225k", base: "$145k", equity: "$55k" },
      { level: "L4 (Mid)", tc: "$270k - $315k", base: "$175k", equity: "$100k" },
      { level: "L5 (Senior)", tc: "$380k - $450k", base: "$215k", equity: "$185k" },
      { level: "L6 (Staff)", tc: "$550k - $680k", base: "$270k", equity: "$320k" },
    ],
    leetCode: ["Median of Two Sorted Arrays", "Word Search II", "Logger Rate Limiter", "Snapshot Array"],
    courses: ["Google Spanner Distributed Architecture (MIT)", "Google Cloud Production Best Practices"],
    agents: ["Google Technical Coach", "Google Leadership Calibrator", "System Design Coach"],
    modules: [
      { id: "m1", category: "dsa", title: "Blind 75 & Hard Graph Algorithms", completed: false },
      { id: "m2", category: "system_design", title: "Design YouTube / Google Search Autocomplete", completed: false },
      { id: "m3", category: "behavioral", title: "Googliness, Ambiguity & Leadership Stories", completed: false },
      { id: "m4", category: "resume", title: "Resume tailored with quantified metrics for Google JD", completed: false },
      { id: "m5", category: "mock", title: "Mock Interview (2x Technical + 1x System Design)", completed: false },
    ],
  },
  {
    id: "meta",
    name: "Meta",
    tier: 1 as const,
    logo: "🔵",
    hiringProcess: "Recruiter Screen → Technical Phone (2 Mediums) → 2 Onsite Coding + 1 System Design (Meta-scale) + 1 Behavioral (JEDI)",
    url: "https://metacareers.com",
    techStack: ["React", "GraphQL", "Python", "PHP/Hack", "C++", "TAO", "PyTorch", "Memcached"],
    medianSalary: "$290,000 (E5 SWE)",
    principles: [
      "Move Fast",
      "Focus on Long-Term Impact",
      "Build Awesome Things",
      "Live in the Future",
      "Be Open and Direct",
    ],
    architectureHighlight: {
      title: "Meta TAO: Social Graph Data Store at Scale",
      tech: "Two-tier Caching over MySQL · Object-Association Graph API",
      description: "Handles billions of social graph queries per second with sub-millisecond read latency.",
    },
    compensation: [
      { level: "E3 (Entry)", tc: "$190k - $220k", base: "$140k", equity: "$55k" },
      { level: "E4 (Mid)", tc: "$280k - $325k", base: "$175k", equity: "$110k" },
      { level: "E5 (Senior)", tc: "$400k - $480k", base: "$220k", equity: "$200k" },
      { level: "E6 (Staff)", tc: "$600k - $750k", base: "$280k", equity: "$380k" },
    ],
    leetCode: ["Valid Palindrome II", "Subarray Sum Equals K", "Minimum Window Substring", "Accounts Merge"],
    courses: ["Systems Scaling at Meta-Scale", "GraphQL Advanced Patterns"],
    agents: ["Meta Mock Interactor", "Meta Impact Evaluator", "System Design Coach"],
    modules: [
      { id: "m1", category: "dsa", title: "Meta-tagged LeetCode (Trees, Graphs, BFS/DFS)", completed: false },
      { id: "m2", category: "system_design", title: "Design Instagram Newsfeed / Messenger", completed: false },
      { id: "m3", category: "behavioral", title: "Impactful Work, Moving Fast & JEDI Stories", completed: false },
      { id: "m4", category: "resume", title: "Quantified metric impact bullets", completed: false },
      { id: "m5", category: "mock", title: "Mock Interview (Meta System Design)", completed: false },
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    tier: 1 as const,
    logo: "🟠",
    hiringProcess: "Online Assessment (OA) → Technical Phone Screen → The Loop (4-5 rounds including 1 Bar Raiser)",
    url: "https://amazon.jobs",
    techStack: ["Java", "Python", "DynamoDB", "AWS Lambda", "EC2", "S3", "Kafka"],
    medianSalary: "$235,000 (SDE II)",
    principles: [
      "Customer Obsession",
      "Ownership & Bias for Action",
      "Invent and Simplify",
      "Hire and Develop the Best / Insist on Highest Standards",
      "Deliver Results & Frugality",
    ],
    architectureHighlight: {
      title: "Amazon DynamoDB: High-Throughput NoSQL Core",
      tech: "Consistent Hashing · Sloppy Quorums · Vector Clocks",
      description: "Guarantees single-digit millisecond latency at any scale for checkout and order flows.",
    },
    compensation: [
      { level: "SDE I (L4)", tc: "$175k - $205k", base: "$140k", equity: "$40k" },
      { level: "SDE II (L5)", tc: "$250k - $310k", base: "$175k", equity: "$95k" },
      { level: "SDE III (L6)", tc: "$360k - $440k", base: "$210k", equity: "$160k" },
      { level: "Principal (L7)", tc: "$520k - $680k", base: "$260k", equity: "$300k" },
    ],
    leetCode: ["Reorder Data in Log Files", "K Closest Points to Origin", "Integer to English Words", "Word Break II"],
    courses: ["Amazon SDE BootCamp", "AWS Cloud Distributed Architecture"],
    agents: ["Amazon Bar Raiser Simulator", "Amazon Leadership Calibrator", "System Design Coach"],
    modules: [
      { id: "m1", category: "behavioral", title: "16 Leadership Principles (STAR Stories with metrics)", completed: false },
      { id: "m2", category: "dsa", title: "Arrays, Strings, Trees, DP (OA format)", completed: false },
      { id: "m3", category: "system_design", title: "Design Amazon Flash Sale / Warehouse Fulfillment", completed: false },
      { id: "m4", category: "resume", title: "Leadership impact quantified for ATS", completed: false },
      { id: "m5", category: "mock", title: "Bar Raiser Mock Interview Session", completed: false },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    tier: 1 as const,
    logo: "✳️",
    hiringProcess: "Recruiter Screen → PyTorch Coding Screen → Onsite (Neural Network Coding, High-Scale ML Systems, Alignment & AI Safety)",
    url: "https://anthropic.com/careers",
    techStack: ["Python", "PyTorch", "Rust", "TypeScript", "Ray", "Triton", "Kubernetes", "AWS GPUs"],
    medianSalary: "$480,000 (MTS Senior)",
    principles: [
      "AI Safety as Core Mission",
      "Empirical Rigor & Scientific Method",
      "High Ownership in Small Teams",
      "Constitutional AI & Model Alignment",
    ],
    architectureHighlight: {
      title: "Constitutional AI & Automated Feedback Alignment",
      tech: "RL from AI Feedback (RLAIF) · Principle-guided self-critique",
      description: "Enables frontier model capability and safety alignment with automated red-teaming.",
    },
    compensation: [
      { level: "MTS (Senior)", tc: "$400k - $650k", base: "$250k - $320k", equity: "$200k - $350k" },
      { level: "Principal MTS", tc: "$650k - $1.1M+", base: "$320k+", equity: "$450k+" },
    ],
    leetCode: ["Implement Transformer Attention", "GPU Memory Allocator", "Paged KV Cache Manager"],
    courses: ["Deep Learning Systems & Scaling Laws", "Transformer Interpretability"],
    agents: ["Anthropic AI Coach", "Anthropic Interview Coach", "AI Engineer Career Coach"],
    modules: [
      { id: "m1", category: "dsa", title: "PyTorch tensor operations & neural net from scratch", completed: false },
      { id: "m2", category: "system_design", title: "Design High-Throughput LLM Inference Server (Continuous Batching)", completed: false },
      { id: "m3", category: "behavioral", title: "AI Safety, Empirical Research Taste & Autonomy", completed: false },
      { id: "m4", category: "resume", title: "AI / ML research achievements and systems experience", completed: false },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    tier: 1 as const,
    logo: "💜",
    hiringProcess: "Recruiter Screen → Technical Screen → Work Trial (Debugging & Building Real Systems) → System Design & Values",
    url: "https://stripe.com/jobs",
    techStack: ["Ruby", "TypeScript", "React", "Go", "PostgreSQL", "Kafka", "Sorbet"],
    medianSalary: "$310,000 (L3 Engineer)",
    principles: ["High standards", "Users first", "Move fast", "Macro-optimism, micro-pessimism"],
    architectureHighlight: {
      title: "Stripe Idempotency & Financial Ledgers",
      tech: "Idempotency Keys · Double-entry bookkeeping ledgers · PostgreSQL row-level locks",
      description: "Guarantees zero duplicate charges and absolute consistency for billions in financial transactions.",
    },
    compensation: [
      { level: "L2 (Mid)", tc: "$250k - $290k", base: "$165k", equity: "$95k" },
      { level: "L3 (Senior)", tc: "$340k - $420k", base: "$210k", equity: "$160k" },
      { level: "L4 (Staff)", tc: "$500k - $640k", base: "$260k", equity: "$280k" },
    ],
    leetCode: ["Design Hit Counter", "API Rate Limiter Implementation", "Minimum Number of Keypresses"],
    courses: ["Financial API System Designs", "Mastering Concurrency & Event Sourcing"],
    agents: ["Stripe Work Trial Coach", "Stripe API Architect Agent"],
    modules: [
      { id: "m1", category: "dsa", title: "Clean code & debugging real repositories (Stripe Work Trial)", completed: false },
      { id: "m2", category: "system_design", title: "Design Payment Gateway & Ledger Processing", completed: false },
      { id: "m3", category: "behavioral", title: "High-standards craftsmanship & user-first stories", completed: false },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    tier: 1 as const,
    logo: "✳️",
    hiringProcess: "Intro Screen → Technical Coding / DL Math Screen → Onsite (Research & Systems Architecture)",
    url: "https://openai.com/careers",
    techStack: ["Python", "PyTorch", "Kubernetes", "Redis", "Triton", "Ray", "Azure GPUs"],
    medianSalary: "$420,000 (Member of Tech Staff)",
    principles: ["Ensure AGI benefits all humanity", "Research taste", "Mission alignment", "Technical rigor"],
    architectureHighlight: {
      title: "Triton GPU Kernel Programming & PagedAttention",
      tech: "Custom GPU kernels · Memory bandwidth optimization · KV Cache",
      description: "Maximizes GPU compute utilization across multi-thousand H100 clusters.",
    },
    compensation: [
      { level: "MTS (Senior)", tc: "$450k - $750k", base: "$275k", equity: "$250k - $450k" },
      { level: "Principal MTS", tc: "$800k - $1.4M+", base: "$350k+", equity: "$550k+" },
    ],
    leetCode: ["GPU Memory Allocator Model", "Queue Rate Limiter", "Design KV Cache Storage"],
    courses: ["Deep Learning Fundamentals", "LLM Inference Scaling & Architectures"],
    agents: ["OpenAI Research Coach", "OpenAI Triton System Analyst"],
    modules: [
      { id: "m1", category: "dsa", title: "Distributed ML systems coding (Python & PyTorch)", completed: false },
      { id: "m2", category: "system_design", title: "Design Planetary-Scale LLM Inference & Training Cluster", completed: false },
      { id: "m3", category: "behavioral", title: "Mission alignment, research taste & high autonomy", completed: false },
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  dsa: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  system_design: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  behavioral: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  resume: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  mock: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function PrepHubPage() {
  const companyProgress = useStore((s) => s.companyProgress);
  const togglePrepModule = useStore((s) => s.togglePrepModule);
  const [expanded, setExpanded] = useState<string | null>("google");
  const [activeTab, setActiveTab] = useState<"all" | "faang" | "ai" | "fintech">("all");

  const filteredCompanies = COMPANIES.filter((c) => {
    if (activeTab === "faang") return ["google", "meta", "amazon"].includes(c.id);
    if (activeTab === "ai") return ["anthropic", "openai"].includes(c.id);
    if (activeTab === "fintech") return ["stripe"].includes(c.id);
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-auto bg-[#03060f] text-slate-100 font-sans">
      <Topbar
        title="Company Intelligence & Battle Station"
        subtitle="Deep architectural dossiers, compensation ladders, and personalized interview roadmaps"
      />

      <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Header Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/60 rounded-2xl border border-border/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {[
              { id: "all" as const, label: "All Target Companies", count: COMPANIES.length },
              { id: "faang" as const, label: "FAANG / Big Tech", count: 3 },
              { id: "ai" as const, label: "Frontier AI Labs", count: 2 },
              { id: "fintech" as const, label: "High-Growth Fintech", count: 1 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeTab === tab.id
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pr-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Updated with 2026 Interview Formats</span>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="space-y-4">
          {filteredCompanies.map((company, i) => {
            const progress = companyProgress[company.id] || {};
            const completed = company.modules.filter((m) => progress[m.id]).length;
            const pct = Math.round((completed / company.modules.length) * 100);
            const isExpanded = expanded === company.id;

            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={cn(
                    "glass glass-hover overflow-hidden transition-all duration-300 border",
                    isExpanded ? "border-cyan-500/40 ring-1 ring-cyan-500/20 shadow-2xl" : "border-border/60",
                    pct === 100 && "border-emerald-500/30"
                  )}
                >
                  {/* Card Banner Header */}
                  <button
                    className="w-full text-left"
                    onClick={() => setExpanded(isExpanded ? null : company.id)}
                  >
                    <CardHeader className="p-5 pb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-secondary/80 border border-border/80 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                            {company.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg font-bold text-white">{company.name}</CardTitle>
                              <Badge variant="default" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                                Tier {company.tier} Focus
                              </Badge>
                              {pct === 100 && (
                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                                  Ready for Loop
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {company.hiringProcess}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="hidden sm:flex flex-col items-end text-right">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Prep Velocity</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={pct} className="h-2 w-24" />
                              <span className="text-xs font-mono font-bold text-cyan-400">
                                {completed}/{company.modules.length}
                              </span>
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-secondary/40 border border-border/40 text-muted-foreground">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {/* Expanded Battle Station */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <CardContent className="px-5 pb-6 pt-0 space-y-6">
                          {/* Row 1: System Design Case Study & Tech Architecture */}
                          {company.architectureHighlight && (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 border border-cyan-500/30 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Cpu className="w-4 h-4 text-cyan-400" />
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                                    Target Architecture Case Study
                                  </h4>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {company.architectureHighlight.tech}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-slate-100">
                                {company.architectureHighlight.title}
                              </p>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {company.architectureHighlight.description}
                              </p>
                            </div>
                          )}

                          {/* Row 2: Compensation Ladder & Tech Stack Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Compensation Ladder */}
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-border/60 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                  <DollarSign className="w-4 h-4" />
                                  <span>Compensation & Leveling Ladder (TC)</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px]">
                                  {company.medianSalary}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {company.compensation?.map((comp) => (
                                  <div
                                    key={comp.level}
                                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-border/40"
                                  >
                                    <span className="font-bold text-slate-200">{comp.level}</span>
                                    <div className="text-right font-mono">
                                      <span className="text-emerald-400 font-bold">{comp.tc}</span>
                                      <span className="text-[10px] text-muted-foreground ml-2">
                                        (Base: {comp.base})
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Principles & Recommended Agents */}
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-border/60 space-y-3">
                              <div className="flex items-center gap-2 text-violet-400 font-bold">
                                <Award className="w-4 h-4" />
                                <span>Leadership Principles & Evaluation Criteria</span>
                              </div>
                              <ul className="space-y-1.5 text-slate-300">
                                {company.principles.map((pr, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-violet-400 font-bold">•</span>
                                    <span>{pr}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="pt-2 border-t border-border/40">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1.5">
                                  Dedicated Specialist Agents
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {company.agents.map((ag) => (
                                    <Badge
                                      key={ag}
                                      variant="secondary"
                                      className="text-[10px] bg-secondary/80 text-cyan-300 border-border/60"
                                    >
                                      🤖 {ag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Row 3: Actionable LeetCode & System Design Milestones */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                                Structured Preparation Loop Milestones
                              </p>
                              <div className="flex items-center gap-2">
                                <Link href={`/interview?company=${company.name}`}>
                                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-xs h-7">
                                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                                    Launch {company.name} Mock Session
                                  </Button>
                                </Link>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {company.modules.map((mod) => {
                                const done = !!progress[mod.id];
                                return (
                                  <button
                                    key={mod.id}
                                    onClick={() => togglePrepModule(company.id, mod.id)}
                                    className={cn(
                                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                                      done
                                        ? "border-emerald-500/30 bg-emerald-500/10 text-slate-300"
                                        : "border-border/60 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-secondary/40 text-slate-200"
                                    )}
                                  >
                                    {done ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                                    )}
                                    <span className={cn("flex-1 text-xs sm:text-sm font-medium", done && "line-through text-muted-foreground")}>
                                      {mod.title}
                                    </span>
                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold uppercase", CATEGORY_COLORS[mod.category])}>
                                      {mod.category.replace("_", " ")}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Footer links */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                            <a
                              href={company.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-medium"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View {company.name} Official Careers & Open Roles
                            </a>

                            <div className="flex items-center gap-3 text-muted-foreground text-xs">
                              <span>Recommended Stack: {company.techStack.slice(0, 4).join(", ")}</span>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
