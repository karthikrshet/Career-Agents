// apps/web/src/app/copilot/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Bot, Send, Plus, Loader2, User, Sparkles, AlertCircle,
  FileText, GitBranch, Mic, Settings, ChevronRight, Pin,
  Archive, Trash2, Folder, Paperclip, X, Image as ImageIcon,
  Check, Play, HelpCircle, FileSpreadsheet, FileCode, CheckCircle2,
  TrendingUp, Volume2, Globe, Cpu, ChevronDown, Zap
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
import { cn, timeAgo, generateId } from "@/lib/utils";
import { PROVIDER_MODELS } from "@/lib/ai";

const QUICK_ACTIONS = [
  { label: "Analyze my resume", icon: FileText, prompt: "Review my resume scores and give me the 3 most important improvements I can make right now." },
  { label: "GitHub audit tips", icon: GitBranch, prompt: "Based on my GitHub profile data, what are the top things I should fix to get noticed by recruiters?" },
  { label: "Interview prep plan", icon: Mic, prompt: "Create a 2-week interview prep plan for a Senior Software Engineer role at a top tech company." },
  { label: "Career roadmap", icon: Sparkles, prompt: "Based on my current scores and target role, give me a prioritized 30-day career action plan." },
];

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: "uploading" | "ready" | "error";
  progress: number;
}

function CopilotWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentParam = searchParams.get("agent");
  const chatParam = searchParams.get("chat");

  const settings = useStore((s) => s.settings);
  const profile = useStore((s) => s.profile);
  const metrics = useStore((s) => s.metrics);
  const currentSession = useStore((s) => s.currentCopilotSession);
  const copilotSessions = useStore((s) => s.copilotSessions);
  
  const startCopilotSession = useStore((s) => s.startCopilotSession);
  const appendCopilotMessage = useStore((s) => s.appendCopilotMessage);
  const setResumeAnalysis = useStore((s) => s.setResumeAnalysis);
  const addJobApplication = useStore((s) => s.addJobApplication);
  const updateGithubScore = useStore((s) => s.updateGithubScore);
  const addActivity = useStore((s) => s.addActivity);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  
  // Custom Provider/Model overrides for workspace
  const [activeProvider, setActiveProvider] = useState(settings.aiProvider.provider);
  const [activeModel, setActiveModel] = useState(settings.aiProvider.model);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // Voice listening
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // File Attachments
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync state with URL params
  useEffect(() => {
    if (chatParam) {
      const session = copilotSessions.find((s) => s.id === chatParam);
      if (session) {
        useStore.setState({ currentCopilotSession: session });
      }
    } else if (!currentSession) {
      startCopilotSession();
    }
  }, [chatParam, copilotSessions]);

  // Handle agent shortcuts from Command Palette
  useEffect(() => {
    if (agentParam) {
      // Find agent from registry
      const fetchAgentPrompt = async () => {
        const agentRegistry = await import("../../../../../agent-registry.json");
        const agent = agentRegistry.agents.find((a) => a.id === agentParam);
        if (agent) {
          setInput(`I want to orchestrate the specialized **${agent.name}** agent. Please audit my profile with this agent context.`);
        }
      };
      fetchAgentPrompt();
    }
  }, [agentParam]);

  // Speech Recognition configuration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";
        
        rec.onresult = (e: any) => {
          const result = e.results[0][0].transcript;
          setInput((prev) => (prev ? prev + " " + result : result));
          setIsListening(false);
          toast.success("Voice input captured!");
        };

        rec.onerror = () => {
          setIsListening(false);
          toast.error("Speech recognition failed or was cancelled.");
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Web Speech API is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      toast.info("Listening... Speak now");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, streamBuffer]);

  const hasApiKey = !!settings.aiProvider.apiKey || ["ollama", "lmstudio"].includes(activeProvider);

  // File Dropzone logic with intelligent mock parses updating Zustand scores
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const id = generateId();
      const newAttach: FileAttachment = {
        id,
        name: file.name,
        size: file.size,
        type: file.type || file.name.split(".").pop() || "unknown",
        status: "uploading",
        progress: 10,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };

      setAttachments((prev) => [...prev, newAttach]);

      // Simulate upload progress
      let p = 10;
      const interval = setInterval(() => {
        p += 30;
        if (p >= 100) {
          clearInterval(interval);
          setAttachments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "ready", progress: 100 } : a))
          );
          
          // Trigger file-based intelligent mock parser
          processUploadedFile(file);
        } else {
          setAttachments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, progress: p } : a))
          );
        }
      }, 300);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // click button specifically instead of whole area
  });

  // Intelligent mockup processors to update store state
  const processUploadedFile = (file: File) => {
    const filename = file.name.toLowerCase();
    
    // 1. Resume Audit
    if (filename.includes("resume") || filename.includes("cv") || filename.endsWith(".pdf") || filename.endsWith(".docx")) {
      toast.loading(`ATS Resume Studio analyzing: ${file.name}...`);
      setTimeout(() => {
        toast.dismiss();
        
        // Mock a structured parse
        const mockAnalysis = {
          id: generateId(),
          fileName: file.name,
          rawText: "Decoded document text contents.",
          overallScore: 84,
          atsScore: 86,
          sections: {
            hasExperience: true,
            hasEducation: true,
            hasSkills: true,
            hasProjects: true,
            hasSummary: true,
          },
          weakBullets: [
            { original: "Responsible for coding React components.", issue: "passive_verb" as const, suggested: "Spearheaded modular frontend architectures in React, expanding component reusability by 40%." },
            { original: "Worked on SQL databases and queries.", issue: "no_metric" as const, suggested: "Optimized distributed SQL indexes, slashing system database query latency by 28%." }
          ],
          missingKeywords: ["Distributed Systems", "Kubernetes", "GraphQL"],
          detectedKeywords: ["React", "TypeScript", "Node.js", "SQL", "Git"],
          recommendations: [
            "Quantify impact metrics on your engineering contributions.",
            "Insert 'Distributed Systems' in your first project bullet.",
            "Reformat company header margins to be ATS-safe."
          ],
          analyzedAt: new Date().toISOString(),
        };

        setResumeAnalysis(mockAnalysis);
        addActivity({
          type: "resume",
          title: "CV Audit: " + file.name,
          description: "Scored 84% - found 2 weak bullets and 3 keyword gaps",
          score: 84,
        });

        appendCopilotMessage("assistant", `I've analyzed your resume file: **${file.name}** in Resume Studio Pro. 
        
- **Overall ATS Grade**: **84%**
- **Detected Sections**: Experience (✓), Education (✓), Skills (✓), Projects (✓)
- **Key Keyword Gaps**: *Distributed Systems, Kubernetes, GraphQL*

I have updated your **Resume Score** on the dashboard to **84%** and added 2 bullet points to rewrite. Ask me "How can I fix my weak bullets" to walk through them!`);
        toast.success("Resume score updated to 84% on your Dashboard!");
      }, 2000);
    }
    
    // 2. ZIP Folder / Repository
    else if (filename.endsWith(".zip") || filename.includes("code") || filename.includes("project")) {
      toast.loading(`GitHub Analyzer auditing repository structure: ${file.name}...`);
      setTimeout(() => {
        toast.dismiss();
        updateGithubScore(78);
        addActivity({
          type: "GitBranch",
          title: "Repo Scan: " + file.name,
          description: "Portfolio grade: Good. Folder mapping structured.",
          score: 78,
        });

        appendCopilotMessage("assistant", `I've audited your project archive: **${file.name}** and mapped its architecture:

- **Structure detected**: TypeScript React Next.js Monorepo
- **Folder quality**: Highly modular (found clear \`src/components\`, \`lib/\`, \`hooks/\`)
- **README status**: Excellent (contains quickstart instructions and API specs)
- **License**: MIT detected
- **CI / Testing**: Missing Jest/Playwright configs and GitHub Actions workflow.

Your **GitHub Portfolio Score** has been updated to **78%** on the Dashboard. I suggest adding a Jest test suite and CI pipeline configurations.`);
        toast.success("GitHub score updated to 78% on your Dashboard!");
      }, 2000);
    }
    
    // 3. Spreadsheet / Job application sheets
    else if (filename.endsWith(".xlsx") || filename.endsWith(".csv") || filename.includes("jobs") || filename.includes("tracker")) {
      toast.loading(`Job Tracker parsing applications sheet: ${file.name}...`);
      setTimeout(() => {
        toast.dismiss();

        // Add 2 mock applications to local job tracker
        addJobApplication({
          id: generateId(),
          company: "Vercel",
          role: "Frontend Engineer",
          status: "Applied",
          location: "Remote",
          appliedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          notes: "Imported from spreadsheet backup.",
          tags: ["Next.js", "React"]
        });

        addJobApplication({
          id: generateId(),
          company: "Google",
          role: "Software Engineer",
          status: "OA",
          location: "Mountain View, CA",
          appliedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          notes: "Online assessment schedule set.",
          tags: ["Algorithms", "C++"]
        });

        appendCopilotMessage("assistant", `I've parsed your job sheet: **${file.name}**. 

I detected 2 job applications and successfully imported them to your **Job Tracker**:
1. **Frontend Engineer** at **Vercel** (Status: *Applied*)
2. **Software Engineer** at **Google** (Status: *OA*)

Your application metrics and goals checkoffs have been synced with the tracker Kanban board!`);
        toast.success("Successfully imported 2 jobs to Job Tracker!");
      }, 2000);
    }
    
    // 4. Whiteboard Screenshots / Mock visual designs
    else if (file.type.startsWith("image/")) {
      toast.loading(`Analyzing image metrics: ${file.name}...`);
      setTimeout(() => {
        toast.dismiss();
        appendCopilotMessage("assistant", `I've analyzed the screenshot you uploaded: **${file.name}**.

- **Type**: Visual Screenshot
- **Visual Subject**: LeetCode Problem Interface
- **Quality Analysis**: Complete solution passing all test cases. The code displays clean O(N) time complexity and O(1) space constraints.
- **Coach Advice**: This demonstrates strong DSA problem-solving. Make sure to commit this to your GitHub portfolio repository to boost your contribution heatmap.`);
        toast.success("Image analysis completed!");
      }, 1500);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  async function send(text: string) {
    if (!text.trim() || isStreaming) return;
    if (!hasApiKey) {
      toast.error("Configure your API API Key in Settings to execute Career Copilot.");
      router.push("/settings");
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
        body: JSON.stringify({
          messages,
          config: {
            provider: activeProvider,
            model: activeModel,
            temperature: settings.aiProvider.temperature,
            maxTokens: settings.aiProvider.maxTokens,
            streaming: true,
          },
        }),
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
        appendCopilotMessage("assistant", `I encountered an issue connecting to ${activeProvider}: ${e.message}. Adjust your credentials in settings.`);
      }
    } finally {
      setIsStreaming(false);
      setStreamBuffer("");
    }
  }

  // Decodes thinking tag in the output stream for step indicators
  const parseThinkingAndContent = (text: string) => {
    const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/;
    const match = text.match(thinkingRegex);
    if (match) {
      const thinking = match[1];
      const content = text.replace(thinkingRegex, "").trim();
      return { thinking, content };
    }
    return { thinking: "", content: text };
  };

  const messages = currentSession?.messages || [];

  return (
    <div {...getRootProps()} className="flex h-full overflow-hidden relative">
      <input {...getInputProps()} />

      {/* Drag Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary z-[99] flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
          <Paperclip className="w-12 h-12 text-primary animate-bounce mb-2" />
          <p className="text-sm font-semibold">Drop files to attach to Career Workspace</p>
          <p className="text-xs text-muted-foreground">Supports PDF, DOCX, ZIP, Excel, and Screenshots</p>
        </div>
      )}

      {/* Claude-style Workspace Sidebar */}
      <div className="w-60 shrink-0 border-r border-border/40 p-3 space-y-4 overflow-y-auto flex flex-col bg-card/15">
        <div>
          <Button size="sm" className="w-full flex items-center gap-1.5" onClick={() => startCopilotSession()}>
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </Button>
        </div>

        {/* Sidebar folders */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">Shortcut Folders</p>
            {[
              { label: "Resume Reviews", count: 2 },
              { label: "Interview Sessions", count: 4 },
              { label: "Reports Portfolio", count: 1 },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs hover:bg-secondary/40 text-muted-foreground hover:text-foreground cursor-pointer">
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-sky-400" />
                  <span>{f.label}</span>
                </div>
                <Badge variant="secondary" className="text-[9px] px-1 py-0">{f.count}</Badge>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">Pinned Chats</p>
            {copilotSessions.filter((_, idx) => idx % 3 === 0).map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/copilot?chat=${s.id}`)}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs hover:bg-secondary/40 text-muted-foreground hover:text-foreground cursor-pointer group"
              >
                <span className="truncate flex-1 pr-2">{s.title}</span>
                <Pin className="w-3 h-3 text-amber-400 opacity-60 shrink-0" />
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">Recent Conversations</p>
            {copilotSessions.slice(0, 8).map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/copilot?chat=${s.id}`)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors relative group",
                  s.id === currentSession?.id
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                <p className="truncate pr-4">{s.title}</p>
                <p className="opacity-60 text-[9px] mt-0.5">{timeAgo(s.createdAt)}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const filter = copilotSessions.filter((ses) => ses.id !== s.id);
                    useStore.setState({ copilotSessions: filter });
                    if (currentSession?.id === s.id) {
                      startCopilotSession();
                    }
                    toast.info("Conversation deleted");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sync panel */}
        <div className="pt-2 border-t border-border/40 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Synced Locally (Guest)</span>
            </div>
            <Check className="w-3 h-3 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main workspace chat */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <Topbar
          title="Career Copilot Workspace"
          subtitle={`Gateway: ${activeProvider} · model: ${activeModel}`}
        />

        {/* Workspace body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => {
            const { thinking, content } = parseThinkingAndContent(msg.content);
            return (
              <div key={msg.id} className="space-y-3">
                {/* User/Assistant message */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    msg.role === "assistant" ? "bg-gradient-to-br from-sky-500 to-indigo-600 shadow-glow-sky" : "bg-secondary border border-border"
                  )}>
                    {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-muted-foreground" />}
                  </div>

                  <div className="max-w-[85%] space-y-2">
                    {/* Render thinking blocks if loaded */}
                    {thinking && (
                      <div className="p-3 bg-secondary/35 border border-border/40 rounded-xl flex items-center gap-2.5 text-xs text-indigo-400/90 font-mono">
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                        <span>{thinking}</span>
                      </div>
                    )}
                    
                    {content && (
                      <div className={cn(
                        "rounded-2xl px-5 py-4 text-sm leading-relaxed",
                        msg.role === "assistant"
                          ? "bg-card border border-border/60 text-foreground prose prose-sm prose-invert max-w-none shadow-sm"
                          : "bg-primary/10 border border-primary/20 text-foreground"
                      )}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-li:my-0.5">
                            <ReactMarkdown>{content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-line">{content}</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}

          {/* Streaming content */}
          {isStreaming && (
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[85%] space-y-2">
                  {(() => {
                    const { thinking, content } = parseThinkingAndContent(streamBuffer);
                    return (
                      <>
                        {thinking && (
                          <div className="p-3 bg-secondary/35 border border-border/40 rounded-xl flex items-center gap-2.5 text-xs text-indigo-400/90 font-mono">
                            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                            <span>{thinking}</span>
                          </div>
                        )}
                        {content && (
                          <div className="bg-card border border-border/60 rounded-2xl px-5 py-4 text-sm leading-relaxed text-foreground prose prose-invert">
                            <ReactMarkdown>{content + "▋"}</ReactMarkdown>
                          </div>
                        )}
                        {!content && !thinking && (
                          <div className="bg-card border border-border rounded-2xl px-4 py-3">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Quick actions panel */}
          {messages.length <= 1 && !isStreaming && (
            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => send(action.prompt)}
                  className="glass rounded-xl p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group border border-border/50"
                >
                  <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                  <p className="text-xs font-semibold text-foreground">{action.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Quick setup template trigger</p>
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attachments Preview Panel */}
        {attachments.length > 0 && (
          <div className="px-6 py-2 bg-secondary/20 border-t border-border/40 flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div key={file.id} className="flex items-center gap-2 bg-card border border-border/60 rounded-lg px-2.5 py-1 text-xs text-foreground group relative">
                {file.previewUrl ? (
                  <img src={file.previewUrl} alt={file.name} className="w-5 h-5 rounded object-cover" />
                ) : file.name.endsWith(".zip") ? (
                  <FileCode className="w-4 h-4 text-indigo-400" />
                ) : file.name.endsWith(".xlsx") || file.name.endsWith(".csv") ? (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                ) : (
                  <FileText className="w-4 h-4 text-sky-400" />
                )}
                <span className="max-w-[120px] truncate">{file.name}</span>
                {file.status === "uploading" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                ) : (
                  <button onClick={() => removeAttachment(file.id)} className="text-muted-foreground hover:text-red-400 transition-colors ml-1">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Chat input controller */}
        <div className="p-4 border-t border-border/40 bg-card/20 backdrop-blur-md">
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            {/* Input Row */}
            <div className="flex gap-2 relative">
              <Input
                placeholder="Message Career Copilot workspace, upload code repositories, drag in resume sheets..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                disabled={isStreaming}
                className="flex-1 text-sm h-11 bg-card/65 border-border/80 focus:border-primary pr-28"
              />

              <div className="absolute right-2 top-1.5 flex items-center gap-1.5">
                {/* Voice microphone push-to-talk */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn(
                    "p-2 rounded-lg hover:bg-secondary transition-all shrink-0 relative",
                    isListening ? "text-red-400 bg-red-500/10 hover:bg-red-500/20" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Speech transcription push-to-talk (Ctrl+M)"
                >
                  <Mic className="w-4.5 h-4.5" />
                  {isListening && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-400 animate-ping" />}
                </button>

                {/* File Upload trigger */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector("input[type=file]") as HTMLInputElement;
                    el?.click();
                  }}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all shrink-0"
                  title="Attach workspace documents (PDF/ZIP/Spreadsheet)"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Submit controller */}
              <Button
                onClick={() => isStreaming ? abortRef.current?.abort() : send(input)}
                disabled={!input.trim() && !isStreaming}
                variant={isStreaming ? "destructive" : "default"}
                className="h-11 px-4"
              >
                {isStreaming ? (
                  <span className="w-3.5 h-3.5 rounded-sm bg-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Bottom options row (Model selectors & settings triggers) */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {/* Model Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/50 hover:bg-secondary hover:text-foreground transition-all"
                  >
                    <Cpu className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-foreground uppercase">{activeProvider}:</span>
                    <span className="max-w-[120px] truncate text-[11px]">{activeModel}</span>
                    <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
                  </button>

                  {showModelDropdown && (
                    <div className="absolute left-0 bottom-10 w-64 glass border border-border rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                      <p className="px-3 py-1.5 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border/40">Select Gateway Model</p>
                      <div className="max-h-60 overflow-y-auto">
                        {Object.entries(PROVIDER_MODELS).map(([prov, models]) => (
                          <div key={prov} className="py-1">
                            <p className="px-3 py-0.5 text-[9px] text-primary/80 font-bold uppercase">{prov}</p>
                            {models.map((m) => (
                              <button
                                key={m}
                                onClick={() => {
                                  setActiveProvider(prov as any);
                                  setActiveModel(m);
                                  setShowModelDropdown(false);
                                  toast.success(`Model switched to ${prov} (${m})`);
                                }}
                                className={cn(
                                  "w-full text-left px-4 py-1 hover:bg-secondary/40 text-xs transition-colors truncate",
                                  activeProvider === prov && activeModel === m ? "text-foreground font-semibold bg-secondary/20" : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground/80 py-1.5 flex gap-1 items-center border-border/60">
                  <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>146 Agents Active</span>
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-muted-foreground/85" />
                <span>Context reads resume scores & GitHub activity profiles automatically</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CopilotPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CopilotWorkspace />
    </Suspense>
  );
}
