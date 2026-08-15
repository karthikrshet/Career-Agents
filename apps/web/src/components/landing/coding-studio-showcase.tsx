"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Code2, Zap, Brain, Trophy, ArrowRight, Sparkles, Terminal, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CursorGrid from "@/components/react-bits/CursorGrid";

export function CodingStudioShowcase() {
  const [selectedLang, setSelectedLang] = useState("python");

  const codeSnippets: Record<string, { code: string; output: string }> = {
    python: {
      code: `def min_window_substring(s: str, t: str) -> str:
    # L6 Staff Engineer Solution: Two Pointers + Sliding Window
    from collections import Counter
    if not t or not s: return ""
    target_counts = Counter(t)
    required = len(target_counts)
    l, r, formed = 0, 0, 0
    window_counts = {}
    ans = float("inf"), None, None

    while r < len(s):
        char = s[r]
        window_counts[char] = window_counts.get(char, 0) + 1
        if char in target_counts and window_counts[char] == target_counts[char]:
            formed += 1
        while l <= r and formed == required:
            char = s[l]
            if r - l + 1 < ans[0]:
                ans = (r - l + 1, l, r)
            window_counts[char] -= 1
            if char in target_counts and window_counts[char] < target_counts[char]:
                formed -= 1
            l += 1
        r += 1
    return "" if ans[0] == float("inf") else s[ans[1] : ans[2] + 1]`,
      output: "✓ 268/268 Test Cases Passed | Runtime: 42ms (Beats 98.4%) | Memory: 17.2MB (Beats 94.1%)",
    },
    cpp: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>

// Optimized O(N) Sliding Window with Frequency Map
std::string minWindow(std::string s, std::string t) {
    if (s.empty() || t.empty()) return "";
    std::unordered_map<char, int> map;
    for (char c : t) map[c]++;
    int count = map.size(), start = 0, minLen = INT_MAX, head = 0;
    
    for (int end = 0; end < s.size(); end++) {
        if (map.count(s[end]) && --map[s[end]] == 0) count--;
        while (count == 0) {
            if (end - start + 1 < minLen) {
                minLen = end - start + 1;
                head = start;
            }
            if (map.count(s[start]) && map[s[start]]++ == 0) count++;
            start++;
        }
    }
    return minLen == INT_MAX ? "" : s.substr(head, minLen);
}`,
      output: "✓ 268/268 Test Cases Passed | Runtime: 4ms (Beats 99.8%) | Memory: 8.1MB",
    },
    typescript: {
      code: `function minWindow(s: string, t: string): string {
  const map = new Map<string, number>();
  for (const c of t) map.set(c, (map.get(c) || 0) + 1);
  let matched = 0, minLen = Infinity, start = 0, subStrStart = 0;

  for (let end = 0; end < s.length; end++) {
    const rightChar = s[end];
    if (map.has(rightChar)) {
      map.set(rightChar, map.get(rightChar)! - 1);
      if (map.get(rightChar) === 0) matched++;
    }

    while (matched === map.size) {
      if (end - start + 1 < minLen) {
        minLen = end - start + 1;
        subStrStart = start;
      }
      const leftChar = s[start++];
      if (map.has(leftChar)) {
        if (map.get(leftChar) === 0) matched--;
        map.set(leftChar, map.get(leftChar)! + 1);
      }
    }
  }
  return minLen === Infinity ? "" : s.substring(subStrStart, subStrStart + minLen);
}`,
      output: "✓ 268/268 Test Cases Passed | Runtime: 58ms (Beats 96.2%) | Memory: 48.3MB",
    },
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-[#030712] border-y border-white/10 font-sans z-10">
      {/* Interactive CursorGrid Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-auto">
        <CursorGrid
          cellSize={60}
          color="#38bdf8"
          radius={120}
          falloff="smooth"
          holdTime={300}
          fadeDuration={600}
          lineWidth={1}
          maxOpacity={0.6}
          fillOpacity={0.03}
          gridOpacity={0.04}
          clickPulse={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 font-mono text-xs font-medium">
            <Zap className="w-3.5 h-3.5" /> Enterprise Playground &amp; Judge
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Next-Gen <span className="text-sky-400">Coding Studio</span> Workspace
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Practice 240+ coding interview problems with 20-language execution, interactive algorithm visualizers, AI STAR interview coaching, and live virtual contests.
          </p>
        </div>

        {/* 4 Feature Highlights - Streamlined Modern Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#070b14]/90 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">20-Language Compiler</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Run C++, Java, Python, TS, Rust, Go, and Swift in sandboxes.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#070b14]/90 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Algorithm Visualizer</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Step-by-step animations for Two Pointers, Stacks, DP &amp; Trees.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#070b14]/90 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">STAR Mock Coach</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Hints, dry-run walkthroughs, and complexity breakdowns.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#070b14]/90 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Virtual Contests</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Master Blind 75, NeetCode 150, and timed FAANG tracks.
              </p>
            </div>
          </div>
        </div>

        {/* Live Interactive Code Preview Terminal */}
        <div className="rounded-2xl bg-[#070b14]/95 border border-white/10 overflow-hidden shadow-2xl">
          {/* Terminal Window Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" /> LeetCode #76 — Minimum Window Substring (Hard)
              </span>
            </div>

            {/* Language Selector Tabs */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
              {(["python", "cpp", "typescript"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedLang === lang
                      ? "bg-sky-500 text-black font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang === "cpp" ? "C++20" : lang === "typescript" ? "TypeScript" : "Python 3"}
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="p-4 sm:p-6 bg-black/70 overflow-x-auto">
            <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
              <code>{codeSnippets[selectedLang].code}</code>
            </pre>
          </div>

          {/* Test Verdict Output Bar */}
          <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{codeSnippets[selectedLang].output}</span>
            </div>
            <Link href="/playground">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs px-3.5 py-1.5 rounded-lg">
                <Play className="w-3 h-3 mr-1 fill-current" /> Run Live
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
