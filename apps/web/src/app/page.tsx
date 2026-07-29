// apps/web/src/app/page.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, GitBranch, Link2, Mic, Bot,
  ArrowRight, Shield, Cpu, Info, CheckCircle2, ChevronRight,
  TrendingUp, Code2, Users, Star, ArrowUpRight, Zap, Play, Search,
  Terminal, Globe, Lock, Workflow, BarChart3, Package, BookOpen,
  ArrowRightLeft, GitFork, HelpCircle, Mail, MessageSquare, ChevronDown,
  Settings, Database, CloudLightning, LineChart, Code, Building, GraduationCap, Video
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import agentRegistry from "../../../../agent-registry.json";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Animated Canvas Neural Network Component ---
function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const nodeCount = 80;
    const nodes: Array<{
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      emoji: string; label: string;
    }> = [];

    const emojis = ["🧾", "🧠", "🤖", "🔍", "💻", "💼", "📈", "🛡️", "🔗", "🚀", "🎯", "🎓"];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        z: (Math.random() - 0.5) * 500,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        emoji: emojis[i % emojis.length],
        label: agentRegistry.agents[i % agentRegistry.agents.length]?.name || "Specialist Agent",
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left - width / 2;
      mouseRef.current.targetY = e.clientY - rect.top - height / 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const fov = 300;
      const cx = width / 2;
      const cy = height / 2;

      const angleX = 0.0005 + mouseRef.current.y * 0.00001;
      const angleY = 0.0008 + mouseRef.current.x * 0.00001;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected: Array<{ px: number; py: number; pz: number; size: number; emoji: string; label: string; alpha: number; }> = [];

      nodes.forEach((node) => {
        node.x += node.vx; node.y += node.vy; node.z += node.vz;
        if (Math.abs(node.x) > 250) node.vx *= -1;
        if (Math.abs(node.y) > 250) node.vy *= -1;
        if (Math.abs(node.z) > 250) node.vz *= -1;

        let y1 = node.y * cosX - node.z * sinX;
        let z1 = node.z * cosX + node.y * sinX;
        let x2 = node.x * cosY - z1 * sinY;
        let z2 = z1 * cosY + node.x * sinY;

        node.x = x2; node.y = y1; node.z = z2;

        const scale = fov / (fov + z2 + 250);
        const px = x2 * scale + cx;
        const py = y1 * scale + cy;
        const size = Math.max(2, scale * 10);
        const alpha = Math.max(0.02, Math.min(0.7, scale));

        projected.push({ px, py, pz: z2, size, emoji: node.emoji, label: node.label, alpha });
      });

      ctx.lineWidth = 0.3;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 70) {
            const alpha = (1 - dist / 70) * 0.12 * projected[i].alpha * projected[j].alpha;
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      projected.forEach((p, idx) => {
        ctx.fillStyle = `rgba(165, 180, 252, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size / 3.5, 0, Math.PI * 2);
        ctx.fill();

        if (idx % 8 === 0 && p.alpha > 0.45) {
          ctx.font = `${Math.round(p.size * 1.3)}px sans-serif`;
          ctx.fillText(p.emoji, p.px - p.size, p.py + p.size / 2);

          const mx = mouseRef.current.targetX + cx;
          const my = mouseRef.current.targetY + cy;
          const dx = p.px - mx;
          const dy = p.py - my;
          if (Math.sqrt(dx * dx + dy * dy) < 40) {
            ctx.font = "8px system-ui";
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillText(p.label, p.px + p.size * 1.1, p.py + 3);
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto opacity-50" />;
}

// --- DATA ---
const FAQS = [
  { q: "What is Career Agents?", a: "Career Agents is an open-source Career Intelligence Platform housing 146 specialized AI agents running concurrently to audit resumes, scan GitHub coding architectures, suggest LinkedIn content, track jobs via Kanbans, and run voice mock interviews." },
  { q: "How do 146 AI agents collaborate?", a: "The AI Brain Orchestrator classifies user intent and selects a specialized sub-team of agents. For example, when you submit a resume, the ATS Calibrator, Bullet Rewrite Agent, and Skill Gap Analyst collaborate to generate a structured analysis scorecard." },
  { q: "Can I run this without API keys?", a: "Yes. Career Agents includes a complete 'Demo Mode' toggle accessible on the /demo page. When Demo Mode is active, the system automatically feeds realistic, streaming mock responses for Copilot and analysis suites, allowing safe testing even when offline." },
  { q: "Which LLM providers are supported?", a: "We support 15+ LLM providers including Groq, Google Gemini, OpenAI, Anthropic Claude, OpenRouter, DeepSeek, Together AI, Fireworks, Perplexity, Mistral, Cohere, xAI, and local offline models via Ollama and LM Studio." },
  { q: "Is my resume data stored securely?", a: "Yes. Career Agents operates with a local-first architecture. All files, portfolio syncs, and telemetry events are saved on your local SQLite storage unless configured otherwise. Dynamic checks are shielded against SSRF and directory traversal." },
  { q: "What is the Model Context Protocol (MCP) server?", a: "Career Agents exports a native MCP Server mapping 31 specialized developer tools (e.g. search_agents, recommend_agents, resume_score, career_gap_analysis). This allows external LLM clients like Claude Desktop or Cursor to fetch career context directly." },
  { q: "How does the GitHub Analyzer evaluate code quality?", a: "It scans commits, language configurations, README documentation density, and testing directories. It highlights test coverage gaps and compiles customized tech stacks to optimize developer portfolios." },
  { q: "Can I use Career Agents for university cohorts?", a: "Yes. The Team Workspace plan supports candidate cohorts list sharing, collaborative scorecard comparisons, and custom RAG index sharing for bootcamp training setups." },
  { q: "How do I customize the gateway failovers?", a: "You can arrange the fallback providers order inside Settings. If Groq limits are exceeded, the Gateway automatically reroutes the completion request to Gemini, OpenAI, or Claude based on availability." },
  { q: "Are there any size limitations for files?", a: "Uploads are capped at a safe 20 MB ceiling. We support PDF, DOCX, TXT, CSV, JSON, ZIP, PPTX, and XLSX document parsers." },
  { q: "What security headers are applied?", a: "The system enforces HSTS, strict CSP headers, Referrer-Policy bounds, Frame-Options, Cross-Origin-Opener-Policy (COOP), and detailed rate limits (20/min for guests, 60/min for users)." },
  { q: "How do I contribute to the open source project?", a: "You can star our GitHub repository, read AGENTS.md contributor guidelines, run validation checklists, compile database maps, and make pull requests." }
];

const PREVIEW_TABS = [
  { id: "dashboard", label: "Dashboard", desc: "Aggregated career scores, prep progress funnel, LeetCode metrics." },
  { id: "resume", label: "Resume Studio", desc: "Forensic ATS parsing audits, bullet rewrite helpers, layout checklists." },
  { id: "copilot", label: "AI Copilot", desc: "Context-aware conversation streams with reasoning timelines." },
  { id: "interview", label: "Interview Lab", desc: "Interactive mock interviews structured via the STAR method." },
  { id: "jobs", label: "Job Hub", desc: "Live job fetching and integrated Kanban tracker." }
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [agentSearch, setAgentSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const agents = useMemo(() => agentRegistry.agents || [], []);
  const categories = useMemo(() => {
    const set = new Set<string>();
    agents.forEach(a => set.add(a.division));
    return ["All", ...Array.from(set)];
  }, [agents]);

  const filteredAgents = useMemo(() => {
    return agents.filter(a => {
      const matchSearch = !agentSearch || a.name.toLowerCase().includes(agentSearch.toLowerCase()) || a.description.toLowerCase().includes(agentSearch.toLowerCase());
      const matchCat = activeCategory === "All" || a.division === activeCategory;
      return matchSearch && matchCat;
    }).slice(0, 8);
  }, [agents, agentSearch, activeCategory]);

  const filteredFaqs = useMemo(() => {
    return FAQS.filter(f => !faqSearch || f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()));
  }, [faqSearch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans relative">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center border-b border-slate-900 overflow-hidden bg-slate-950">
        <NeuralNetworkCanvas />
        <div className="absolute top-0 left-[-10%] w-[50%] h-[40%] rounded-full bg-indigo-900/20 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[45%] rounded-full bg-sky-950/20 blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center z-10 py-24 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold tracking-widest uppercase mb-8 pointer-events-auto shadow-glow-indigo/10"
          >
            <Zap className="w-3.5 h-3.5 fill-indigo-400" />
            Open Source Career Operating System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.05] mb-6 pointer-events-auto"
          >
            Build your career.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400">
              Not your resume.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 pointer-events-auto"
          >
            The world's first open-source Career Operating System powered by 146 concurrent AI agents.
            Orchestrate resume audits, GitHub scans, behavioral mock interviews, and job tracking in one workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/25 px-8 py-6 rounded-xl text-sm transition-all hover:scale-[1.02]">
                Launch Workspace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-slate-700 hover:border-slate-600 bg-slate-900/50 text-white px-8 py-6 rounded-xl text-sm transition-all hover:scale-[1.02] flex items-center gap-2">
                <Play className="w-4 h-4" />
                Live Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating AI Cards in Hero */}
        <motion.div
          initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-[5%] top-[25%] hidden xl:flex items-center gap-3 glass border border-slate-800 bg-slate-900/60 p-4 rounded-2xl shadow-xl pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Resume Agent</div>
            <div className="text-xs font-semibold text-white">ATS Score increased to 94%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.6 }}
          className="absolute right-[5%] bottom-[25%] hidden xl:flex items-center gap-3 glass border border-slate-800 bg-slate-900/60 p-4 rounded-2xl shadow-xl pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <GitBranch className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">GitHub Analyzer</div>
            <div className="text-xs font-semibold text-white">CI/CD Pipeline patterns detected</div>
          </div>
        </motion.div>
      </section>

      {/* 2. SOCIAL PROOF (Real Metrics) */}
      <section className="py-12 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
            {[
              { label: "Active AI Agents", value: "146", icon: Bot, color: "text-indigo-400" },
              { label: "MCP Developer Tools", value: "31", icon: Terminal, color: "text-sky-400" },
              { label: "Integrated Modules", value: "12+", icon: Package, color: "text-emerald-400" },
              { label: "Supported AI Providers", value: "15+", icon: Globe, color: "text-violet-400" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-2 p-4 rounded-xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                  <span>{stat.label}</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRUSTED BY (Demo logos) */}
      <section className="py-12 border-b border-slate-900 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Built for engineers aiming for top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
            {/* Using text icons since we don't have actual SVG logos for FAANG */}
            <div className="flex items-center gap-2"><Building className="w-6 h-6" /><span className="font-bold text-lg">Acme Corp</span></div>
            <div className="flex items-center gap-2"><CloudLightning className="w-6 h-6" /><span className="font-bold text-lg">Stark Ind.</span></div>
            <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="font-bold text-lg">GlobalTech</span></div>
            <div className="flex items-center gap-2"><Database className="w-6 h-6" /><span className="font-bold text-lg">DataSys</span></div>
            <div className="flex items-center gap-2"><Cpu className="w-6 h-6" /><span className="font-bold text-lg">NeuralNet</span></div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT OVERVIEW & WHY US */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 bg-slate-950">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">The ultimate advantage in<br />a competitive job market.</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Career Agents isn't just a chatbot wrapper. It is a highly opinionated Model Context Protocol (MCP) server
            connected to a network of 146 specialized LLM profiles. It scans your resume, audits your code, runs behavioral interviews, and tracks your job hunt in one unified architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Specialized, Not Generic", desc: "Why use ChatGPT when you can use an agent trained specifically on Amazon Leadership Principles or Netflix Architecture patterns?", icon: Bot, color: "text-indigo-400" },
            { title: "Privacy First (Local DB)", desc: "Your resume, job leads, and career metadata are stored locally in your SQLite database. You own your data.", icon: Shield, color: "text-emerald-400" },
            { title: "Bring Your Own Key (BYOK)", desc: "Plug in Groq for speed, Claude 3.5 for deep coding audits, or run Ollama completely offline. Zero vendor lock-in.", icon: Code, color: "text-sky-400" }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className="bg-slate-900/30 border border-slate-800 p-8 rounded-3xl hover:bg-slate-900/50 transition-colors"
            >
              <card.icon className={cn("w-8 h-8 mb-6", card.color)} />
              <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE PRODUCT SHOWCASE */}
      <section className="py-20 border-t border-slate-900 bg-slate-900/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">One unified workspace.</h2>
            <p className="text-sm text-slate-400">Everything you need from application to offer.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {PREVIEW_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border transition-all",
                  activeTab === tab.id
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Compressed Browser Mockup */}
          <div className="border border-slate-800 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl relative mx-auto w-full max-w-5xl h-[550px] flex flex-col">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="bg-slate-950 px-8 py-1.5 rounded border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-500" />
                https://career-agents.local/{activeTab}
              </div>
              <div className="w-16" />
            </div>

            <div className="flex-1 bg-slate-950 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 p-8 flex items-center justify-center"
                >
                  {/* Mockup UI based on active tab */}
                  {activeTab === "dashboard" && (
                    <div className="w-full h-full max-w-3xl flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Career Overview</h2>
                        <Button className="bg-indigo-600 text-xs h-8">Sync Profile</Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5"><div className="text-xs text-slate-400 mb-2">Resume ATS Score</div><div className="text-4xl font-extrabold text-emerald-400">92%</div></div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5"><div className="text-xs text-slate-400 mb-2">GitHub Code Quality</div><div className="text-4xl font-extrabold text-indigo-400">A-</div></div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5"><div className="text-xs text-slate-400 mb-2">Active Applications</div><div className="text-4xl font-extrabold text-sky-400">14</div></div>
                      </div>
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center">
                        <LineChart className="w-12 h-12 text-slate-700 mb-4" />
                        <span className="text-sm text-slate-500 font-medium">Activity graph visualization rendered here</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "resume" && (
                    <div className="w-full h-full max-w-4xl flex gap-6">
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
                        <div className="h-4 w-32 bg-slate-800 rounded" />
                        <div className="space-y-2"><div className="h-3 w-full bg-slate-800 rounded" /><div className="h-3 w-5/6 bg-slate-800 rounded" /><div className="h-3 w-4/6 bg-slate-800 rounded" /></div>
                        <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] text-indigo-300 font-mono">
                          <span className="font-bold text-indigo-400">AI SUGGESTION:</span> Rewrite bullet to quantify impact: "Optimized PostgreSQL queries reducing latency by 45%."
                        </div>
                      </div>
                      <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-white">Keywords Missing</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-rose-500/10 text-rose-400 rounded text-[9px] border border-rose-500/20">Kubernetes</span>
                          <span className="px-2 py-1 bg-rose-500/10 text-rose-400 rounded text-[9px] border border-rose-500/20">CI/CD</span>
                          <span className="px-2 py-1 bg-rose-500/10 text-rose-400 rounded text-[9px] border border-rose-500/20">GraphQL</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "copilot" && (
                    <div className="w-full h-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl flex flex-col">
                      <div className="flex-1 p-6 space-y-6 overflow-hidden">
                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                          <div className="bg-slate-800 p-3 rounded-lg text-xs text-slate-300">How do I explain a 6-month employment gap?</div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 shrink-0 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
                          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg text-xs text-slate-300 space-y-2">
                            <p className="text-indigo-400 font-bold mb-2">Career Gap Agent</p>
                            <p>Frame it as a period of active upskilling. Here is a STAR-format response you can use...</p>
                            <div className="h-2 w-3/4 bg-slate-700/50 rounded mt-2 animate-pulse" />
                            <div className="h-2 w-1/2 bg-slate-700/50 rounded animate-pulse" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t border-slate-800">
                        <div className="w-full h-10 bg-slate-950 border border-slate-700 rounded-md" />
                      </div>
                    </div>
                  )}

                  {activeTab === "jobs" && (
                    <div className="w-full h-full flex flex-col gap-4">
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <div className="h-8 w-32 bg-slate-800 rounded-md" />
                          <div className="h-8 w-24 bg-slate-800 rounded-md" />
                        </div>
                        <Button className="bg-indigo-600 text-xs h-8">Add Lead</Button>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        {['Wishlist', 'Applied', 'Interviewing'].map((col, i) => (
                          <div key={col} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                            <div className="text-xs font-bold text-slate-400 uppercase">{col}</div>
                            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg h-24" />
                            {i === 1 && <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg h-24" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "interview" && (
                    <div className="w-full h-full max-w-3xl flex flex-col items-center justify-center gap-8">
                      <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center animate-pulse shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]">
                        <Mic className="w-10 h-10 text-indigo-400" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-bold text-white">"Tell me about a time you had a conflict with a teammate."</h3>
                        <p className="text-xs text-slate-400">Listening... (Recording via WebRTC)</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-10 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                        <span className="w-1.5 h-4 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <span className="w-1.5 h-8 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="w-1.5 h-5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI ORCHESTRATION PIPELINE */}
      <section className="py-24 border-t border-slate-900 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">The AI Brain Architecture</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              When you prompt the Copilot, a sophisticated pipeline activates. Intents are detected, memory is retrieved via RAG,
              and the exact right combination of agents is dispatched to solve your problem.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-900 via-indigo-500/50 to-slate-900 -translate-y-1/2 z-0" />

            {[
              { step: "User Input", icon: Terminal },
              { step: "Intent Classifier", icon: Cpu },
              { step: "Memory Search (RAG)", icon: Database },
              { step: "146 Agent Selection", icon: Users },
              { step: "Streaming Output", icon: ArrowRight }
            ].map((node, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-3 w-40">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl">
                  <node.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 text-center">{node.step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURE DEEP DIVES */}
      <section className="py-24 border-t border-slate-900 bg-slate-900/20 relative z-10 space-y-24">
        {/* Feature 1 */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
              <FileText className="w-3 h-3" /> Resume Studio
            </div>
            <h3 className="text-3xl font-bold text-white">Forensic ATS Parsing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Don't guess what recruiters want. Our ATS Calibrator agent parses your PDF, identifies missing semantic keywords from your target job description, and rewrites your bullets into the proven STAR format.
            </p>
            <ul className="space-y-3 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracts text from PDF and DOCX natively.</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Scores against specific job descriptions.</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Auto-generates quantifiable impact metrics.</li>
            </ul>
          </div>
          <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl h-80 flex items-center justify-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
            <BarChart3 className="w-24 h-24 text-slate-800" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20">
              <GitBranch className="w-3 h-3" /> GitHub Analyzer
            </div>
            <h3 className="text-3xl font-bold text-white">Code Portfolio Auditing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Senior engineering managers look at your code. Our GitHub Analyzer agent scans your public repositories, evaluates your testing practices (CI/CD, coverage), and suggests architecture improvements to make your projects FAANG-ready.
            </p>
            <ul className="space-y-3 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Analyzes README documentation density.</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Highlights missing testing frameworks.</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Generates portfolio showcase tags.</li>
            </ul>
          </div>
          <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl h-80 flex items-center justify-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
            <Code2 className="w-24 h-24 text-slate-800" />
          </div>
        </div>
      </section>

      {/* 8. 146 AGENTS DIRECTORY */}
      <section className="py-24 border-t border-slate-900 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Ecosystem Directory</h2>
              <p className="text-sm text-slate-400 max-w-xl">Search and filter all 146 specialist agents available in the workspace registry.</p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-52"
                />
              </div>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredAgents.map((agent, idx) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="border border-slate-800 bg-slate-900/40 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900/80 transition-all cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{agent.emoji || "🤖"}</span>
                    <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">{agent.division}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{agent.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{agent.description}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>Vibe: {agent.vibe?.split(",")[0] || "analytical"}</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-300 text-xs px-6 py-5 rounded-xl hover:bg-slate-800 hover:text-white">
              View All 146 Agents
            </Button>
          </div>
        </div>
      </section>

      {/* 9. SUPPORTED AI PROVIDERS GRID */}
      <section className="py-24 border-t border-slate-900 bg-slate-900/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Bring Your Own Model</h2>
            <p className="text-sm text-slate-400">
              Career Agents abstracts the LLM provider. Plug in any API key or point to a local Ollama instance.
              The AI Gateway automatically handles load balancing, retries, and fallbacks.
            </p>
          </div>

          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80">
                    <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-[10px]">Provider</th>
                    <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-[10px]">Default Model</th>
                    <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-[10px]">Context Window</th>
                    <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-[10px]">Avg Latency</th>
                    <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { name: "Groq", model: "llama-3.3-70b-versatile", ctx: "8K tokens", latency: "~90ms", status: "Active" },
                    { name: "Google Gemini", model: "gemini-1.5-pro", ctx: "2M tokens", latency: "~210ms", status: "Active" },
                    { name: "Anthropic", model: "claude-3-5-sonnet", ctx: "200K tokens", latency: "~220ms", status: "Active" },
                    { name: "OpenAI", model: "gpt-4o", ctx: "128K tokens", latency: "~180ms", status: "Active" },
                    { name: "DeepSeek", model: "deepseek-coder", ctx: "64K tokens", latency: "~280ms", status: "Active" },
                    { name: "Local / Ollama", model: "llama3", ctx: "8K tokens", latency: "Local", status: "Active" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-white">{row.name}</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">{row.model}</td>
                      <td className="p-4 text-slate-400">{row.ctx}</td>
                      <td className="p-4 text-slate-400">{row.latency}</td>
                      <td className="p-4">
                        <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PRICING */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-900 bg-slate-950 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-sm text-slate-400">Host it yourself for free, or use our managed cloud for collaborative workspaces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Open Source (Self-Hosted)",
              price: "$0",
              desc: "Run Career Agents locally on your own machine. BYOK.",
              features: ["All 146 Agents", "Local SQLite DB", "MCP Server Access", "Community Support"],
              button: "View GitHub"
            },
            {
              name: "Pro Cloud",
              price: "$19",
              period: "/mo",
              desc: "Fully managed, secure cloud instance with synced profiles.",
              features: ["Everything in Open Source", "Managed PostgreSQL", "Premium Models Included", "Priority Email Support"],
              popular: true,
              button: "Start Free Trial"
            },
            {
              name: "Team Workspace",
              price: "$49",
              period: "/user/mo",
              desc: "For universities, bootcamps, and coaching cohorts.",
              features: ["Everything in Pro", "Shared Candidate Metrics", "Custom RAG Indexes", "SSO & SAML"],
              button: "Contact Sales"
            }
          ].map(plan => (
            <div
              key={plan.name}
              className={cn(
                "rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300",
                plan.popular
                  ? "bg-indigo-900/20 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/10"
                  : "bg-slate-900/30 border border-slate-800 hover:border-slate-700"
              )}
            >
              {plan.popular && (
                <span className="bg-indigo-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full absolute top-0 right-8 -translate-y-1/2">
                  Most Popular
                </span>
              )}

              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">{plan.name}</h4>
                <div className="flex items-end gap-1.5 mb-4">
                  <span className="text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-xs text-slate-500 font-medium mb-1.5">{plan.period}</span>}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-8 h-10">{plan.desc}</p>

                <ul className="space-y-4 text-xs text-slate-300 font-medium">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Button
                  className={cn(
                    "w-full text-xs py-5 rounded-xl font-bold transition-all",
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  )}
                >
                  {plan.button}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section className="py-24 border-t border-slate-900 bg-slate-900/10 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Details on architecture, security, and setup.</p>
          </div>

          <div className="space-y-3">
            {FAQS.slice(0, 6).map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden transition-colors hover:bg-slate-900/60">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between text-left text-sm font-bold text-white outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform duration-300", openFaq === idx && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
