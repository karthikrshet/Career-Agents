"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Plus, Loader2, User, Sparkles, AlertCircle,
  FileText, GitBranch, Mic, Settings, ChevronRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { buildCareerContext } from "@/lib/ai";
import { cn, timeAgo } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Analyze my resume", icon: FileText, prompt: "Review my resume scores and give me the 3 most important improvements I can make right now." },
  { label: "GitBranch audit tips", icon: GitBranch, prompt: "Based on my GitBranch profile data, what are the top things I should fix to get noticed by recruiters?" },
  { label: "Interview prep plan", icon: Mic, prompt: "Create a 2-week interview prep plan for a Senior Software Engineer role at a top tech company." },
  { label: "Career roadmap", icon: Sparkles, prompt: "Based on my current scores and target role, give me a prioritized 30-day career action plan." },
];

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", role === "user" ? "flex-row-reverse" : "flex-row")}
    >
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1",
        role === "assistant" ? "bg-gradient-to-br from-sky-500 to-indigo-600" : "bg-secondary border border-border"
      )}>
        {role === "assistant"
          ? <Bot className="w-3.5 h-3.5 text-white" />
          : <User className="w-3.5 h-3.5 text-muted-foreground" />
        }
      </div>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
        role === "assistant"
          ? "bg-card border border-border text-foreground prose prose-sm prose-invert max-w-none"
          : "bg-primary/10 border border-primary/20 text-foreground"
      )}>
        {role === "assistant" ? (
          <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-li:my-0">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function CopilotPage() {
  const settings = useStore((s) => s.settings);
  const profile = useStore((s) => s.profile);
  const metrics = useStore((s) => s.metrics);
  const currentSession = useStore((s) => s.currentCopilotSession);
  const copilotSessions = useStore((s) => s.copilotSessions);
  const startCopilotSession = useStore((s) => s.startCopilotSession);
  const appendCopilotMessage = useStore((s) => s.appendCopilotMessage);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!currentSession) startCopilotSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, streamBuffer]);

  const hasApiKey = !!settings.aiProvider.apiKey || ["ollama", "lmstudio"].includes(settings.aiProvider.provider);

  async function send(text: string) {
    if (!text.trim() || isStreaming) return;
    if (!hasApiKey) {
      toast.error("Add your AI API key in Settings to use Career Copilot.");
      return;
    }
    setInput("");
    appendCopilotMessage("user", text);
    setIsStreaming(true);
    setStreamBuffer("");

    try {
      abortRef.current = new AbortController();
      const systemContext = buildCareerContext(profile, metrics);

      const messages = [
        { role: "system" as const, content: systemContext },
        ...(currentSession?.messages.filter((m) => m.role !== "system").map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })) || []),
        { role: "user" as const, content: text },
      ];

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, config: settings.aiProvider }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content || "";
            full += delta;
            setStreamBuffer(full);
          } catch {}
        }
      }

      appendCopilotMessage("assistant", full);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        appendCopilotMessage("assistant", `Sorry, I encountered an error: ${e.message}. Please check your API key in Settings.`);
      }
    } finally {
      setIsStreaming(false);
      setStreamBuffer("");
    }
  }

  const messages = currentSession?.messages || [];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Session history sidebar */}
      <div className="w-56 shrink-0 border-r border-border p-3 space-y-2 overflow-y-auto">
        <Button size="sm" className="w-full" onClick={() => startCopilotSession()}>
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </Button>
        <div className="space-y-1">
          {copilotSessions.slice(0, 10).map((s) => (
            <div
              key={s.id}
              className={cn(
                "px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors",
                s.id === currentSession?.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <p className="font-medium truncate">{s.title}</p>
              <p className="opacity-60">{timeAgo(s.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Career Copilot"
          subtitle={`Powered by ${settings.aiProvider.provider} · ${settings.aiProvider.model}`}
        />

        {!hasApiKey && (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Add your AI provider API key in{" "}
              <a href="/settings" className="text-primary hover:underline">Settings</a>
              {" "}to activate Career Copilot.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role as "user" | "assistant"} content={msg.content} />
          ))}

          {/* Streaming bubble */}
          {isStreaming && streamBuffer && (
            <MessageBubble role="assistant" content={streamBuffer + "▋"} />
          )}
          {isStreaming && !streamBuffer && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Quick actions (only on first message) */}
          {messages.length <= 1 && !isStreaming && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => send(action.prompt)}
                  className="glass rounded-xl p-3 text-left hover:border-primary/30 transition-all group"
                >
                  <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mb-1.5 transition-colors" />
                  <p className="text-xs font-medium">{action.label}</p>
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Career Copilot anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              disabled={isStreaming}
              className="flex-1"
            />
            <Button
              onClick={() => isStreaming ? abortRef.current?.abort() : send(input)}
              disabled={!input.trim() && !isStreaming}
              variant={isStreaming ? "destructive" : "default"}
              size="icon"
            >
              {isStreaming
                ? <span className="w-3.5 h-3.5 rounded-sm bg-white" />
                : <Send className="w-4 h-4" />
              }
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            Copilot has access to your career scores and profile data.
          </p>
        </div>
      </div>
    </div>
  );
}


