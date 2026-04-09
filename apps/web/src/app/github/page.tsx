"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Search, Star, GitFork, Users, BookOpen,
  Loader2, ExternalLink, AlertCircle, CheckCircle,
  TrendingUp, Code2, Award
} from "lucide-react";
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
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold">{data.name}</h2>
                      <p className="text-sm text-muted-foreground">@{data.username}</p>
                      {data.bio && <p className="text-sm mt-2 text-foreground/80">{data.bio}</p>}
                      <div className="flex flex-wrap gap-4 mt-3">
                        {[
                          { icon: Users, label: `${data.followers} followers` },
                          { icon: BookOpen, label: `${data.publicRepos} repos` },
                          { icon: Star, label: `${data.totalStars} stars` },
                          { icon: GitFork, label: `${data.totalForks} forks` },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <s.icon className="w-3.5 h-3.5" />
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
                    <a href={`https://GitBranch.com/${data.username}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View on GitBranch
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Language breakdown */}
                <Card className="glass lg:col-span-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-400" />
                      <CardTitle className="text-base">Top Languages</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                  <CardContent className="space-y-3">
                    {data.pinnedRepos.slice(0, 4).map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/40 transition-colors group"
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
                            <Star className="w-3 h-3" /> {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" /> {repo.forks}
                          </span>
                        </div>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              {data.recommendations.length > 0 && (
                <Card className="glass">
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
    </div>
  );
}


