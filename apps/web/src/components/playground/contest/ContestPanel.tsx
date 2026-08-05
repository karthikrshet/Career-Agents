"use client";

import { useState, useEffect } from "react";
import { Trophy, Clock, Flame, Play, CheckCircle2, ChevronRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ContestPanel() {
  const [inContest, setInContest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5400); // 1h 30m in seconds
  const [solvedCount, setSolvedCount] = useState(2);

  useEffect(() => {
    let timer: any = null;
    if (inContest && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inContest, timeLeft]);

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="p-5 bg-card border border-border/60 rounded-2xl space-y-5">
      {/* Contest Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-foreground">Weekly Practice Contest #412</h3>
          </div>
          <p className="text-xs text-muted-foreground">4 Problems · 1 Hour 30 Minutes · Upsolve & Rating System</p>
        </div>

        {inContest ? (
          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <span className="text-[10px] text-muted-foreground uppercase block">Time Remaining</span>
              <span className="text-lg font-bold text-amber-400">{formatTime(timeLeft)}</span>
            </div>
            <Button size="sm" variant="destructive" onClick={() => setInContest(false)} className="h-8 text-xs font-bold">
              End Contest
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => { setInContest(true); setTimeLeft(5400); }} className="h-8 text-xs bg-amber-500 text-black hover:bg-amber-400 font-bold gap-1.5">
            <Play className="w-3.5 h-3.5" /> Start Virtual Contest
          </Button>
        )}
      </div>

      {/* Contest Problems List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contest Question Set</h4>
        <div className="space-y-2">
          {[
            { id: 1, title: "1. Two Sum", diff: "Easy", points: 300, solved: true },
            { id: 2, title: "2. Add Two Numbers", diff: "Medium", points: 500, solved: true },
            { id: 3, title: "3. Longest Substring Without Repeating", diff: "Medium", points: 600, solved: false },
            { id: 4, title: "4. Median of Two Sorted Arrays", diff: "Hard", points: 1000, solved: false },
          ].map((q) => (
            <div key={q.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-border/30 text-xs">
              <div className="flex items-center gap-3">
                {q.solved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="w-2 h-2 rounded-full bg-slate-600" />}
                <span className="font-semibold text-foreground">{q.title}</span>
                <Badge variant="outline" className="text-[10px]">{q.diff}</Badge>
              </div>
              <span className="font-mono text-amber-400 font-bold">{q.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Contest Leaderboard */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          <span>Virtual Leaderboard</span>
          <span className="text-[10px] font-mono text-emerald-400">Global Rank #42</span>
        </h4>
        <div className="space-y-1.5 font-mono text-xs">
          {[
            { rank: 1, name: "tourist", solved: "4/4", score: 2400, time: "28m 14s" },
            { rank: 2, name: "benq", solved: "4/4", score: 2400, time: "34m 10s" },
            { rank: 3, name: "neetcode", solved: "4/4", score: 2400, time: "42m 05s" },
            { rank: 42, name: "You (Candidate)", solved: `${solvedCount}/4`, score: 800, time: "18m 20s", isUser: true },
          ].map((row) => (
            <div
              key={row.rank}
              className={`flex items-center justify-between p-2.5 rounded-lg border ${
                row.isUser ? "bg-primary/20 border-primary/40 font-bold text-primary" : "bg-secondary/10 border-border/20 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-[11px] font-bold opacity-60">#{row.rank}</span>
                <span>{row.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-emerald-400">{row.solved}</span>
                <span className="text-slate-400">{row.time}</span>
                <span className="text-amber-400 font-bold">{row.score} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
