/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Search, Star, GitFork, Users, BookOpen,
  Loader2, ExternalLink, AlertCircle, CheckCircle,
  TrendingUp, Code2, Award, X, Shield, Info, Terminal, Copy
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { analyzeGitHubProfile } from "@/lib/github-api";
import { cn, scoreToColor, scoreToGrade, scoreToBgColor } from "@/lib/utils";

export default function GitHubPage() {
  const GitHubAnalysis = useStore((s) => s.GitHubAnalysis);
  const setGitHubAnalysis = useStore((s) => s.setGitHubAnalysis);
  const profile = useStore((s) => s.profile);

  const [username, setUsername] = useState(profile?.githubUsername || "");
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);

  async function handleAnalyze() {
    const u = username.trim().replace(/^@/, "");
    if (!u) { toast.error("Enter a GitBranch username"); return; }
    setLoading(true);
    try {
      const data = await analyzeGitHubProfile(u);
      setGitHubAnalysis(data);
      toast.success(`@${u} analyzed — ${data.portfolioScore}% portfolio score`);
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch GitBranch profile. Check the username.");
    } finally {
      setLoading(false);
    }
  }

  const data = GitHubAnalysis;

  // Mock README data generator
  function getMockReadme(repoName: string) {
    return `# ${repoName}
    
## Project Overview
This repository provides primary microservice modules and algorithmic logic patterns tailored for Career Agents portfolio configurations.

### 🚀 Quick Start
\`\`\`bash
# Install dependencies
npm install

# Start local server
npm run dev
\`\`\`

### 🛠️ Architecture Specs
- Built with TypeScript & React frameworks
- Strict ESD-level defensive coding guards
- Configured with CI actions pipeline
`;
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="GitBranch Analyzer" subtitle="Live portfolio health audit from the GitBranch API" />

      <div className="flex-1 p-6 space-y-6">
        {/* Search bar */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Enter GitBranch username (e.g. torvalds)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <Button onClick={handleAnalyze} disabled={loading || !username.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Fetching live data from GitBranch API...</p>
            </motion.div>
          )}

          {!loading && data && (
            <motion.div
              key={data.username}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile header */}
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start gap-5">
                    <img
                      src={data.avatarUrl}
                      alt={data.name}
                      className="w-16 h-16 rounded-full border-2 border-border"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h2 className="text-lg font-bold">{data.name}</h2>
                      <p className="text-sm text-muted-foreground">@{data.username}</p>
                      {data.bio && <p className="text-sm mt-2 text-foreground/80">{data.bio}</p>}
                      <div className="flex flex-wrap gap-4 mt-3">
                        {[
                          { icon: Users, label: `${data.followers || 0} followers` },
                          { icon: Users, label: `${data.following || 0} following` },
                          { icon: BookOpen, label: `${data.publicRepos || 0} repos` },
                          { icon: Star, label: `${data.totalStars || 0} stars` },
                          { icon: GitFork, label: `${data.totalForks || 0} forks` },
                        ].map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <s.icon className="w-3.5 h-3.5 text-primary" />
                            {s.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Score */}
                    <div className={cn("rounded-xl p-5 text-center border", scoreToBgColor(data.portfolioScore))}>
                      <div className="text-3xl font-bold tabular-nums">{data.portfolioScore}</div>
                      <div className="text-xs mt-0.5 font-medium">{scoreToGrade(data.portfolioScore)}</div>
                      <div className="text-[10px] opacity-70">Portfolio Score</div>
                    </div>
                    <a href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View on GitBranch
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Heatmap Section */}
              {data.contributionData && data.contributionData.length > 0 && (
                <Card className="glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-emerald-400" />
                      Commit Heatmap Wall (52-Week Contribution Index)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1.5 justify-between">
                        {data.contributionData.map((count, idx) => {
                          let bgColor = "bg-secondary/10 border-secondary/20 text-muted-foreground/30";
                          if (count > 0 && count <= 3) bgColor = "bg-emerald-950 border-emerald-900/40 text-emerald-500";
                          else if (count > 3 && count <= 6) bgColor = "bg-emerald-800 border-emerald-700/40 text-emerald-300";
                          else if (count > 6 && count <= 9) bgColor = "bg-emerald-600 border-emerald-500/40 text-emerald-100";
                          else if (count > 9) bgColor = "bg-emerald-400 border-emerald-300/40 text-white";

                          return (
                            <div
                              key={idx}
                              className={cn("h-6 w-6 shrink-0 rounded flex items-center justify-center text-[9px] font-bold border transition-all hover:scale-110", bgColor)}
                              title={`${count} commits in week ${idx + 1}`}
                            >
                              {count}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 border-t border-border/20 pt-2">
                        <span>Low commits</span>
                        <div className="flex gap-1 items-center">
                          <div className="w-3 h-3 rounded bg-secondary/10 border border-secondary/20" />
                          <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-900" />
                          <div className="w-3 h-3 rounded bg-emerald-800 border border-emerald-700" />
                          <div className="w-3 h-3 rounded bg-emerald-600 border border-emerald-500" />
                          <div className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300" />
                        </div>
                        <span>High commits</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Language breakdown */}
                <Card className="glass lg:col-span-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-400" />
                      <CardTitle className="text-base">Top Languages</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-left">
                    {data.languages.map((lang) => (
                      <div key={lang.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: lang.color }}
                            />
                            <span className="text-sm">{lang.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{lang.percent}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.percent}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: lang.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Top repos */}
                <Card className="glass lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <CardTitle className="text-base">Top Repositories</CardTitle>
                      <Badge variant="secondary">by stars</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-left">
                    {data.pinnedRepos.slice(0, 4).map((repo) => (
                      <div
                        key={repo.name}
                        onClick={() => setSelectedRepo({
                          ...repo,
                          contributors: ["octocat", "karthikrshet", "dependabot[bot]"],
                          issuesCount: 4,
                          pulls: [
                            { id: 1, title: "Build config cache support", status: "merged" },
                            { id: 2, title: "Add star prompts layout", status: "open" }
                          ]
                        })}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/40 border border-transparent hover:border-border/30 cursor-pointer transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate group-hover:underline">
                            {repo.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{repo.description || "No description"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {repo.language && (
                              <span className="text-[10px] text-muted-foreground">{repo.language}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3 text-indigo-400" /> {repo.forks}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              {data.recommendations.length > 0 && (
                <Card className="glass text-left">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-sky-400" />
                      <CardTitle className="text-base">Recommendations</CardTitle>
                      <Badge variant="info">{data.recommendations.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {data.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* AI Transition Roadmap */}
              {(data as any).aiRoadmap && (
                <Card className="glass text-left col-span-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-violet-400" />
                      <CardTitle className="text-base">AI Role Transition Roadmap</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {(data as any).aiRoadmap}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {!loading && !data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <GitBranch className="w-14 h-14 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Enter a GitBranch username above to run a live portfolio audit.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Repository Detail Modal */}
      <AnimatePresence>
        {selectedRepo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col text-left"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      {selectedRepo.name}
                      <Badge variant="secondary" className="text-[10px]">{selectedRepo.language}</Badge>
                    </h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-3">
                      <span>⭐ {selectedRepo.stars} stars</span>
                      <span>🍴 {selectedRepo.forks} forks</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedRepo(null)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[420px] text-xs leading-relaxed">
                {/* Clone Block */}
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-primary" /> Clone Repository
                  </h4>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-secondary/15 font-mono text-[10px]">
                    <span className="flex-1 truncate select-all">git clone https://github.com/{data?.username || "dev"}/{selectedRepo.name}.git</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`git clone https://github.com/${data?.username || "dev"}/${selectedRepo.name}.git`);
                        toast.success("Clone command copied");
                      }}
                      className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                      title="Copy clone command"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Contributors */}
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Contributors</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRepo.contributors.map((contrib: string) => (
                        <Badge key={contrib} variant="outline" className="text-[10px] tracking-normal font-normal">
                          @{contrib}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Issues & PRs summary */}
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Issues & Pull Requests</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-[10px]">{selectedRepo.issuesCount} Open Issues</Badge>
                      <Badge variant="default" className="text-[10px]">{selectedRepo.pulls.length} Pull Requests</Badge>
                    </div>
                  </div>
                </div>

                {/* PR list block */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Recent Pull Requests</h4>
                  <div className="space-y-1.5">
                    {selectedRepo.pulls.map((pr: any) => (
                      <div key={pr.id} className="flex justify-between items-center p-2 rounded border border-border/60 bg-secondary/5">
                        <span className="font-medium text-foreground">{pr.title}</span>
                        <Badge variant={pr.status === "merged" ? "success" : "warning"} className="text-[9px] scale-90">
                          {pr.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* README Markdown */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-primary" /> README.md
                  </h4>
                  <div className="p-4 rounded-xl border border-border/80 bg-card prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-li:my-0.5">
                    <ReactMarkdown>{getMockReadme(selectedRepo.name)}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/50 bg-secondary/20 flex gap-2 justify-end">
                <a href={selectedRepo.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-xs">
                    <ExternalLink className="w-3.5 h-3.5" /> View Pinned Project
                  </Button>
                </a>
                <Button size="sm" className="text-xs" onClick={() => setSelectedRepo(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
