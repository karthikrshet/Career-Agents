"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, GitBranch, Link2, Mic,
  KanbanSquare, TrendingUp, Activity, Clock,
  ArrowRight, Zap, Search, Compass,
  Bot, Server, Terminal, FileSpreadsheet, Sparkles, Layers, Cpu
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn, scoreToColor, timeAgo } from "@/lib/utils";

const REAL_FEATURE_MODULES = [
  {
    href: "/interview/voice",
    icon: Mic,
    label: "AI Voice Agent Lab v1.0",
    description: "1-on-1 spoken AI mock interviews, Web Speech STT/TTS & STAR telemetry",
    badge: "167 Agents",
    metricKey: "interviewScore" as const,
    color: "from-amber-500/20 to-amber-600/5",
    border: "hover:border-amber-500/40",
    iconColor: "text-amber-400",
    cta: "Launch Voice Lab",
  },
  {
    href: "/resume",
    icon: FileText,
    label: "ATS Resume Studio",
    description: "20 ATS templates, STAR bullet rewriter, keyword gap analysis & export",
    badge: "20 Templates",
    metricKey: "resumeScore" as const,
    color: "from-cyan-500/20 to-cyan-600/5",
    border: "hover:border-cyan-500/40",
    iconColor: "text-cyan-400",
    cta: "Analyze Resume",
  },
  {
    href: "/github",
    icon: GitBranch,
    label: "GitHub Portfolio Analyzer",
    description: "Language breakdown, commit heatmaps, star weight & documentation audit",
    badge: "API Audit",
    metricKey: "githubScore" as const,
    color: "from-indigo-500/20 to-indigo-600/5",
    border: "hover:border-indigo-500/40",
    iconColor: "text-indigo-400",
    cta: "Audit GitHub",
  },
  {
    href: "/linkedin",
    icon: Link2,
    label: "LinkedIn Profile Optimizer",
    description: "Search visibility index, headline pipe architecture & AI post generator",
    badge: "Search Index",
    metricKey: "linkedinScore" as const,
    color: "from-blue-500/20 to-blue-600/5",
    border: "hover:border-blue-500/40",
    iconColor: "text-blue-400",
    cta: "Optimize Profile",
  },
  {
    href: "/interview",
    icon: Sparkles,
    label: "STAR Mock Interview Lab",
    description: "10 Technical & behavioral tracks with code canvas & STAR scorecards",
    badge: "10 Tracks",
    metricKey: "interviewScore" as const,
    color: "from-violet-500/20 to-violet-600/5",
    border: "hover:border-violet-500/40",
    iconColor: "text-violet-400",
    cta: "Start Session",
  },
  {
    href: "/copilot",
    icon: Bot,
    label: "AI Copilot Workspace",
    description: "Interactive real-time career companion with context-aware chat",
    badge: "Copilot AI",
    metricKey: null,
    color: "from-sky-500/20 to-indigo-600/5",
    border: "hover:border-sky-500/40",
    iconColor: "text-sky-400",
    cta: "Open Copilot",
  },
  {
    href: "/jobs",
    icon: Search,
    label: "Job Opportunities Hub",
    description: "30+ Tech job leads with ATS match scoring & cover letter generator",
    badge: "30+ Leads",
    metricKey: null,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "hover:border-emerald-500/40",
    iconColor: "text-emerald-400",
    cta: "Find Jobs",
  },
  {
    href: "/tracker",
    icon: KanbanSquare,
    label: "Kanban Job Tracker",
    description: "Application pipeline management (Wishlist, Applied, Interview, Offer)",
    badge: "Kanban Board",
    metricKey: "applicationScore" as const,
    color: "from-emerald-500/20 to-teal-600/5",
    border: "hover:border-emerald-500/40",
    iconColor: "text-emerald-400",
    cta: "Open Tracker",
  },
  {
    href: "/roadmap",
    icon: Compass,
    label: "Prep Hub & Career Roadmaps",
    description: "Personalized study roadmaps for Backend, AI/ML & System Architecture",
    badge: "Roadmaps",
    metricKey: null,
    color: "from-purple-500/20 to-purple-600/5",
    border: "hover:border-purple-500/40",
    iconColor: "text-purple-400",
    cta: "View Roadmaps",
  },
  {
    href: "/workflows",
    icon: Zap,
    label: "Workflow Pipelines",
    description: "Multi-agent automated pipelines for resume, portfolio & interview audits",
    badge: "Multi-Agent",
    metricKey: null,
    color: "from-yellow-500/20 to-amber-600/5",
    border: "hover:border-yellow-500/40",
    iconColor: "text-yellow-400",
    cta: "Run Pipeline",
  },
  {
    href: "/marketplace",
    icon: Layers,
    label: "AI Agent Marketplace",
    description: "Browse & activate 167 specialized agents across 19 career divisions",
    badge: "167 Agents",
    metricKey: null,
    color: "from-violet-500/20 to-purple-600/5",
    border: "hover:border-violet-500/40",
    iconColor: "text-violet-400",
    cta: "Browse Marketplace",
  },
  {
    href: "/settings",
    icon: Server,
    label: "Multi-Provider AI Gateway",
    description: "Configure 18 AI Backends (Groq, Gemini, OpenAI, Claude, DeepSeek)",
    badge: "18 Providers",
    metricKey: null,
    color: "from-orange-500/20 to-amber-600/5",
    border: "hover:border-orange-500/40",
    iconColor: "text-orange-400",
    cta: "Configure AI",
  },
  {
    href: "/mcp",
    icon: Terminal,
    label: "Model Context Protocol (MCP)",
    description: "Stdio server connecting 25 career tools directly to Cursor & VS Code",
    badge: "Stdio Server",
    metricKey: null,
    color: "from-blue-500/20 to-cyan-600/5",
    border: "hover:border-blue-500/40",
    iconColor: "text-blue-400",
    cta: "Connect IDE",
  },
  {
    href: "/reports",
    icon: FileSpreadsheet,
    label: "Dossier Diagnostics & Reports",
    description: "Export complete career dossiers to PDF, Word (.docx), Excel & Markdown",
    badge: "Export Engine",
    metricKey: null,
    color: "from-teal-500/20 to-green-600/5",
    border: "hover:border-teal-500/40",
    iconColor: "text-teal-400",
    cta: "Export Dossier",
  },
  {
    href: "/playground",
    icon: Cpu,
    label: "Prompt & Code Playground",
    description: "Experiment with custom prompts, code snippets & AI model parameters",
    badge: "AI Sandbox",
    metricKey: null,
    color: "from-fuchsia-500/20 to-purple-600/5",
    border: "hover:border-fuchsia-500/40",
    iconColor: "text-fuchsia-400",
    cta: "Open Playground",
  },
  {
    href: "/templates",
    icon: FileText,
    label: "ATS Resume Templates",
    description: "Preview & select from 20 industry-certified ATS resume designs",
    badge: "20 Designs",
    metricKey: null,
    color: "from-rose-500/20 to-red-600/5",
    border: "hover:border-rose-500/40",
    iconColor: "text-rose-400",
    cta: "View Templates",
  },
];

export default function DashboardPage() {
  const metrics = useStore((s) => s.metrics);
  const profile = useStore((s) => s.profile);
  const activityFeed = useStore((s) => s.activityFeed);
  const jobApplications = useStore((s) => s.jobApplications);
  const interviewSessions = useStore((s) => s.interviewSessions);
  const setProfile = useStore((s) => s.setProfile);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [showSetup, setShowSetup] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  function handleProfileSave() {
    if (!nameInput) return;
    setProfile({
      id: "local",
      name: nameInput,
      email: "",
      targetRole: roleInput,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowSetup(false);
  }

  const radarData = [
    { subject: "Resume", value: metrics.resumeScore, fullMark: 100 },
    { subject: "GitHub", value: metrics.githubScore, fullMark: 100 },
    { subject: "LinkedIn", value: metrics.linkedinScore, fullMark: 100 },
    { subject: "Interview", value: metrics.interviewScore, fullMark: 100 },
    { subject: "Jobs", value: metrics.applicationScore, fullMark: 100 },
    { subject: "Overall", value: metrics.careerScore, fullMark: 100 },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-950 text-slate-100 font-sans">
      <Topbar
        title="Career Cockpit Dashboard"
        subtitle={profile ? `Welcome back, ${profile.name} — Platform Control Panel` : "AI Career Operating System & Telemetry Controls"}
      />

      <div className="flex-1 p-5 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Setup banner */}
        {!profile && !showSetup && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 border border-cyan-500/20 flex items-center gap-4 bg-slate-900/60 shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">Setup your candidate profile</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set your target role and candidate background to personalize your AI Copilot responses.
              </p>
            </div>
            <Button size="sm" className="h-8 text-xs px-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold border-0" onClick={() => setShowSetup(true)}>
              Quick Setup
            </Button>
          </motion.div>
        )}

        {showSetup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-4 bg-slate-900/80"
          >
            <h3 className="font-bold text-sm text-white">Quick Candidate Setup</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Your Full Name</label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Karthik Shet"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Position / Role</label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Senior Software Engineer / AI Systems Architect"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-cyan-500 text-slate-950 font-bold" onClick={handleProfileSave}>Save Profile</Button>
              <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => setShowSetup(false)}>Skip</Button>
            </div>
          </motion.div>
        )}

        {/* Top Telemetry Stats Grid (6 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: "Career Score", value: `${metrics.careerScore}/100`, icon: TrendingUp, color: "text-cyan-400" },
            { label: "Active AI Agents", value: "167 Agents", icon: Bot, color: "text-amber-400" },
            { label: "AI Gateways", value: "18 Providers", icon: Server, color: "text-indigo-400" },
            { label: "Verified Modules", value: `${REAL_FEATURE_MODULES.length} Features`, icon: Layers, color: "text-violet-400" },
            { label: "Job Applications", value: jobApplications.length, icon: KanbanSquare, color: "text-emerald-400" },
            { label: "Mock Interviews", value: interviewSessions.length, icon: Mic, color: "text-rose-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass border-white/10 bg-slate-900/50 hover:bg-slate-900/80 transition-all shadow-lg">
                <CardContent className="p-3.5">
                  <div className="flex items-center justify-between gap-1.5 mb-1 text-slate-400">
                    <span className="text-xs font-semibold text-slate-300 truncate">{stat.label}</span>
                    <stat.icon className={cn("w-4 h-4 shrink-0", stat.color)} />
                  </div>
                  <p className={cn("text-lg font-black tracking-tight", stat.color)}>{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Middle Section: Radar Chart & Feature Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-1"
          >
            <Card className="glass border-white/10 bg-slate-900/50 h-full flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                  <Activity className="w-4.5 h-4.5 text-cyan-400" />
                  6-Dimension Readiness Radar
                </CardTitle>
                <CardDescription className="text-xs">Live candidate profile competency distribution</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex-1 flex items-center justify-center">
                {metrics.careerScore === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center text-center gap-2">
                    <Activity className="w-8 h-8 text-slate-600" />
                    <p className="text-xs text-slate-400">Upload a resume or run an audit to map your 6 dimensions</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#cbd5e1", fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        dataKey="value"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Clean 16 Feature Modules Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-slate-900/60 px-5 py-3.5 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <LayoutDashboard className="w-4.5 h-4.5 text-cyan-400" />
                  Verified Platform Feature Modules ({REAL_FEATURE_MODULES.length} Active)
                </h2>
                <p className="text-xs text-slate-400">Access full-featured career intelligence engines</p>
              </div>
            </div>

            {/* 16 Feature Modules Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[560px] overflow-y-auto pr-1.5">
              {REAL_FEATURE_MODULES.map((mod, i) => {
                const score = mod.metricKey ? metrics[mod.metricKey] : 0;
                return (
                  <motion.div
                    key={mod.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link href={mod.href}>
                      <div className={cn(
                        "glass rounded-2xl p-4 border border-white/10 bg-slate-900/40 transition-all duration-200",
                        "hover:scale-[1.01] hover:bg-slate-900/80 cursor-pointer group flex flex-col justify-between h-full space-y-3 shadow-md",
                        mod.border
                      )}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 border border-white/10 shadow-md",
                              mod.color
                            )}>
                              <mod.icon className={cn("w-5 h-5", mod.iconColor)} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                                {mod.label}
                              </h3>
                            </div>
                          </div>

                          <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full shrink-0 font-semibold">
                            {mod.badge}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {mod.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            {mod.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          {score > 0 && (
                            <span className={cn("font-bold text-xs tabular-nums", scoreToColor(score))}>
                              Score: {score}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Funnels & Analytics Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Conversion Funnel */}
          <Card className="glass border-white/10 bg-slate-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <KanbanSquare className="w-4 h-4 text-emerald-400" />
                Application Pipeline Conversion Funnel
              </CardTitle>
              <CardDescription className="text-xs">Live conversion metrics across active job applications</CardDescription>
            </CardHeader>
            <CardContent className="h-56 flex flex-col justify-around pt-2">
              {[
                { stage: "Applied Leads", count: jobApplications.length, pct: 100, color: "bg-sky-500" },
                { stage: "Screenings Scheduled", count: jobApplications.filter(j => ["Phone Screen", "Onsite", "OA"].includes(j.status)).length, pct: Math.round((jobApplications.filter(j => ["Phone Screen", "Onsite", "OA"].includes(j.status)).length / Math.max(1, jobApplications.length)) * 100), color: "bg-indigo-500" },
                { stage: "Interview Sessions Completed", count: interviewSessions.length, pct: Math.round((interviewSessions.length / Math.max(1, jobApplications.length)) * 100), color: "bg-violet-500" },
                { stage: "Offer Decisions", count: jobApplications.filter(j => j.status === "Offer").length, pct: Math.round((jobApplications.filter(j => j.status === "Offer").length / Math.max(1, jobApplications.length)) * 100), color: "bg-emerald-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.stage}</span>
                    <span className="text-slate-400">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                    <div className={cn("h-full rounded-full transition-all duration-500", item.color)} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="glass border-white/10 bg-slate-900/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  System Activity Stream &amp; Audit Logs
                </CardTitle>
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
              <CardDescription className="text-xs">Real-time telemetry trace of recent platform executions</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {activityFeed.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <Activity className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No activity recorded yet — run a resume analysis, GitHub audit, or voice interview session to populate.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <Link href="/resume">
                      <Button size="sm" variant="outline" className="h-8 text-xs border-white/10 text-slate-300 font-semibold">
                        <FileText className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                        Analyze Resume
                      </Button>
                    </Link>
                    <Link href="/interview/voice">
                      <Button size="sm" className="h-8 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-0">
                        <Mic className="w-3.5 h-3.5 mr-1.5" />
                        Launch Voice Lab
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activityFeed.slice(0, 6).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 truncate">{entry.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{entry.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {entry.score !== undefined && (
                          <span className={cn("font-bold text-xs tabular-nums", scoreToColor(entry.score))}>
                            {entry.score}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {timeAgo(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
