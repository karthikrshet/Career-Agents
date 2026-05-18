"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2 as Linkedin, Sparkles, Copy, RefreshCw, Loader2,
  Calendar, MessageCircle, FileText, Send, Star,
  ChevronDown, CheckCircle, Zap
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type ContentType = "post" | "article" | "comment" | "message" | "referral" | "recruiter" | "weekly-plan";

const CONTENT_TYPES: { id: ContentType; label: string; icon: string; description: string }[] = [
  { id: "post", label: "LinkedIn Post", icon: "📢", description: "Thought leadership or achievement post" },
  { id: "article", label: "LinkedIn Article", icon: "📝", description: "Long-form technical or career article" },
  { id: "comment", label: "Engaging Comment", icon: "💬", description: "Smart comment to grow your network" },
  { id: "message", label: "Connection Request", icon: "🤝", description: "Personalized connection message" },
  { id: "referral", label: "Referral Request", icon: "🎯", description: "Ask for a referral professionally" },
  { id: "recruiter", label: "Recruiter Outreach", icon: "📨", description: "Reach out to a recruiter directly" },
  { id: "weekly-plan", label: "Weekly Content Plan", icon: "📅", description: "7-day LinkedIn content calendar" },
];

const TONES = ["Professional", "Conversational", "Bold", "Humble", "Technical", "Storytelling"];

export default function LinkedInAIPage() {
  const settings = useStore((s) => s.settings);
  const profile = useStore((s) => s.profile);
  const resumeAnalysis = useStore((s) => s.resumeAnalysis);

  const [contentType, setContentType] = useState<ContentType>("post");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<{ type: ContentType; topic: string; content: string; ts: string }[]>([]);

  async function generate() {
    if (!topic.trim()) { toast.error("Enter a topic or context first"); return; }
    setGenerating(true);
    setResult("");

    const targetRole = profile?.targetRole || "Software Engineer";
    const skills = resumeAnalysis?.detectedKeywords?.slice(0, 5).join(", ") || "TypeScript, React, Node.js";

    const prompts: Record<ContentType, string> = {
      "post": `Write a ${tone.toLowerCase()} LinkedIn post about: "${topic}". The author is a ${targetRole} with skills in ${skills}. Make it engaging, authentic, 150-250 words. Add 3-5 relevant hashtags at the end. No generic fluff.`,
      "article": `Write a compelling LinkedIn article outline and introduction (400 words) about: "${topic}". Target audience: software engineers. Tone: ${tone.toLowerCase()}. Include a hook, key insights, and a CTA.`,
      "comment": `Write a smart, ${tone.toLowerCase()} LinkedIn comment on a post about: "${topic}". The comment should add value, show expertise, and encourage engagement. Keep it under 60 words.`,
      "message": `Write a personalized LinkedIn connection request message. Context: "${topic}". Keep it under 280 characters, ${tone.toLowerCase()} tone. Do not use "I'd like to add you to my professional network."`,
      "referral": `Write a professional LinkedIn referral request message. Context: "${topic}". The sender is a ${targetRole}. Keep it under 150 words, ${tone.toLowerCase()} tone. Be specific and make it easy to say yes.`,
      "recruiter": `Write a LinkedIn recruiter outreach message. Context: "${topic}". The sender is a ${targetRole} with ${skills}. Keep it under 120 words, ${tone.toLowerCase()} tone. Include a clear ask.`,
      "weekly-plan": `Create a 7-day LinkedIn content calendar for a ${targetRole}. Theme: "${topic}". For each day provide: Day, Content Type (Post/Story/Article), Topic, and a 1-sentence outline. Format as a clean table.`,
    };

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompts[contentType] }],
          context: { profile },
          settings: { 
            aiProvider: settings.aiProvider, 
            demoMode: typeof window !== "undefined" ? localStorage.getItem("demo_mode_enabled") === "true" : false 
          },
        }),
      });

      if (!res.ok || !res.body) throw new Error("Generation failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line.slice(6));
            const delta = parsed?.choices?.[0]?.delta?.content || "";
            content += delta;
            setResult(content);
          } catch {}
        }
      }

      // Save to history
      setHistory(prev => [{ type: contentType, topic, content, ts: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
    } catch {
      toast.error("Generation failed — check your AI provider settings.");
    } finally {
      setGenerating(false);
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar
        title="LinkedIn AI"
        subtitle="Generate posts, articles, messages, and weekly content plans"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Controls Column */}
          <div className="space-y-5">
            {/* Content Type Picker */}
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Content Type</p>
                <div className="space-y-1.5">
                  {CONTENT_TYPES.map(ct => (
                    <button
                      key={ct.id}
                      onClick={() => setContentType(ct.id)}
                      className={cn(
                        "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-xs",
                        contentType === ct.id
                          ? "border-primary/50 bg-primary/8 text-foreground"
                          : "border-border/30 hover:border-border/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-base">{ct.icon}</span>
                      <div>
                        <p className={cn("font-semibold", contentType === ct.id && "text-primary")}>{ct.label}</p>
                        <p className="text-[10px] text-muted-foreground">{ct.description}</p>
                      </div>
                      {contentType === ct.id && <CheckCircle className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tone */}
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Writing Tone</p>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                        tone === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generator Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Input */}
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Topic / Context</p>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder={
                    contentType === "post" ? "e.g. I just shipped a feature that reduced API latency by 60%..." :
                    contentType === "weekly-plan" ? "e.g. Building in public as a senior engineer, sharing system design learnings..." :
                    contentType === "referral" ? "e.g. Applying for SWE role at Stripe, know someone on the payments team..." :
                    "Describe the context or topic for your LinkedIn content..."
                  }
                  rows={4}
                  className="w-full bg-secondary/20 border border-border/40 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none outline-none focus:border-primary/50 transition-colors"
                />
                <Button
                  onClick={generate}
                  disabled={generating || !topic.trim()}
                  className="w-full gap-2"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate {CONTENT_TYPES.find(c => c.id === contentType)?.label}</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            <AnimatePresence>
              {(result || generating) && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-sky-400" />
                          {CONTENT_TYPES.find(c => c.id === contentType)?.label}
                          {tone && <Badge variant="outline" className="text-[10px]">{tone}</Badge>}
                        </p>
                        {result && (
                          <div className="flex gap-2">
                            <button onClick={copyResult} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                            <button onClick={generate} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" /> Regenerate
                            </button>
                          </div>
                        )}
                      </div>

                      {generating && !result && (
                        <div className="flex items-center gap-2 py-4 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Writing your {CONTENT_TYPES.find(c => c.id === contentType)?.label.toLowerCase()}...</span>
                        </div>
                      )}

                      {result && (
                        <div className="bg-secondary/20 border border-border/30 rounded-xl p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                          {result}{generating && <span className="animate-pulse">▋</span>}
                        </div>
                      )}

                      {result && !generating && (
                        <div className="flex items-center gap-2 pt-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <p className="text-[10px] text-muted-foreground">Ready to post. Copy and paste directly into LinkedIn.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History */}
            {history.length > 0 && (
              <Card className="border-border/40">
                <CardContent className="p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent Generations</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-lg hover:bg-secondary/30 cursor-pointer group"
                        onClick={() => setResult(h.content)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{h.topic.slice(0, 60)}{h.topic.length > 60 ? "..." : ""}</p>
                          <p className="text-[10px] text-muted-foreground">{CONTENT_TYPES.find(c => c.id === h.type)?.label} · {h.ts}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(h.content); toast.success("Copied!"); }}
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
