/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Search, Star, GitFork, Users, BookOpen,
  Loader2, ExternalLink, AlertCircle, CheckCircle,
  TrendingUp, Code2, Award, X, Shield, Info, Terminal, Copy,
  GitPullRequest, FileText
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
import { analyzeGitHubProfile, fetchRepoDetails } from "@/lib/github-api";
import { cn, scoreToColor, scoreToGrade, scoreToBgColor } from "@/lib/utils";
import type { GitHubRepo, GitHubRepoDetails } from "@/types";

export default function GitHubPage() {
  const GitHubAnalysis = useStore((s) => s.GitHubAnalysis);
  const setGitHubAnalysis = useStore((s) => s.setGitHubAnalysis);
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);

  const [username, setUsername] = useState(profile?.githubUsername || "");
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [repoDetails, setRepoDetails] = useState<GitHubRepoDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  async function handleAnalyze() {
    const u = username.trim().replace(/^@/, "");
    if (!u) { toast.error("Enter a GitBranch username"); return; }
    setLoading(true);
    try {
      const data = await analyzeGitHubProfile(u, settings.githubToken);
      setGitHubAnalysis(data);
      toast.success(`@${u} analyzed — ${data.portfolioScore}% portfolio score`);
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch GitBranch profile. Check the username.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectRepo(repo: GitHubRepo) {
    setSelectedRepo(repo);
    setRepoDetails(null);
    setLoadingDetails(true);
    try {
      const details = await fetchRepoDetails(
        data?.username || username.trim().replace(/^@/, ""),
        repo.name,
        settings.githubToken
      );
      setRepoDetails({
        ...details,
        defaultBranch: repo.defaultBranch || "main",
      });
    } catch (err) {
      console.error("Failed to load repo details", err);
    } finally {
      setLoadingDetails(false);
    }
  }

  const data = GitHubAnalysis;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Topbar title="GitHub Analyzer" subtitle="Live portfolio health audit from the GitHub API" />

      <div className="flex-1 p-6 space-y-6">
        {/* Search bar */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Enter GitHub username (e.g. torvalds)"
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={data.avatarUrl}
                        alt={data.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-border shrink-0"
                      />
                      <div className="sm:hidden min-w-0">
                        <h2 className="text-base font-bold truncate">{data.name}</h2>
                        <p className="text-xs text-muted-foreground truncate">@{data.username}</p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="hidden sm:block">
                        <h2 className="text-lg font-bold">{data.name}</h2>
                        <p className="text-sm text-muted-foreground">@{data.username}</p>
                      </div>
                      {data.bio && <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-foreground/80 leading-relaxed">{data.bio}</p>}
                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
                        {[
                          { icon: Users, label: `${data.followers || 0} followers` },
                          { icon: Users, label: `${data.following || 0} following` },
                          { icon: BookOpen, label: `${data.publicRepos || 0} repos` },
                          { icon: Star, label: `${data.totalStars || 0} stars` },
                          { icon: GitFork, label: `${data.totalForks || 0} forks` },
                        ].map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <s.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score & Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className={cn("rounded-xl p-3.5 sm:p-5 text-center border min-w-[100px]", scoreToBgColor(data.portfolioScore))}>
                        <div className="text-2xl sm:text-3xl font-bold tabular-nums">{data.portfolioScore}</div>
                        <div className="text-xs mt-0.5 font-medium">{scoreToGrade(data.portfolioScore)}</div>
                        <div className="text-[10px] opacity-70">Portfolio Score</div>
                      </div>
                      <a href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <ExternalLink className="w-3.5 h-3.5" />
                          View on GitHub
                        </Button>
                      </a>
                    </div>
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
                        onClick={() => handleSelectRepo(repo)}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col text-left max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-border/50 flex justify-between items-start bg-secondary/10">
                <div className="flex gap-3.5 items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-foreground">
                        {selectedRepo.name}
                      </h2>
                      {selectedRepo.language && (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 border border-border/50">
                          {selectedRepo.language}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> {selectedRepo.stars} stars
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-indigo-400" /> {selectedRepo.forks} forks
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRepo(null)}
                  className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs leading-relaxed custom-scrollbar">
                {/* Clone Block */}
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-primary" /> Clone Repository
                  </h4>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-secondary/20 font-mono text-[11px]">
                    <span className="flex-1 truncate select-all text-foreground/90">
                      git clone https://github.com/{data?.username || username.trim().replace(/^@/, "") || "user"}/{selectedRepo.name}.git
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `git clone https://github.com/${data?.username || username.trim().replace(/^@/, "") || "user"}/${selectedRepo.name}.git`
                        );
                        toast.success("Clone command copied");
                      }}
                      title="Copy clone command"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {loadingDetails ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-xs">Fetching repository details & README...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Contributors */}
                      <div className="space-y-1.5 p-3.5 rounded-xl border border-border/50 bg-secondary/10">
                        <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-400" /> Contributors
                        </h4>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {repoDetails && repoDetails.contributors.length > 0 ? (
                            repoDetails.contributors.map((contrib: string) => (
                              <a
                                key={contrib}
                                href={`https://github.com/${contrib}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex"
                              >
                                <Badge variant="outline" className="text-[10px] hover:bg-secondary/60 hover:text-foreground transition-colors cursor-pointer">
                                  @{contrib}
                                </Badge>
                              </a>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-[11px]">No external contributors listed</span>
                          )}
                        </div>
                      </div>

                      {/* Issues & PRs summary */}
                      <div className="space-y-1.5 p-3.5 rounded-xl border border-border/50 bg-secondary/10">
                        <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" /> Issues & Pull Requests
                        </h4>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/20">
                            {repoDetails ? repoDetails.openIssuesCount : (selectedRepo.openIssuesCount ?? 0)} Open Issues
                          </Badge>
                          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                            {repoDetails ? repoDetails.pulls.length : 0} Recent PRs
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* PR list block */}
                    {repoDetails && repoDetails.pulls.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <GitPullRequest className="w-3.5 h-3.5 text-primary" /> Recent Pull Requests
                        </h4>
                        <div className="space-y-1.5">
                          {repoDetails.pulls.map((pr) => (
                            <a
                              key={pr.id}
                              href={pr.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex justify-between items-center p-2.5 rounded-xl border border-border/50 bg-secondary/15 hover:bg-secondary/30 transition-colors group"
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <span className="text-[10px] font-mono text-muted-foreground">#{pr.id}</span>
                                <span className="font-medium text-foreground text-xs truncate group-hover:text-primary transition-colors">
                                  {pr.title}
                                </span>
                              </div>
                              <Badge
                                variant={pr.status === "merged" ? "success" : pr.status === "open" ? "default" : "secondary"}
                                className="text-[9px] capitalize shrink-0"
                              >
                                {pr.status}
                              </Badge>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* README Markdown */}
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-primary" /> README.md
                        </h4>
                        {repoDetails?.readmeContent && (
                          <span className="text-[10px] text-muted-foreground">Live from repository</span>
                        )}
                      </div>
                      
                      <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur text-foreground overflow-x-auto text-xs leading-relaxed">
                        {repoDetails?.readmeContent ? (
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-sm font-bold text-white pb-1.5 mb-2 mt-3 border-b border-border/40 flex items-center gap-1.5">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-xs font-semibold text-white/95 mb-1.5 mt-3 flex items-center gap-1">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-[11px] font-medium text-white/90 mb-1 mt-2">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="text-[11px] text-slate-300 my-1.5 leading-relaxed font-normal">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside space-y-0.5 my-1.5 text-[11px] text-slate-300">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside space-y-0.5 my-1.5 text-[11px] text-slate-300">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-[11px] text-slate-300 leading-relaxed font-normal">
                                  {children}
                                </li>
                              ),
                              code: ({ inline, className, children, ...props }: any) => {
                                if (inline) {
                                  return (
                                    <code className="px-1.5 py-0.5 rounded bg-secondary/60 text-[10px] font-mono text-sky-300 border border-border/50" {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <pre className="p-3 rounded-lg bg-secondary/35 border border-border/60 text-[10px] font-mono overflow-x-auto my-2 text-slate-200">
                                    <code {...props}>{children}</code>
                                  </pre>
                                );
                              },
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors"
                                >
                                  {children}
                                </a>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-primary/50 pl-3 italic my-2 text-slate-300 text-[11px]">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {repoDetails.readmeContent}
                          </ReactMarkdown>
                        ) : (
                          <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                            <Info className="w-5 h-5 opacity-40" />
                            <p className="text-xs">No README file found in the root of this repository.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/50 bg-secondary/20 flex gap-2 justify-end items-center">
                <a href={selectedRepo.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-xs gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> View on GitHub
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
