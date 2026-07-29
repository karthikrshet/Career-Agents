"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Square, Loader2, Copy, Download, RefreshCw,
  Code2, Zap, Brain, ChevronDown, CheckCircle, AlertCircle,
  BarChart3, Clock
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { cn } from "@/lib/utils";

// ─── Language config ─────────────────────────────────────────────────────────
const LANGUAGES = [
  { id: "javascript", label: "JavaScript", ext: ".js", monacoId: "javascript" },
  { id: "typescript", label: "TypeScript", ext: ".ts", monacoId: "typescript" },
  { id: "python", label: "Python", ext: ".py", monacoId: "python" },
  { id: "java", label: "Java", ext: ".java", monacoId: "java" },
  { id: "go", label: "Go", ext: ".go", monacoId: "go" },
  { id: "rust", label: "Rust", ext: ".rs", monacoId: "rust" },
  { id: "cpp", label: "C++", ext: ".cpp", monacoId: "cpp" },
];

const STARTER_CODE: Record<string, string> = {
  javascript: `// Two Sum — LeetCode #1
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));       // [1, 2]
`,
  typescript: `// Two Sum (TypeScript)
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
`,
  python: `# Binary Search
def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Test
print(binary_search([-1, 0, 3, 5, 9, 12], 9))  # 4
print(binary_search([-1, 0, 3, 5, 9, 12], 2))  # -1
`,
  java: `// Maximum Depth of Binary Tree
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
`,
  go: `// Reverse a Linked List
package main

import "fmt"

type ListNode struct {
    Val  int
    Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}

func main() {
    fmt.Println("Reverse linked list implemented")
}
`,
  rust: `// Fibonacci with memoization
use std::collections::HashMap;

fn fib(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {
    if n <= 1 { return n; }
    if let Some(&val) = memo.get(&n) { return val; }
    let result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.insert(n, result);
    result
}

fn main() {
    let mut memo = HashMap::new();
    println!("fib(10) = {}", fib(10, &mut memo)); // 55
    println!("fib(20) = {}", fib(20, &mut memo)); // 6765
}
`,
  cpp: `// Valid Parentheses
#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty()) return false;
            if (c == ')' && st.top() != '(') return false;
            if (c == ']' && st.top() != '[') return false;
            if (c == '}' && st.top() != '{') return false;
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    cout << isValid("()[]{}") << endl; // 1
    cout << isValid("([)]") << endl;   // 0
}
`,
};

interface AIReview {
  timeComplexity: string;
  spaceComplexity: string;
  correctness: string;
  suggestions: string[];
  optimizedCode?: string;
  score: number;
}

const PROBLEMS_TEST_CASES: Record<string, Array<{ args: any[]; expected: any; input: string; method: string }>> = {
  javascript: [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1], input: "nums = [2, 7, 11, 15], target = 9", method: "twoSum" },
    { args: [[3, 2, 4], 6], expected: [1, 2], input: "nums = [3, 2, 4], target = 6", method: "twoSum" }
  ],
  typescript: [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1], input: "nums = [2, 7, 11, 15], target = 9", method: "twoSum" }
  ],
  python: [
    { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", method: "binary_search" },
    { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", method: "binary_search" }
  ]
};

export default function PlaygroundPage() {
  const settings = useStore((s) => s.settings);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<AIReview | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // LeetCode-grade console tab state
  const [stdin, setStdin] = useState("");
  const [activeConsoleTab, setActiveConsoleTab] = useState<"output" | "stdin" | "tests">("output");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);
  const [testMethodName, setTestMethodName] = useState("twoSum");

  function selectLanguage(langId: string) {
    setLanguage(langId);
    setCode(STARTER_CODE[langId] || "");
    setOutput("");
    setReview(null);
    setShowLangPicker(false);
  }

  async function runCode() {
    setRunning(true);
    setActiveConsoleTab("output");
    setOutput("▶ Running code in secure compiler sandbox...\n");
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, stdin }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Execution failed");
      }

      const result = await res.json();
      if (result.success) {
        let executionOutput = "";
        if (result.stdout) {
          executionOutput += result.stdout;
        }
        if (result.stderr) {
          executionOutput += `\n[STDERR]\n${result.stderr}`;
        }
        if (!result.stdout && !result.stderr) {
          executionOutput += `✓ Process exited successfully with status code ${result.code} (no output)`;
        }
        
        // Add telemetry detail if present
        if (result.executionTime || result.memory) {
          executionOutput += `\n\n-------------------------\n`;
          if (result.executionTime) executionOutput += `Time: ${result.executionTime}\n`;
          if (result.memory) executionOutput += `Memory: ${result.memory}\n`;
        }
        
        setOutput(executionOutput.trim());
      } else {
        setOutput(`Error: ${result.error || result.stderr || "Code execution failed"}`);
      }
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  }

  async function runTests() {
    setTesting(true);
    setActiveConsoleTab("tests");
    setTestResults([]);
    try {
      // Find method from current code using simple regex search
      let detectedMethod = "twoSum";
      if (language === "python") {
        const match = code.match(/def\s+(\w+)\s*\(/);
        if (match) detectedMethod = match[1];
      } else {
        const match = code.match(/function\s+(\w+)\s*\(/);
        if (match) detectedMethod = match[1];
      }
      
      const activeTests = PROBLEMS_TEST_CASES[language] || [];
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          tests: activeTests.map(t => ({ ...t, method: detectedMethod }))
        }),
      });

      if (!res.ok) throw new Error("Testing execution request failed");
      const result = await res.json();
      if (result.success && result.testResults) {
        setTestResults(result.testResults);
      } else {
        toast.error(result.error || "Failed to execute tests");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to execute tests");
    } finally {
      setTesting(false);
    }
  }

  async function handleAIReview() {
    setReviewing(true);
    setReview(null);

    try {
      const prompt = `You are an expert software engineer and DSA interviewer. Analyze this ${LANGUAGES.find(l => l.id === language)?.label} code:

\`\`\`${language}
${code}
\`\`\`

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation outside JSON):
{
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "correctness": "Short 1-sentence verdict",
  "suggestions": ["tip 1", "tip 2", "tip 3"],
  "score": 85
}`;

      const activeProvider = useGatewayStore.getState().activeProvider;
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          context: {},
          config: {
            provider: activeProvider,
            model: useGatewayStore.getState().activeModel,
            apiKey: settings.keys?.[activeProvider]?.[0] || settings.aiProvider.apiKey,
            baseUrl: settings.baseUrls?.[activeProvider] || settings.aiProvider.baseUrl,
            temperature: useGatewayStore.getState().temperature,
            maxTokens: useGatewayStore.getState().maxTokens,
            streaming: true,
          },
          settings: { 
            ...settings,
            demoMode: useGatewayStore.getState().demoMode 
          },
        }),
      });

      if (!res.ok || !res.body) throw new Error("AI review failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line.slice(6));
            raw += parsed?.choices?.[0]?.delta?.content || "";
          } catch {}
        }
      }

      // Extract JSON from potential markdown wrapper
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid AI response format");
      const parsed: AIReview = JSON.parse(jsonMatch[0]);
      setReview(parsed);
    } catch (err: any) {
      toast.error("AI Review failed — check your provider settings.");
    } finally {
      setReviewing(false);
    }
  }

  function handleTabKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  }

  const currentLang = LANGUAGES.find(l => l.id === language)!;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar
        title="Coding Playground"
        subtitle={`${currentLang.label} · AI complexity analysis · Interview-ready sandbox`}
      />

      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Language Picker */}
            <div className="relative">
              <button
                onClick={() => setShowLangPicker(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/60 text-xs font-semibold hover:border-primary/50 transition-all"
              >
                <Code2 className="w-3.5 h-3.5 text-primary" />
                {currentLang.label}
                <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", showLangPicker && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showLangPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 mt-1 w-40 glass border border-border rounded-xl shadow-2xl z-50 py-1"
                  >
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => selectLanguage(lang.id)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-xs hover:bg-secondary/40 transition-colors flex items-center justify-between",
                          language === lang.id ? "text-foreground font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {lang.label}
                        {language === lang.id && <CheckCircle className="w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Badge variant="outline" className="text-[10px] text-muted-foreground">{currentLang.ext}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { setCode(STARTER_CODE[language] || ""); setOutput(""); setReview(null); }} className="h-8 gap-1.5 text-xs">
              <RefreshCw className="w-3 h-3" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(code); toast.success("Copied!"); }} className="h-8 gap-1.5 text-xs">
              <Copy className="w-3 h-3" /> Copy
            </Button>
            <Button
              size="sm"
              onClick={handleAIReview}
              disabled={reviewing}
              variant="outline"
              className="h-8 gap-1.5 text-xs border-primary/50 text-primary hover:bg-primary/10"
            >
              {reviewing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
              AI Review
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={runTests}
              disabled={testing || running}
              className="h-8 gap-1.5 text-xs border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Run Tests
            </Button>
            <Button
              size="sm"
              onClick={runCode}
              disabled={running || testing}
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/95"
            >
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Run Code
            </Button>
          </div>
        </div>

        {/* Editor + Output + Review */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
          {/* Code Editor */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-card/30">
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">editor</span>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleTabKey}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent text-sm font-mono text-foreground resize-none outline-none leading-relaxed"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
            />
          </div>

          {/* Output + AI Review */}
          <div className="flex flex-col gap-4 overflow-auto">
            {/* LeetCode Tabbed Console */}
            <div className="rounded-xl border border-border/60 bg-[#0d1117] overflow-hidden flex flex-col min-h-[220px]">
              {/* Tab Switcher Headers */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-card/30">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveConsoleTab("output")}
                    className={cn(
                      "text-[10px] uppercase tracking-widest font-mono font-bold pb-0.5 border-b-2 transition-all",
                      activeConsoleTab === "output" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Console Output
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab("stdin")}
                    className={cn(
                      "text-[10px] uppercase tracking-widest font-mono font-bold pb-0.5 border-b-2 transition-all",
                      activeConsoleTab === "stdin" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Custom Testcase (Stdin)
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab("tests")}
                    className={cn(
                      "text-[10px] uppercase tracking-widest font-mono font-bold pb-0.5 border-b-2 transition-all",
                      activeConsoleTab === "tests" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Test Cases Results ({testResults.length})
                  </button>
                </div>
                {output && activeConsoleTab === "output" && (
                  <button onClick={() => setOutput("")} className="text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
                )}
              </div>

              {/* Tab Contents */}
              <div className="p-4 flex-1 overflow-auto">
                {activeConsoleTab === "output" && (
                  <div>
                    {output ? (
                      <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
                    ) : (
                      <p className="text-xs text-muted-foreground/40 font-mono">Click Run Code to execute your program...</p>
                    )}
                  </div>
                )}

                {activeConsoleTab === "stdin" && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">Provide mock standard input stream (one line per prompt input read):</label>
                    <textarea
                      value={stdin}
                      onChange={e => setStdin(e.target.value)}
                      placeholder="e.g.&#10;input_line_1&#10;input_line_2"
                      className="w-full h-24 p-3 bg-secondary/30 rounded-lg border border-border/50 text-xs font-mono text-foreground focus:outline-none resize-none"
                    />
                  </div>
                )}

                {activeConsoleTab === "tests" && (
                  <div className="space-y-3">
                    {testing ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono py-4">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        Running method against problem test cases...
                      </div>
                    ) : testResults.length > 0 ? (
                      <div className="space-y-2">
                        {testResults.map((t, index) => (
                          <div key={index} className={cn("p-2.5 rounded-lg border text-xs", t.passed ? "bg-emerald-500/5 border-emerald-500/25" : "bg-red-500/5 border-red-500/25")}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold font-mono">Case #{index + 1}</span>
                              <Badge className={t.passed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                                {t.passed ? "Passed" : "Failed"}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono mt-1">Input: <span className="text-foreground">{t.input}</span></p>
                            <p className="text-[10px] text-muted-foreground font-mono">Expected: <span className="text-emerald-400">{JSON.stringify(t.expected)}</span></p>
                            {t.error ? (
                              <p className="text-[10px] text-red-400 font-mono">Error: {t.error}</p>
                            ) : (
                              <p className="text-[10px] text-muted-foreground font-mono">Actual: <span className={t.passed ? "text-emerald-400" : "text-red-400"}>{JSON.stringify(t.actual)}</span></p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground/40 font-mono">Click Run Tests to execute test case assertions against your method...</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI Review panel */}
            <AnimatePresence>
              {reviewing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-primary/20 bg-primary/5 p-6 flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Analyzing complexity and correctness...</p>
                </motion.div>
              )}

              {review && !reviewing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/60 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/30 bg-card/50 flex items-center justify-between">
                    <span className="text-xs font-semibold flex items-center gap-2">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      AI Code Review
                    </span>
                    <Badge variant="outline" className={cn("text-[10px]",
                      review.score >= 80 ? "border-emerald-500/30 text-emerald-400" :
                        review.score >= 60 ? "border-amber-500/30 text-amber-400" : "border-red-500/30 text-red-400"
                    )}>
                      Score: {review.score}/100
                    </Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Time Complexity
                        </p>
                        <p className="text-sm font-mono font-bold text-foreground">{review.timeComplexity}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" /> Space Complexity
                        </p>
                        <p className="text-sm font-mono font-bold text-foreground">{review.spaceComplexity}</p>
                      </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Correctness</p>
                      <p className="text-xs text-foreground">{review.correctness}</p>
                    </div>

                    {review.suggestions.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Optimization Tips</p>
                        {review.suggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                            <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
