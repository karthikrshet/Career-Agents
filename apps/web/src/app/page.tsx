"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, GitBranch, Link2, Mic,
  KanbanSquare, TrendingUp, Activity, Target, Clock,
  ArrowRight, CheckCircle2, Circle, Zap
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn, scoreToColor, scoreToGrade, scoreToBgColor, timeAgo } from "@/lib/utils";

const SCORE_HISTORY_MOCK = [
  { week: "W1", score: 0 },
  { week: "W2", score: 0 },
  { week: "W3", score: 0 },
  { week: "W4", score: 0 },
];

const MODULE_CARDS = [
  {
    href: "/resume",
    icon: FileText,
    label: "Resume Studio",
    description: "ATS analysis, bullet rewriting, keyword gaps",
    metricKey: "resumeScore" as const,
    color: "from-sky-500/20 to-sky-600/5",
    border: "hover:border-sky-500/30",
    iconColor: "text-sky-400",
    cta: "Analyze Resume",
  },
  {
    href: "/GitBranch",
    icon: GitBranch,
    label: "GitBranch Analyzer",
    description: "Portfolio health, language stats, README quality",
    metricKey: "githubScore" as const,
    color: "from-indigo-500/20 to-indigo-600/5",
    border: "hover:border-indigo-500/30",
    iconColor: "text-indigo-400",
    cta: "Audit GitBranch",
  },
  {
    href: "/Link2",
    icon: Link2,
    label: "Link2 Optimizer",
    description: "Visibility score, headline rewrites, keyword density",
    metricKey: "linkedinScore" as const,
    color: "from-blue-500/20 to-blue-600/5",
    border: "hover:border-blue-500/30",
    iconColor: "text-blue-400",
    cta: "Optimize Profile",
  },
  {
    href: "/interview",
    icon: Mic,
    label: "Interview Lab",
    description: "AI-generated questions, STAR scorecard, live feedback",
    metricKey: "interviewScore" as const,
    color: "from-violet-500/20 to-violet-600/5",
    border: "hover:border-violet-500/30",
    iconColor: "text-violet-400",
    cta: "Start Session",
  },
  {
    href: "/tracker",
    icon: KanbanSquare,
    label: "Job Tracker",
    description: "Kanban pipeline, application history, follow-up reminders",
    metricKey: "applicationScore" as const,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "hover:border-emerald-500/30",
    iconColor: "text-emerald-400",
    cta: "Open Tracker",
  },
];

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#38bdf8" : score >= 40 ? "#fbbf24" : "#f87171";

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}

const RADAR_LABELS: Record<string, string> = {
  Resume: "resumeScore",
  GitBranch: "githubScore",
  Link2: "linkedinScore",
  Interview: "interviewScore",
  Jobs: "applicationScore",
  Overall: "careerScore",
};

export default function DashboardPage() {
  const metrics = useStore((s) => s.metrics);
  const profile = useStore((s) => s.profile);
  const activityFeed = useStore((s) => s.activityFeed);
  const jobApplications = useStore((s) => s.jobApplications);
  const interviewSessions = useStore((s) => s.interviewSessions);
  const setProfile = useStore((s) => s.setProfile);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Prompt for GitBranch username if no profile
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
    { subject: "GitBranch", value: metrics.githubScore, fullMark: 100 },
    { subject: "Link2", value: metrics.linkedinScore, fullMark: 100 },
    { subject: "Interview", value: metrics.interviewScore, fullMark: 100 },
    { subject: "Jobs", value: metrics.applicationScore, fullMark: 100 },
    { subject: "Overall", value: metrics.careerScore, fullMark: 100 },
  ];

  const completedModules = [
    metrics.resumeScore > 0,
    metrics.githubScore > 0,
    metrics.linkedinScore > 0,
    metrics.interviewScore > 0,
    metrics.applicationScore > 0,
  ].filter(Boolean).length;

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar
        title="Dashboard"
        subtitle={profile ? `Welcome back, ${profile.name}` : "Career Intelligence Platform"}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Setup banner */}
        {!profile && !showSetup && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 border border-primary/20 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Set up your profile to get started</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tell Career OS your name and target role to personalize your experience.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowSetup(true)}>Get Started</Button>
          </motion.div>
        )}

        {showSetup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-6 border border-primary/20 space-y-4"
          >
            <h3 className="font-semibold">Quick Setup</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Your Name</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Alex Johnson"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Target Role</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Senior Software Engineer"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleProfileSave}>Save Profile</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSetup(false)}>Skip</Button>
            </div>
          </motion.div>
        )}

        {/* Top stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Career Score", value: metrics.careerScore, icon: TrendingUp, color: "text-sky-400", change: null },
            { label: "Modules Done", value: `${completedModules}/5`, icon: CheckCircle2, color: "text-emerald-400", change: null },
            { label: "Applications", value: jobApplications.length, icon: KanbanSquare, color: "text-violet-400", change: null },
            { label: "Interviews", value: interviewSessions.length, icon: Mic, color: "text-amber-400", change: null },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="glass glass-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</p>
                    </div>
                    <div className={cn("w-9 h-9 rounded-lg bg-secondary flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Middle section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="glass h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Career Radar</CardTitle>
                <CardDescription>Your 6-dimension readiness map</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.careerScore === 0 ? (
                  <div className="h-56 flex flex-col items-center justify-center text-center gap-2">
                    <Activity className="w-8 h-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Complete a module to populate the radar</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(215 20% 45%)", fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        dataKey="value"
                        stroke="#38bdf8"
                        fill="#38bdf8"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Module cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 space-y-3"
          >
            {MODULE_CARDS.map((mod, i) => {
              const score = metrics[mod.metricKey];
              const grade = scoreToGrade(score);
              return (
                <motion.div
                  key={mod.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <Link href={mod.href}>
                    <div className={cn(
                      "glass rounded-xl p-4 border border-border transition-all duration-200",
                      "hover:shadow-glow-sky cursor-pointer group",
                      mod.border
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
                          mod.color
                        )}>
                          <mod.icon className={cn("w-4 h-4", mod.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{mod.label}</span>
                            {score > 0 && (
                              <Badge
                                variant={score >= 75 ? "success" : score >= 50 ? "info" : "warning"}
                                className="text-[10px] py-0"
                              >
                                {grade}
                              </Badge>
                            )}
                          </div>
                          <Progress value={score} className="h-1.5" />
                          <p className="text-[11px] text-muted-foreground mt-1">{mod.description}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={cn(
                            "text-lg font-bold tabular-nums",
                            score > 0 ? scoreToColor(score) : "text-muted-foreground/40"
                          )}>
                            {score > 0 ? score : "—"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5 duration-200" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Activity Feed</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {activityFeed.length === 0 ? (
                <div className="py-8 text-center">
                  <Activity className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No activity yet — analyze your resume or GitBranch profile to get started.
                  </p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Link href="/resume">
                      <Button size="sm" variant="outline">
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Upload Resume
                      </Button>
                    </Link>
                    <Link href="/GitBranch">
                      <Button size="sm" variant="outline">
                        <GitBranch className="w-3.5 h-3.5 mr-1.5" />
                        Audit GitBranch
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {activityFeed.slice(0, 8).map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <Activity className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{entry.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {entry.score !== undefined && (
                          <span className={cn("text-sm font-bold tabular-nums", scoreToColor(entry.score))}>
                            {entry.score}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground/60">
                          {timeAgo(entry.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


