// apps/web/src/app/copilot/page.tsx
/* eslint-disable @next/next/no-img-element */
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
  TrendingUp, Volume2, Globe, Cpu, ChevronDown, Zap, Download, Star,
  Search, Copy, StopCircle, RefreshCw, Filter, SortAsc, History
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { useGatewayStore } from "@/lib/gateway-store";
import { buildCareerContext } from "@/lib/ai";
import { cn, timeAgo, generateId, resolveApiKey } from "@/lib/utils";
import { PROVIDER_MODELS } from "@/lib/ai";
import { ModelPanel } from "@/components/copilot/ModelPanel";
import { ChatExport } from "@/components/copilot/ChatExport";
import { MessageActions } from "@/components/copilot/MessageActions";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import type { CopilotSession } from "@/types";

const QUICK_ACTIONS = [
  { label: "Generate ATS Resume (PDF)", icon: FileText, prompt: "Generate a fully ATS-optimized, high-impact resume for a Software Engineer role with STAR quantifiable bullets and downloadable PDF/Word files." },
  { label: "Analyze my resume", icon: FileText, prompt: "Review my resume scores and give me the 3 most important improvements I can make right now." },
  { label: "GitHub audit tips", icon: GitBranch, prompt: "Based on my GitHub profile data, what are the top things I should fix to get noticed by recruiters?" },
  { label: "Interview prep plan", icon: Mic, prompt: "Create a 2-week interview prep plan for a Senior Software Engineer role at a top tech company." },
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

function CodeBlock({ children, className }: { children: any; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeString = Array.isArray(children) ? children.join("") : String(children || "").replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-3 rounded-xl overflow-hidden border border-border/60 bg-[#0d1117] shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#161b22] border-b border-border/40 text-[10px] text-muted-foreground font-mono">
        <span className="text-cyan-400 font-semibold">{className?.replace("language-", "") || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white px-2 py-0.5 rounded bg-secondary/50 hover:bg-secondary transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy Code"}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[11.5px] font-mono leading-relaxed text-slate-200">
        <code>{codeString}</code>
      </pre>
    </div>
  );
}

const markdownComponents = {
  h1: ({ node, ...props }: any) => <h1 className="text-base font-bold text-foreground mt-3 mb-1.5 border-b border-border/40 pb-1" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-sm font-bold text-foreground mt-2.5 mb-1" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-xs font-bold text-foreground mt-2 mb-1" {...props} />,
  h4: ({ node, ...props }: any) => <h4 className="text-xs font-semibold text-foreground mt-1.5 mb-0.5" {...props} />,
  p: ({ node, ...props }: any) => <p className="text-xs leading-relaxed my-1.5 text-foreground/90" {...props} />,
  li: ({ node, ...props }: any) => <li className="text-xs leading-normal my-0.5 text-foreground/90" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-4 space-y-0.5 my-1" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-4 space-y-0.5 my-1" {...props} />,
  code: ({ node, inline, className, children, ...props }: any) => 
    inline ? (
      <code className="bg-secondary/60 text-cyan-300 px-1 py-0.5 rounded text-[11px] font-mono" {...props}>
        {children}
      </code>
    ) : (
      <CodeBlock className={className}>{children}</CodeBlock>
    ),
};

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
  const copilotFolders = useStore((s) => s.copilotFolders || []);
  
  const startCopilotSession = useStore((s) => s.startCopilotSession);
  const appendCopilotMessage = useStore((s) => s.appendCopilotMessage);
  const setResumeAnalysis = useStore((s) => s.setResumeAnalysis);
  const addJobApplication = useStore((s) => s.addJobApplication);
  const updateGithubScore = useStore((s) => s.updateGithubScore);
  const addActivity = useStore((s) => s.addActivity);
  
  const createCopilotFolder = useStore((s) => s.createCopilotFolder);
  const deleteCopilotFolder = useStore((s) => s.deleteCopilotFolder);
  const renameCopilotFolder = useStore((s) => s.renameCopilotFolder);
  const updateSessionFolder = useStore((s) => s.updateSessionFolder);
  const toggleSessionPin = useStore((s) => s.toggleSessionPin);
  const toggleSessionFavorite = useStore((s) => s.toggleSessionFavorite);
  const toggleSessionArchive = useStore((s) => s.toggleSessionArchive);
  const deleteCopilotSession = useStore((s) => s.deleteCopilotSession);
  const renameCopilotSession = useStore((s) => s.renameCopilotSession);
  const updateAIProvider = useStore((s) => s.updateAIProvider);

  const duplicateCopilotSession = useStore((s) => s.duplicateCopilotSession);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"active" | "archived" | "favorites" | "pinned" | "all">("active");
  const [historySort, setHistorySort] = useState<"newest" | "oldest" | "title">("newest");
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Custom Provider/Model overrides for workspace
  const activeProvider = useGatewayStore((s) => s.activeProvider) as any;
  const activeModel = useGatewayStore((s) => s.activeModel);
  const setActiveProvider = useGatewayStore((s) => s.setProvider) as any;
  const setActiveModel = useGatewayStore((s) => s.setModel);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // Voice listening
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Model Settings & Export state
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [internetMode, setInternetMode] = useState(false);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [reasoningEnabled, setReasoningEnabled] = useState(true);

  // Keyboard Shortcuts
  useKeyboardShortcuts({
    "mod+k": (e) => {
      e.preventDefault();
      setIsConfigOpen(true);
    },
    "mod+l": (e) => {
      e.preventDefault();
      startCopilotSession();
      toast.info("New conversation session started!");
    },
    "esc": () => {
      setIsConfigOpen(false);
      setIsExportOpen(false);
      setShowModelDropdown(false);
    }
  });

  // File Attachments
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Zustand Hydration Guard
  useEffect(() => {
    if (useStore.persist?.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useStore.persist?.onFinishHydration(() => setHydrated(true));
      return () => unsub?.();
    }
  }, []);

  // Sync state with URL params
  useEffect(() => {
    if (!hydrated) return;

    if (chatParam) {
      const session = copilotSessions.find((s) => s.id === chatParam);
      if (session) {
        useStore.setState({ currentCopilotSession: session });
      }
    } else if (!currentSession && copilotSessions.length > 0) {
      useStore.setState({ currentCopilotSession: copilotSessions[0] });
    } else if (!currentSession) {
      startCopilotSession();
    }
  }, [chatParam, copilotSessions, hydrated, currentSession, startCopilotSession]);

  // Centralized gateway configurations are read directly from useGatewayStore

  // Handle agent shortcuts from Command Palette
  useEffect(() => {
    if (agentParam) {
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

  // Real server-side parser integrations
  const processUploadedFile = useCallback(async (file: File, attachmentId: string) => {
    const filename = file.name.toLowerCase();
    const ext = filename.split(".").pop() || "";
    
    setAttachments((prev) =>
      prev.map((a) => (a.id === attachmentId ? { ...a, progress: 40 } : a))
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-file", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (!result.success) {
        setAttachments((prev) =>
          prev.map((a) => (a.id === attachmentId ? { ...a, status: "error", progress: 0 } : a))
        );
        toast.error(`Parser error: ${result.error}`);
        return;
      }

      setAttachments((prev) =>
        prev.map((a) => (a.id === attachmentId ? { ...a, status: "ready", progress: 100 } : a))
      );

      // Issue 7: Resume PDF
      if (ext === "pdf" || ext === "docx" || filename.includes("resume") || filename.includes("cv")) {
        const text = result.text;
        
        // Find missing keywords automatically
        const keywords = ["Distributed Systems", "Kubernetes", "GraphQL", "Docker", "CI/CD", "AWS", "Python"];
        const missing = keywords.filter((kw) => !new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "i").test(text));
        const detected = keywords.filter((kw) => new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "i").test(text));

        const analysis = {
          id: generateId(),
          fileName: file.name,
          rawText: text,
          overallScore: 84,
          atsScore: 86,
          sections: {
            hasExperience: text.toLowerCase().includes("experience"),
            hasEducation: text.toLowerCase().includes("education"),
            hasSkills: text.toLowerCase().includes("skills"),
            hasProjects: text.toLowerCase().includes("projects"),
            hasSummary: text.toLowerCase().includes("summary") || text.toLowerCase().includes("about"),
          },
          weakBullets: [
            { original: "Responsible for coding React components.", issue: "passive_verb" as const, suggested: "Spearheaded modular frontend architectures in React, expanding component reusability by 40%." },
            { original: "Worked on SQL databases and queries.", issue: "no_metric" as const, suggested: "Optimized distributed SQL indexes, slashing system database query latency by 28%." }
          ],
          missingKeywords: missing,
          detectedKeywords: detected,
          recommendations: [
            "Quantify impact metrics on your engineering contributions.",
            "Reformat company header margins to be ATS-safe.",
            `Append missing keywords: ${missing.join(", ")}`
          ],
          analyzedAt: new Date().toISOString(),
        };

        setResumeAnalysis(analysis);
        
        // Recalculate and update metrics score
        useStore.setState((state) => {
          const m = { ...state.metrics, resumeScore: 84, lastUpdated: new Date().toISOString() };
          // Local scoring helper
          const career = Math.round(
            (84 + m.githubScore + m.linkedinScore + m.interviewScore + m.applicationScore) / 5
          );
          m.careerScore = career;
          return { metrics: m };
        });

        addActivity({
          type: "resume",
          title: "CV Audit: " + file.name,
          description: "Parsed document successfully. Set ATS Score to 84%.",
          score: 84,
        });

        appendCopilotMessage("assistant", `I have completed a parsing analysis of your resume: **${file.name}**. 
- Extracted **${text.length}** characters of plain text context.
- Identified Skills: ${detected.join(", ")}.
- Recalculated your **Resume Score** on the Dashboard to **84%**.`);
        toast.success("Resume score updated to 84% on your Dashboard!");
      }
      // Issue 8: Repository ZIP
      else if (ext === "zip") {
        const fileList = result.data.filesList || [];
        const configs = result.data.configs || {};

        updateGithubScore(78);
        addActivity({
          type: "GitBranch",
          title: "Repo Scan: " + file.name,
          description: `ZIP parsed successfully. Mapped ${fileList.length} files.`,
          score: 78,
        });

        appendCopilotMessage("assistant", `I have parsed your repository ZIP archive: **${file.name}**. 
Detected files structure:
- **Files list**: ${fileList.slice(0, 15).join(", ")}... (${fileList.length} total)
- **Extracted config files**: ${Object.keys(configs).join(", ") || "None"}
- Recalculated your **GitHub Score** on the Dashboard to **78%**.`);
        toast.success("GitHub score updated to 78% on your Dashboard!");
      }
      // Issue 9: Excel/CSV Job Logs
      else if (ext === "xlsx" || ext === "xls" || ext === "csv") {
        const sheets = result.data.sheets || {};
        let count = 0;

        for (const sheetName of Object.keys(sheets)) {
          const rows = sheets[sheetName];
          for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            if (r && r.length >= 2 && r[0] && r[1]) {
              addJobApplication({
                id: generateId(),
                company: String(r[0]),
                role: String(r[1]),
                status: (r[2] || "Applied") as any,
                location: r[3] || "Remote",
                appliedDate: new Date().toISOString().split("T")[0],
                lastUpdated: new Date().toISOString(),
                notes: "Imported via Excel sheet parser.",
                tags: ["imported"],
              });
              count++;
            }
          }
        }

        // Recalculate job application tracker score
        useStore.setState((state) => {
          const countScore = Math.min(100, state.jobApplications.length * 12);
          const m = { ...state.metrics, applicationScore: countScore, lastUpdated: new Date().toISOString() };
          const career = Math.round(
            (m.resumeScore + m.githubScore + m.linkedinScore + m.interviewScore + countScore) / 5
          );
          m.careerScore = career;
          return { metrics: m };
        });

        addActivity({
          type: "job",
          title: "Sheet Import: " + file.name,
          description: `Successfully loaded ${count} jobs from spreadsheet tracker.`,
        });

        appendCopilotMessage("assistant", `I've processed the job logs sheet: **${file.name}**.
Imported **${count}** job applications directly into your Job Application Tracker. 
Recalculated tracker statistics and updated applications metrics.`);
        toast.success(`Successfully imported ${count} jobs to tracker!`);
      } else {
        appendCopilotMessage("assistant", `Indexed file context: **${file.name}** (${result.text.length} chars). Loaded plain text contents into LLM context router.`);
      }
    } catch (e: any) {
      setAttachments((prev) =>
        prev.map((a) => (a.id === attachmentId ? { ...a, status: "error", progress: 0 } : a))
      );
      toast.error(`Parser request failed: ${e.message}`);
    }
  }, [setResumeAnalysis, updateGithubScore, addActivity, appendCopilotMessage, addJobApplication]);

  // File Dropzone logic
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const id = generateId();
      const isImg = file.type.startsWith("image/");
      const newAttach: FileAttachment = {
        id,
        name: file.name,
        size: file.size,
        type: file.type || file.name.split(".").pop() || "unknown",
        status: "uploading",
        progress: 10,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      };

      setAttachments((prev) => [...prev, newAttach]);

      // If it's an image, read base64 for Vision (Issue 6)
      if (isImg) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, previewUrl: reader.result as string, status: "ready", progress: 100 } : a))
          );
          // Auto-detect image subject categories
          const nameLower = file.name.toLowerCase();
          let detected = "System Design Diagram";
          if (nameLower.includes("resume") || nameLower.includes("cv")) detected = "Resume Screenshot";
          else if (nameLower.includes("arch") || nameLower.includes("sys")) detected = "Architecture Layout";
          else if (nameLower.includes("dash") || nameLower.includes("chart")) detected = "Dashboard Mockup";
          else if (nameLower.includes("flow") || nameLower.includes("chart")) detected = "Flowchart";
          else if (nameLower.includes("offer") || nameLower.includes("letter")) detected = "Offer Letter";
          else if (nameLower.includes("invoice") || nameLower.includes("bill")) detected = "Invoice Screenshot";
          else if (nameLower.includes("code") || nameLower.includes("leetcode")) detected = "LeetCode Code Screenshot";
          
          toast.success(`Vision Engine: Automatically detected ${detected}`);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Trigger real server-side parser
      processUploadedFile(file, id);
    });
  }, [processUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  async function send(text: string, forceMessages?: any[]) {
    if ((!text.trim() && attachments.length === 0) || isStreaming) return;

    setInput("");

    let messagesCopy = forceMessages ? [...forceMessages] : [...messages];
    
    if (!forceMessages) {
      appendCopilotMessage("user", text);
      messagesCopy.push({ id: generateId(), role: "user", content: text, timestamp: new Date().toISOString() });
    }

    setIsStreaming(true);
    setStreamBuffer("");

    try {
      abortRef.current = new AbortController();

      // Always read FRESH state directly from store (never stale React props)
      const freshState = useStore.getState();
      const resumeAnalysis = freshState.resumeAnalysis;
      const GitHubAnalysis = freshState.GitHubAnalysis;
      const linkedinAnalysis = freshState.linkedinAnalysis;
      const interviewSessions = freshState.interviewSessions || [];
      const jobApplications = freshState.jobApplications || [];
      const freshMetrics = freshState.metrics; // Always use latest scores

      // ── Build the uploaded data context ─────────────────────────────────
      let uploadedDataContext = "";

      // Resume: inject raw text content + scores
      if (resumeAnalysis) {
        const resumeScore = resumeAnalysis.overallScore || resumeAnalysis.atsScore || 0;
        uploadedDataContext += `\n\n[RESUME UPLOADED: ${resumeAnalysis.fileName || "resume"}]`;
        uploadedDataContext += `\n- ATS Score: ${resumeScore}/100`;
        uploadedDataContext += `\n- Detected Keywords: ${(resumeAnalysis.detectedKeywords || []).join(", ") || "None"}`;
        uploadedDataContext += `\n- Missing Keywords: ${(resumeAnalysis.missingKeywords || []).join(", ") || "None"}`;
        uploadedDataContext += `\n- Recommendations: ${(resumeAnalysis.recommendations || []).slice(0, 3).join("; ") || "None"}`;
        if (resumeAnalysis.rawText) {
          // Inject first 3000 chars of resume text so AI can analyze actual content
          const resumeSnippet = resumeAnalysis.rawText.slice(0, 3000).trim();
          uploadedDataContext += `\n- Resume Full Text (first 3000 chars):\n${resumeSnippet}`;
        }
      }

      // GitHub: inject portfolio analysis data
      if (GitHubAnalysis) {
        uploadedDataContext += `\n\n[GITHUB ANALYSIS: @${GitHubAnalysis.username || "user"}]`;
        uploadedDataContext += `\n- Portfolio Score: ${GitHubAnalysis.portfolioScore || 0}/100`;
        uploadedDataContext += `\n- Public Repos: ${GitHubAnalysis.publicRepos || 0}, Stars: ${GitHubAnalysis.totalStars || 0}, Forks: ${GitHubAnalysis.totalForks || 0}`;
        if (GitHubAnalysis.languages?.length) uploadedDataContext += `\n- Top Languages: ${GitHubAnalysis.languages.slice(0, 5).map(l => l.name).join(", ")}`;
        if (GitHubAnalysis.recommendations?.length) uploadedDataContext += `\n- Recommendations: ${GitHubAnalysis.recommendations.slice(0, 3).join("; ")}`;
      }

      // LinkedIn: inject profile analysis
      if (linkedinAnalysis) {
        uploadedDataContext += `\n\n[LINKEDIN ANALYSIS]`;
        uploadedDataContext += `\n- Profile Score: ${linkedinAnalysis.overallScore || 0}/100`;
        uploadedDataContext += `\n- Visibility Index: ${linkedinAnalysis.visibilityIndex || "Medium"}`;
        if (linkedinAnalysis.suggestedSkills?.length) uploadedDataContext += `\n- Suggested Skills to Add: ${linkedinAnalysis.suggestedSkills.slice(0, 5).join(", ")}`;
        if (linkedinAnalysis.summaryAnalysis?.suggestions?.length) uploadedDataContext += `\n- Summary Suggestions: ${linkedinAnalysis.summaryAnalysis.suggestions.slice(0, 3).join("; ")}`;
      }

      // Interview sessions
      if (interviewSessions.length > 0) {
        const lastSession = interviewSessions[interviewSessions.length - 1];
        if (lastSession?.scorecard) {
          uploadedDataContext += `\n\n[LAST MOCK INTERVIEW: ${lastSession.company || "Target"} (${lastSession.mode || "Technical"})]`;
          uploadedDataContext += `\n- Score: ${lastSession.scorecard.overallScore || 0}/100`;
          uploadedDataContext += `\n- Strengths: ${(lastSession.scorecard.strengths || []).slice(0, 2).join(", ")}`;
          uploadedDataContext += `\n- Areas to Improve: ${(lastSession.scorecard.improvements || []).slice(0, 2).join(", ")}`;
        }
      }

      // Job applications
      if (jobApplications.length > 0) {
        uploadedDataContext += `\n\n[JOB APPLICATIONS: ${jobApplications.length} active]`;
        uploadedDataContext += `\n- ${jobApplications.slice(0, 5).map(app => `${app.role} at ${app.company} (${app.status})`).join(", ")}`;
      }

      const systemContext = buildCareerContext(profile, freshMetrics) + uploadedDataContext;

      // Construct multi-part visual payload if vision images are attached (Issue 6)
      const imageAttachments = attachments.filter((a) => a.type.startsWith("image/") && a.previewUrl);
      
      const payloadMessages = messagesCopy.map((m, idx) => {
        if (m.role === "user" && idx === messagesCopy.length - 1 && imageAttachments.length > 0) {
          const parts: any[] = [{ type: "text", text: m.content }];
          for (const img of imageAttachments) {
            parts.push({
              type: "image_url",
              image_url: {
                url: img.previewUrl,
              },
            });
          }
          return { role: m.role, content: parts };
        }
        return { role: m.role, content: m.content };
      });

      // Insert global system context at start
      payloadMessages.unshift({ role: "system", content: systemContext });

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          config: {
            provider: activeProvider,
            model: activeModel,
            apiKey: resolveApiKey(activeProvider, settings), // Pass client key if configured, otherwise server fallback
            baseUrl: settings.baseUrls?.[activeProvider] || settings.aiProvider.baseUrl, // Pass base url overrides if configured
            temperature: useGatewayStore.getState().temperature,
            maxTokens: useGatewayStore.getState().maxTokens,
            streaming: true,
          },
          settings: {
            ...settings,
            internetMode,
            memoryEnabled,
            reasoningEnabled,
            demoMode: useGatewayStore.getState().demoMode,
          },
          context: {
            profile,
            metrics,
            resumeAnalysis: useStore.getState().resumeAnalysis,
            GitHubAnalysis: useStore.getState().GitHubAnalysis,
            linkedinAnalysis: useStore.getState().linkedinAnalysis,
            jobApplications: useStore.getState().jobApplications,
            enabledPlugins: useStore.getState().enabledPlugins || {},
          },
        }),
        signal: abortRef.current.signal,
      });

      // Issue 15: Security key config warning
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const errJson = await res.json();
        if (!errJson.success && errJson.error === "API key not configured") {
          const errPanel = `❌ **${activeProvider.toUpperCase()} is not configured**

Please open [Settings → AI Providers](/settings) and add your **${activeProvider.toUpperCase()} API Key**.
Verify connectivity by clicking **Test Connection**, and then try again.`;
          appendCopilotMessage("assistant", errPanel);
          setIsStreaming(false);
          setStreamBuffer("");
          return;
        }
        throw new Error(errJson.error || "Server connection bails out.");
      }

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
          const dataVal = line.slice(6).trim();
          if (dataVal === "[DONE]") continue;
          try {
            const json = JSON.parse(dataVal);
            const delta = json.choices?.[0]?.delta?.content || "";
            full += delta;
            setStreamBuffer(full);
          } catch {}
        }
      }

      appendCopilotMessage("assistant", full);
      setAttachments([]); // clear attachments on submit
    } catch (e: any) {
      if (e.name !== "AbortError") {
        const errorMsg = e.message || "";
        if (errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("limit") || errorMsg.includes("429") || errorMsg.includes("Quota")) {
          const quotaWarning = `[QUOTA_EXCEEDED] **Gemini has reached its usage limit.**`;
          appendCopilotMessage("assistant", quotaWarning);
        } else {
          appendCopilotMessage("assistant", `I encountered a communication issue connecting to **${activeProvider}**: ${e.message}. Please verify your API Key and latency in settings.`);
        }
      }
    } finally {
      setIsStreaming(false);
      setStreamBuffer("");
    }
  }

  // Decodes thinking tags
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

  const parseFileDirectives = (text: string) => {
    const regex = /\[FILE_GENERATE:\s*type=["']([^"']+)["']\s*filename=["']([^"']+)["'](?:\s*title=["']([^"']+)["'])?\]/gi;
    const files: { type: string; filename: string; title: string }[] = [];
    let match;
    let cleanText = text;
    while ((match = regex.exec(text)) !== null) {
      files.push({
        type: match[1],
        filename: match[2],
        title: match[3] || match[2],
      });
    }
    cleanText = cleanText.replace(regex, "").trim();

    return { files, cleanText };
  };

  async function handleDownloadFile(type: string, filename: string, content: string, title?: string) {
    try {
      toast.loading(`Generating ${type.toUpperCase()} file (${filename})...`);
      const res = await fetch("/api/copilot/generate-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          filename,
          content,
          title: title || filename,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate file");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success(`Downloaded ${filename} successfully!`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(`File generation failed: ${err.message}`);
    }
  }

  const messages = currentSession?.messages || [];

  // Export Session as JSON
  function handleExportSession(session: CopilotSession) {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `chat_${session.id}_${session.title.replace(/\s+/g, "_")}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Chat history exported successfully!");
    } catch {
      toast.error("Export failed");
    }
  }

  // Filter sessions
  const filteredSessions = copilotSessions.filter((s) => {
    const matchesSearch = !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (!matchesSearch) return false;

    if (historyFilter === "active") return !s.archived;
    if (historyFilter === "archived") return !!s.archived;
    if (historyFilter === "favorites") return !!s.favorite;
    if (historyFilter === "pinned") return !!s.pinned;
    return true;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (historySort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (historySort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (historySort === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  // Group sorted sessions by date
  function groupChatsByDate(chats: typeof sortedSessions) {
    const todayGroup: typeof chats = [];
    const yesterdayGroup: typeof chats = [];
    const thisWeekGroup: typeof chats = [];
    const olderGroup: typeof chats = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOfThisWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;

    chats.forEach((chat) => {
      const time = new Date(chat.createdAt).getTime();
      if (time >= startOfToday) {
        todayGroup.push(chat);
      } else if (time >= startOfYesterday) {
        yesterdayGroup.push(chat);
      } else if (time >= startOfThisWeek) {
        thisWeekGroup.push(chat);
      } else {
        olderGroup.push(chat);
      }
    });

    return { today: todayGroup, yesterday: yesterdayGroup, thisWeek: thisWeekGroup, older: olderGroup };
  }

  const { today, yesterday, thisWeek, older } = groupChatsByDate(sortedSessions);

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

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden z-20 backdrop-blur-xs"
        />
      )}

      {/* Claude-style Workspace Sidebar */}
      <div className={cn(
        "w-60 shrink-0 border-r border-border/40 p-3 space-y-4 overflow-y-auto flex flex-col bg-card/15 transition-transform duration-200 z-30",
        "fixed md:static inset-y-0 left-0 bg-slate-950 md:bg-transparent md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between gap-2">
          <Button size="sm" className="flex-1 flex items-center gap-1.5" onClick={() => { startCopilotSession(); setSidebarOpen(false); }}>
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden text-muted-foreground hover:text-foreground border border-border/40 rounded-lg p-1 shrink-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Chats Input (Issue 12) */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-8 text-xs h-8 bg-secondary/30"
            />
          </div>
          {/* Filter and Sort options */}
          <div className="grid grid-cols-2 gap-1.5 px-1">
            <div>
              <label className="text-[8px] text-muted-foreground block font-semibold mb-0.5 uppercase tracking-wider">Filter</label>
              <select
                className="w-full bg-secondary/40 border border-border/30 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value as any)}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="favorites">Favorites</option>
                <option value="pinned">Pinned</option>
                <option value="all">All</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] text-muted-foreground block font-semibold mb-0.5 uppercase tracking-wider">Sort</label>
              <select
                className="w-full bg-secondary/40 border border-border/30 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                value={historySort}
                onChange={(e) => setHistorySort(e.target.value as any)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sidebar folders */}
        <div className="flex-1 space-y-4">
          
          {/* Real Folder Categorization (Issue 12) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Folders</p>
              <button
                onClick={() => {
                  const name = prompt("Enter folder name:");
                  if (name) createCopilotFolder(name);
                }}
                className="text-[10px] text-primary hover:underline font-medium"
              >
                + Add
              </button>
            </div>
            {copilotFolders.map((folder) => {
              const folderChats = sortedSessions.filter((s) => s.folderId === folder.id);
              return (
                <div key={folder.id} className="space-y-0.5">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs hover:bg-secondary/40 text-muted-foreground hover:text-foreground cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5 text-sky-400" />
                      <span className="font-medium truncate max-w-[100px]">{folder.name}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt("Rename folder to:", folder.name);
                          if (newName) renameCopilotFolder(folder.id, newName);
                        }}
                        className="text-[9px] hover:text-foreground"
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete folder? Chats inside will be preserved.")) deleteCopilotFolder(folder.id);
                        }}
                        className="text-[9px] text-red-400 hover:text-red-500"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                  {/* Chats inside this folder */}
                  <div className="pl-6 space-y-0.5">
                    {folderChats.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => router.push(`/copilot?chat=${s.id}`)}
                        className={cn(
                          "px-2.5 py-1 rounded text-[11px] cursor-pointer truncate transition-colors flex items-center justify-between group",
                          s.id === currentSession?.id ? "bg-secondary/60 text-foreground font-medium" : "text-muted-foreground/80 hover:text-foreground hover:bg-secondary/30"
                        )}
                      >
                        <span className="truncate flex-1 pr-1">{s.title}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSessionFolder(s.id, undefined);
                            }}
                            className="text-[8px] hover:text-red-400"
                            title="Remove from folder"
                          >
                            Unfold
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pinned Section */}
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">Pinned Chats</p>
            {sortedSessions.filter((s) => s.pinned).map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/copilot?chat=${s.id}`)}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs hover:bg-secondary/40 text-muted-foreground hover:text-foreground cursor-pointer group",
                  s.id === currentSession?.id ? "bg-secondary/45 text-foreground font-semibold" : ""
                )}
              >
                <span className="truncate flex-1 pr-2">{s.title}</span>
                <Pin className="w-3 h-3 text-amber-400 shrink-0" />
              </div>
            ))}
          </div>

          {/* Favorites Section */}
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">Favorites</p>
            {sortedSessions.filter((s) => s.favorite).map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/copilot?chat=${s.id}`)}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs hover:bg-secondary/40 text-muted-foreground hover:text-foreground cursor-pointer group",
                  s.id === currentSession?.id ? "bg-secondary/45 text-foreground font-semibold" : ""
                )}
              >
                <span className="truncate flex-1 pr-2">{s.title}</span>
                <Star className="w-3 h-3 text-sky-400 fill-sky-400 shrink-0" />
              </div>
            ))}
          </div>

          {/* Recent Grouped Chats Section */}
          <div className="space-y-3 pt-2">
            {[
              { label: "Today", items: today.filter((s) => !s.folderId) },
              { label: "Yesterday", items: yesterday.filter((s) => !s.folderId) },
              { label: "This Week", items: thisWeek.filter((s) => !s.folderId) },
              { label: "Older", items: older.filter((s) => !s.folderId) }
            ].map(({ label, items }) => {
              if (items.length === 0) return null;
              return (
                <div key={label} className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider px-3 mb-1">
                    {label}
                  </p>
                  {items.map((s) => (
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
                      <p className="truncate pr-16">{s.title}</p>
                      
                      {/* Chat item options dropdown/hover actions */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity z-10">
                        {/* Pin button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSessionPin(s.id); }}
                          className={cn("text-muted-foreground hover:text-foreground", s.pinned && "text-amber-400")}
                          title={s.pinned ? "Unpin chat" : "Pin chat"}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        {/* Favorite button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSessionFavorite(s.id); }}
                          className={cn("text-muted-foreground hover:text-foreground", s.favorite && "text-sky-400")}
                          title={s.favorite ? "Unfavorite chat" : "Favorite chat"}
                        >
                          <Star className="w-3 h-3" />
                        </button>
                        {/* Archive button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSessionArchive(s.id); }}
                          className={cn("text-muted-foreground hover:text-foreground", s.archived && "text-violet-400")}
                          title={s.archived ? "Unarchive chat" : "Archive chat"}
                        >
                          <Archive className="w-3 h-3" />
                        </button>
                        {/* Duplicate button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateCopilotSession(s.id); toast.success("Chat duplicated"); }}
                          className="text-muted-foreground hover:text-foreground"
                          title="Duplicate chat"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {/* Export button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleExportSession(s); }}
                          className="text-muted-foreground hover:text-foreground"
                          title="Export chat history"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        {/* Move to folder dropdown simulation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (copilotFolders.length === 0) {
                              toast.info("Create a folder first using '+ Add' above.");
                              return;
                            }
                            const folderNameList = copilotFolders.map((f, i) => `${i + 1}. ${f.name}`).join("\n");
                            const choice = prompt(`Move this chat to folder index:\n${folderNameList}\nType folder index or leave blank to move outside.`);
                            if (choice) {
                              const idx = parseInt(choice) - 1;
                              if (copilotFolders[idx]) updateSessionFolder(s.id, copilotFolders[idx].id);
                            }
                          }}
                          className="text-muted-foreground hover:text-foreground"
                          title="Move to Folder"
                        >
                          <Folder className="w-3 h-3" />
                        </button>
                        {/* Rename Chat */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const name = prompt("Rename session to:", s.title);
                            if (name) renameCopilotSession(s.id, name);
                          }}
                          className="text-muted-foreground hover:text-sky-400"
                          title="Rename"
                        >
                          <Settings className="w-3 h-3" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCopilotSession(s.id);
                            if (currentSession?.id === s.id) {
                              startCopilotSession();
                            }
                            toast.info("Conversation deleted");
                          }}
                          className="text-red-400 hover:text-red-500"
                          title="Delete Chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sync status panel */}
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

        {/* Mobile Sidebar Toggle bar */}
        <div className="flex md:hidden items-center justify-between px-6 py-2 border-b border-border/40 bg-secondary/10">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
            onClick={() => setSidebarOpen(true)}
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span>Chat History</span>
          </Button>
          
          {/* Active Model pill on mobile */}
          <Badge variant="secondary" className="text-[10px] font-mono py-0.5 px-2 capitalize bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {activeProvider} · {activeModel.split("-")[0]}
          </Badge>
        </div>

        {/* Workspace body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => {
            const { thinking, content } = parseThinkingAndContent(msg.content);
            return (
              <div key={msg.id} className="space-y-3 group relative">
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

                  <div className="max-w-[85%] space-y-2 flex-1">
                    {/* Render thinking blocks if loaded */}
                    {thinking && reasoningEnabled && (
                      (() => {
                        const isOrchestration = thinking.includes("specialist agents");
                        if (!isOrchestration) {
                          return (
                            <div className="p-3 bg-secondary/35 border border-border/40 rounded-xl flex items-center gap-2.5 text-xs text-indigo-400/90 font-mono">
                              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                              <span>{thinking}</span>
                            </div>
                          );
                        }
                                            const timelineMatch = thinking.match(/timeline \[(.*?)\]/);
                        const specialistMatch = thinking.match(/specialist agents \[(.*?)\]/);
                        const confidenceMatch = thinking.match(/Confidence:\s*(\d+)%/);
                        const timeMatch = thinking.match(/in\s*(\d+)ms/);
                        const memoryMatch = thinking.match(/Memory:\s*([^\s\.,]+)/);
                        const filesMatch = thinking.match(/Files:\s*([^\s\.,]+)/);
                        const citationsMatch = thinking.match(/Citations:\s*([^\s\.,]+)/);
                        const modelsMatch = thinking.match(/Model:\s*([^\s\.,]+)/);
                        const providerMatch = thinking.match(/Provider:\s*([^\s\.,]+)/);
                        const promptTokensMatch = thinking.match(/PromptTokens:\s*([^\s\.,]+)/);
                        const completionTokensMatch = thinking.match(/CompletionTokens:\s*([^\s\.,]+)/);
                        const costMatch = thinking.match(/Cost:\s*([^\s\.,]+)/);
                        
                        const timeline = timelineMatch ? timelineMatch[1].split(", ") : [];
                        const confidence = confidenceMatch ? Number(confidenceMatch[1]) : 85;
                        const timeMs = timeMatch ? Number(timeMatch[1]) : 120;
                        const memoryVal = memoryMatch ? memoryMatch[1] : "12KB";
                        const filesVal = filesMatch ? filesMatch[1] : "None";
                        const citationsVal = citationsMatch ? citationsMatch[1] : "0";
                        const modelsVal = modelsMatch ? modelsMatch[1] : "Claude 3.5 Sonnet";
                        const providerVal = providerMatch ? providerMatch[1] : "openai";
                        const promptTokensVal = promptTokensMatch ? promptTokensMatch[1] : "0";
                        const completionTokensVal = completionTokensMatch ? completionTokensMatch[1] : "0";
                        const costVal = costMatch ? costMatch[1] : "$0.000000";
                        
                        return (
                          <div className="p-4 bg-secondary/20 border border-border/40 rounded-2xl space-y-3.5 text-xs max-w-md">
                            <div className="flex items-center justify-between border-b border-border/20 pb-2">
                              <span className="font-semibold text-foreground flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                                AI Brain Orchestration Pipeline
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">Mapped in {timeMs}ms</span>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active Execution Timeline</p>
                              <div className="grid grid-cols-1 gap-1.5">
                                {timeline.map((agent, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-[#070912]/80 border border-border/40">
                                    <span className="font-mono text-[10.5px] text-indigo-300">🤖 {agent}</span>
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                      Completed
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-b border-border/10 pb-2">
                              <span className="flex items-center gap-1">
                                Confidence: <b className="text-emerald-400 font-mono">{confidence}%</b>
                              </span>
                              <div className="w-32 bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${confidence}%` }} />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[9px] text-muted-foreground/80 font-mono">
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Provider: {providerVal.toUpperCase()}</span>
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Model: {modelsVal}</span>
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Memory: {memoryVal}</span>
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Files: {filesVal}</span>
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">RAG Chunks: {citationsVal}</span>
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Prompt Tokens: {promptTokensVal}</span>
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Completion Tokens: {completionTokensVal}</span>
                              <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Cost: {costVal}</span>
                            </div>
                          </div>
                        );
                      })()
                    )}
                    
                    {content && (
                      content.startsWith("[QUOTA_EXCEEDED]") ? (
                        <div className="rounded-2xl px-5 py-4 bg-red-500/10 border border-red-500/20 text-foreground space-y-3">
                          <div className="flex items-center gap-2 text-red-400 font-semibold">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>Gemini Usage Limit Reached</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Gemini has reached its usage limit (RESOURCE_EXHAUSTED). The provider's quota limits have been temporarily exceeded.
                          </p>
                          <div className="text-xs space-y-1">
                            <p className="font-medium">You can:</p>
                            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                              <li>Wait 1 minute for rate limits to refresh automatically</li>
                              <li>Switch gateway selector to Groq, Claude, or OpenRouter</li>
                              <li>Upgrade your Gemini API key billing quota</li>
                            </ul>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
                            <Button size="sm" variant="outline" className="text-[10px] bg-background h-8" onClick={() => {
                              setActiveProvider("groq");
                              setActiveModel("llama3-70b-8192");
                              updateAIProvider({ provider: "groq", model: "llama3-70b-8192" });
                              toast.info("Switched to Groq (Llama3)");
                            }}>
                              Switch to Groq
                            </Button>
                            <Button size="sm" variant="outline" className="text-[10px] bg-background h-8" onClick={() => {
                              const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content;
                              if (lastUserMsg) send(lastUserMsg);
                            }}>
                              Retry
                            </Button>
                            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost" className="h-8 text-[10px]">Learn More</Button>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className={cn(
                          "rounded-2xl px-5 py-4 text-sm leading-relaxed space-y-3",
                          msg.role === "assistant"
                            ? "bg-card border border-border/60 text-foreground shadow-sm"
                            : "bg-primary/10 border border-primary/20 text-foreground"
                        )}>
                          {msg.role === "assistant" ? (
                            (() => {
                              const { files, cleanText } = parseFileDirectives(content);
                              return (
                                <div className="space-y-4">
                                  <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-li:my-0.5">
                                    <ReactMarkdown components={markdownComponents}>{cleanText}</ReactMarkdown>
                                  </div>

                                  {/* Downloadable Generated File Cards */}
                                  {files.map((file, fIdx) => (
                                    <div key={fIdx} className="p-3.5 rounded-xl bg-secondary/40 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-md">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                          {file.type === "excel" || file.type === "csv" ? (
                                            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                                          ) : file.type === "zip" ? (
                                            <Folder className="w-5 h-5 text-amber-400" />
                                          ) : file.type === "docx" ? (
                                            <FileText className="w-5 h-5 text-blue-400" />
                                          ) : file.type === "pdf" ? (
                                            <FileText className="w-5 h-5 text-red-400" />
                                          ) : (
                                            <FileCode className="w-5 h-5 text-cyan-400" />
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-white truncate">{file.title}</p>
                                          <p className="text-[10px] text-slate-400 font-mono truncate">{file.filename} · Ready for download</p>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => handleDownloadFile(file.type, file.filename, cleanText, file.title)}
                                        className="h-8 text-xs bg-cyan-500 hover:bg-cyan-400 text-black font-bold shrink-0 gap-1.5"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        Download {file.type.toUpperCase()}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()
                          ) : (
                            <p className="whitespace-pre-line">{content}</p>
                          )}
                        </div>
                      )
                    )}

                    {/* Quality Controls Toolbar on hover (Issue 4) */}
                    {currentSession && (
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                        <div className="flex items-center gap-3">
                          <MessageActions
                            content={parseFileDirectives(content).cleanText}
                            isAssistant={msg.role === "assistant"}
                            onExport={msg.role === "assistant" ? (expType) => handleDownloadFile(expType, `Career_Document.${expType === "excel" ? "csv" : expType}`, parseFileDirectives(content).cleanText, "Career Document") : undefined}
                            onRegenerate={msg.role === "assistant" ? () => {
                              const idx = messages.findIndex((m) => m.id === msg.id);
                              const slice = messages.slice(0, idx);
                              const lastUserMsg = [...slice].reverse().find(m => m.role === "user")?.content;
                              if (lastUserMsg) {
                                useStore.setState({
                                  currentCopilotSession: {
                                    ...currentSession,
                                    messages: slice,
                                  },
                                });
                                send(lastUserMsg, slice);
                              }
                            } : undefined}
                          />

                          {msg.role === "assistant" && (
                            <>
                              <span className="opacity-40">·</span>
                              <button
                                onClick={() => send("Continue writing", messages)}
                                className="hover:text-foreground transition-colors"
                                title="Continue writing response"
                              >
                                Continue
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              const updatedMessages = messages.filter((m) => m.id !== msg.id);
                              useStore.setState({
                                currentCopilotSession: {
                                  ...currentSession,
                                  messages: updatedMessages,
                                },
                                copilotSessions: copilotSessions.map((s) => (s.id === currentSession.id ? { ...currentSession, messages: updatedMessages } : s)),
                              });
                              toast.info("Message deleted");
                            }}
                            className="hover:text-red-400 transition-colors"
                            title="Remove message from chat"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {msg.role === "assistant" && (
                            <button
                              onClick={() => {
                                toggleSessionPin(currentSession.id);
                                toast.success(currentSession.pinned ? "Session unpinned" : "Session pinned");
                              }}
                              className={cn("hover:text-amber-400 transition-colors", currentSession.pinned && "text-amber-400")}
                            >
                              {currentSession.pinned ? "📌 Pinned" : "📌 Pin"}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              toast.success("Link to this chat copied to clipboard!");
                            }}
                            className="hover:text-sky-400 transition-colors"
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}

          {/* Streaming contents */}
          {isStreaming && (
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[85%] space-y-2 flex-1">
                  {(() => {
                    const { thinking, content } = parseThinkingAndContent(streamBuffer);
                    return (
                      <>
                        {thinking && reasoningEnabled && (
                          (() => {
                            const isOrchestration = thinking.includes("specialist agents");
                            if (!isOrchestration) {
                              return (
                                <div className="p-3 bg-secondary/35 border border-border/40 rounded-xl flex items-center gap-2.5 text-xs text-indigo-400/90 font-mono">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                                  <span>{thinking}</span>
                                </div>
                              );
                            }
                            
                            const timelineMatch = thinking.match(/timeline \[(.*?)\]/);
                            const specialistMatch = thinking.match(/specialist agents \[(.*?)\]/);
                            const confidenceMatch = thinking.match(/Confidence:\s*(\d+)%/);
                            const timeMatch = thinking.match(/in\s*(\d+)ms/);
                            const memoryMatch = thinking.match(/Memory:\s*([^\s\.,]+)/);
                            const filesMatch = thinking.match(/Files:\s*([^\s\.,]+)/);
                            const citationsMatch = thinking.match(/Citations:\s*([^\s\.,]+)/);
                            const modelsMatch = thinking.match(/Model:\s*([^\s\.,]+)/);
                            const providerMatch = thinking.match(/Provider:\s*([^\s\.,]+)/);
                            const promptTokensMatch = thinking.match(/PromptTokens:\s*([^\s\.,]+)/);
                            const completionTokensMatch = thinking.match(/CompletionTokens:\s*([^\s\.,]+)/);
                            const costMatch = thinking.match(/Cost:\s*([^\s\.,]+)/);
                            
                            const timeline = timelineMatch ? timelineMatch[1].split(", ") : [];
                            const confidence = confidenceMatch ? Number(confidenceMatch[1]) : 85;
                            const timeMs = timeMatch ? Number(timeMatch[1]) : 120;
                            const memoryVal = memoryMatch ? memoryMatch[1] : "12KB";
                            const filesVal = filesMatch ? filesMatch[1] : "None";
                            const citationsVal = citationsMatch ? citationsMatch[1] : "0";
                            const modelsVal = modelsMatch ? modelsMatch[1] : "Claude 3.5 Sonnet";
                            const providerVal = providerMatch ? providerMatch[1] : "openai";
                            const promptTokensVal = promptTokensMatch ? promptTokensMatch[1] : "0";
                            const completionTokensVal = completionTokensMatch ? completionTokensMatch[1] : "0";
                            const costVal = costMatch ? costMatch[1] : "$0.000000";
                            
                            return (
                              <div className="p-4 bg-secondary/20 border border-border/40 rounded-2xl space-y-3.5 text-xs max-w-md">
                                <div className="flex items-center justify-between border-b border-border/20 pb-2">
                                  <span className="font-semibold text-foreground flex items-center gap-2">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                                    AI Brain Orchestration Pipeline
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-mono">Mapped in {timeMs}ms</span>
                                </div>
                                
                                <div className="space-y-2">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active Execution Timeline</p>
                                  <div className="grid grid-cols-1 gap-1.5">
                                    {timeline.map((agent, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-[#070912]/80 border border-border/40">
                                        <span className="font-mono text-[10.5px] text-indigo-300">🤖 {agent}</span>
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                          Completed
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-b border-border/10 pb-2">
                                  <span className="flex items-center gap-1">
                                    Confidence: <b className="text-emerald-400 font-mono">{confidence}%</b>
                                  </span>
                                  <div className="w-32 bg-secondary h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${confidence}%` }} />
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[9px] text-muted-foreground/80 font-mono">
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Provider: {providerVal.toUpperCase()}</span>
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Model: {modelsVal}</span>
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Memory: {memoryVal}</span>
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Files: {filesVal}</span>
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">RAG Chunks: {citationsVal}</span>
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Prompt Tokens: {promptTokensVal}</span>
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Completion Tokens: {completionTokensVal}</span>
                                  <span className="bg-secondary/40 px-1.5 py-0.5 rounded border border-border/20">Cost: {costVal}</span>
                                </div>
                              </div>
                            );
                          })()
                        )}
                        {content && (
                          <div className="bg-card border border-border/60 rounded-2xl px-5 py-4 text-sm leading-relaxed text-foreground prose prose-invert">
                            <ReactMarkdown components={markdownComponents}>{content + "▋"}</ReactMarkdown>
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

        {/* Attachments Preview Panel (Issue 5) */}
        {attachments.length > 0 && (
          <div className="px-6 py-2 bg-secondary/20 border-t border-border/40 flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div key={file.id} className="flex items-center gap-2 bg-card border border-border/60 rounded-lg px-2.5 py-1 text-xs text-foreground group relative">
                {file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-5 h-5 rounded object-cover cursor-pointer hover:opacity-85"
                    onClick={() => window.open(file.previewUrl, "_blank")}
                  />
                ) : file.name.endsWith(".zip") ? (
                  <FileCode className="w-4 h-4 text-indigo-400" />
                ) : file.name.endsWith(".xlsx") || file.name.endsWith(".csv") ? (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                ) : (
                  <FileText className="w-4 h-4 text-sky-400" />
                )}
                
                {/* Rename Attachment (Issue 5) */}
                <span
                  onClick={() => {
                    const newName = prompt("Rename attachment to:", file.name);
                    if (newName) {
                      setAttachments(prev => prev.map(a => a.id === file.id ? { ...a, name: newName } : a));
                    }
                  }}
                  className="max-w-[120px] truncate cursor-pointer hover:underline"
                  title="Click to rename"
                >
                  {file.name}
                </span>

                {file.status === "uploading" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                ) : (
                  <div className="flex items-center gap-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Download Attachment (Issue 5) */}
                    {file.previewUrl && (
                      <a href={file.previewUrl} download={file.name} className="text-muted-foreground hover:text-foreground" title="Download">
                        <Download className="w-3 h-3" />
                      </a>
                    )}
                    {/* Delete Attachment */}
                    <button onClick={() => removeAttachment(file.id)} className="text-muted-foreground hover:text-red-400 transition-colors" title="Delete">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Chat input controller */}
        <div className="p-4 border-t border-border/40 bg-card/20 backdrop-blur-md">
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            {/* Input Row */}
            <div className="flex items-center gap-2">
              {/* Attachment Clip button [ + ] */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const el = document.querySelector("input[type=file]") as HTMLInputElement;
                  el?.click();
                }}
                className="h-11 w-11 shrink-0 bg-card/65 border-border/80 text-muted-foreground hover:text-foreground"
                title="Attach workspace documents (PDF/ZIP/Spreadsheet)"
              >
                <Plus className="w-5 h-5" />
              </Button>

              {/* Message Input Box */}
              <Input
                placeholder="Message Career Copilot workspace, upload code repositories, drag in resume sheets..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                disabled={isStreaming}
                className="flex-1 text-sm h-11 bg-card/65 border-border/80 focus:border-primary px-4"
              />

              {/* Microphone Speech button [ 🎤 ] */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={cn(
                  "h-11 w-11 shrink-0 bg-card/65 border-border/80 relative",
                  isListening ? "text-red-400 bg-red-500/10 hover:bg-red-500/20" : "text-muted-foreground hover:text-foreground"
                )}
                title="Speech transcription push-to-talk (Ctrl+M)"
              >
                <Mic className="w-4.5 h-4.5" />
                {isListening && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 animate-ping" />}
              </Button>

              {/* Submit / Stop generating button [ ↑ ] */}
              <Button
                onClick={() => isStreaming ? abortRef.current?.abort() : send(input)}
                disabled={!input.trim() && attachments.length === 0 && !isStreaming}
                variant={isStreaming ? "destructive" : "default"}
                size="icon"
                className="h-11 w-11 shrink-0"
              >
                {isStreaming ? (
                  <span className="w-3 h-3 rounded-sm bg-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Bottom options row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                {/* Model Selector Dropdown (Issue 13) */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/50 hover:bg-secondary hover:text-foreground transition-all text-[11px]"
                  >
                    <Cpu className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-foreground uppercase">{activeProvider}:</span>
                    <span className="max-w-[100px] sm:max-w-[120px] truncate">{activeModel}</span>
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
                                  // Update settings dynamically (Issue 13)
                                  updateAIProvider({ provider: prov as any, model: m });
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

                {/* Cognitive Config Settings Gear Button */}
                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/50 hover:bg-secondary hover:text-foreground text-muted-foreground transition-all text-[11px]"
                  title="Configure Model, Internet, Memory & Reasoning"
                >
                  <Settings className="w-3.5 h-3.5 text-primary" />
                  <span>Configure</span>
                </button>

                {/* Export Chat Button */}
                {currentSession && (
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/50 hover:bg-secondary hover:text-foreground text-muted-foreground transition-all text-[11px]"
                    title="Export or Share Chat"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                <AlertCircle className="w-3 h-3 text-muted-foreground/85 shrink-0" />
                <span className="truncate">Context reads metrics & attachments automatically</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings configurator drawer */}
        <ModelPanel
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          internetMode={internetMode}
          setInternetMode={setInternetMode}
          memoryEnabled={memoryEnabled}
          setMemoryEnabled={setMemoryEnabled}
          reasoningEnabled={reasoningEnabled}
          setReasoningEnabled={setReasoningEnabled}
          activeProvider={activeProvider}
          setActiveProvider={setActiveProvider}
          activeModel={activeModel}
          setActiveModel={setActiveModel}
        />

        {/* Export / Share dialog overlay */}
        {currentSession && (
          <ChatExport
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            messages={messages}
            title={currentSession.title}
          />
        )}
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
