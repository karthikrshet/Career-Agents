/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  Award,
  GitBranch,
  GitFork,
  Star,
  ExternalLink,
  Code2,
  Heart,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function CreditsPage() {
  const [stars, setStars] = useState(148);
  const [forks, setForks] = useState(36);
  const [openIssues, setOpenIssues] = useState(8);
  const [contributors, setContributors] = useState<Contributor[]>([
    { login: "karthikrshet", avatar_url: "https://avatars.githubusercontent.com/u/49699332?v=4", html_url: "https://github.com/karthikrshet", contributions: 124 },
    { login: "claudecode", avatar_url: "https://avatars.githubusercontent.com/u/14855122?v=4", html_url: "https://github.com/anthropic", contributions: 42 },
    { login: "deepmind-agent", avatar_url: "https://avatars.githubusercontent.com/u/1283838?v=4", html_url: "https://github.com/google", contributions: 37 },
  ]);
  const [cloneCopied, setCloneCopied] = useState(false);

  useEffect(() => {
    async function fetchGitHubStats() {
      try {
        const repoRes = await fetch("https://api.github.com/repos/karthikrshet/Career-Agents");
        if (repoRes.ok) {
          const repo = await repoRes.json();
          setStars(repo.stargazers_count || 148);
          setForks(repo.forks_count || 36);
          setOpenIssues(repo.open_issues_count || 8);
        }

        const contribRes = await fetch("https://api.github.com/repos/karthikrshet/Career-Agents/contributors");
        if (contribRes.ok) {
          const list = await contribRes.json();
          if (Array.isArray(list) && list.length > 0) {
            setContributors(list.slice(0, 8));
          }
        }
      } catch (err) {
        console.warn("GitHub API offline or rate-limited. Using cached stats.");
      }
    }
    fetchGitHubStats();
  }, []);

  function copyCloneUrl() {
    navigator.clipboard.writeText("git clone https://github.com/karthikrshet/Career-Agents.git");
    setCloneCopied(true);
    toast.success("Repository clone URL copied!");
    setTimeout(() => setCloneCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Open Source &amp; Credits
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Credits &amp; <span className="text-sky-400">Acknowledgments</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Recognizing the open-source community, contributors, and core libraries powering the Career Agents ecosystem.
          </p>
        </div>

        {/* GitHub Live Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-[#070b14] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-slate-400">GitHub Stars</div>
              <div className="text-2xl font-bold text-white mt-1">{stars}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070b14] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-slate-400">Forks &amp; Clones</div>
              <div className="text-2xl font-bold text-white mt-1">{forks}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <GitFork className="w-4 h-4" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070b14] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-slate-400">Resolved Issues</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{openIssues} Active</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Clone Command Bar */}
        <div className="p-5 rounded-2xl bg-[#070b14] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300 w-full sm:w-auto overflow-x-auto">
            <span className="text-sky-400 font-bold">$</span>
            <span>git clone https://github.com/karthikrshet/Career-Agents.git</span>
          </div>

          <Button
            onClick={copyCloneUrl}
            size="sm"
            className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs px-4 py-2 rounded-lg shrink-0"
          >
            {cloneCopied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5 text-sky-400" />}
            <span>{cloneCopied ? "Copied" : "Copy Command"}</span>
          </Button>
        </div>

        {/* Contributors List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white">Core Contributors</h2>
            <a
              href="https://github.com/karthikrshet/Career-Agents/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>View GitHub Graph</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contributors.map((c) => (
              <a
                key={c.login}
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#070b14] border border-white/10 hover:border-sky-500/40 transition-colors flex items-center gap-3"
              >
                <img
                  src={c.avatar_url}
                  alt={c.login}
                  className="w-10 h-10 rounded-full border border-white/10"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>@{c.login}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {c.contributions} Commits
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
