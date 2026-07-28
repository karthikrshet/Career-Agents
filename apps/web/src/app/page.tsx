// apps/web/src/app/page.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, GitBranch, Link2, Mic, Bot,
  ArrowRight, Shield, Cpu, Info, CheckCircle2, ChevronRight,
  TrendingUp, Code2, Users, Star, ArrowUpRight, Zap, Play, Search,
  Terminal, Globe, Lock, Workflow, BarChart3, Package, BookOpen
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import agentRegistry from "../../../../agent-registry.json";
import { cn } from "@/lib/utils";

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

    // Node representation mapping to our 146 agents
    const nodeCount = 146;
    const nodes: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      emoji: string;
      label: string;
    }> = [];

    const emojis = ["🧾", "🧠", "🤖", "🔍", "💻", "💼", "📈", "🛡️", "🔗", "🚀", "🎯", "🎓"];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
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

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Project and draw nodes
      const fov = 350; // Camera field of view depth
      const cx = width / 2;
      const cy = height / 2;

      // Slow rotation matrices
      const angleX = 0.001 + mouseRef.current.y * 0.00002;
      const angleY = 0.0015 + mouseRef.current.x * 0.00002;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected: Array<{
        px: number;
        py: number;
        pz: number;
        size: number;
        emoji: string;
        label: string;
        alpha: number;
      }> = [];

      nodes.forEach((node) => {
        // Apply velocity bounds
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Bounce back inside virtual box
        if (Math.abs(node.x) > 300) node.vx *= -1;
        if (Math.abs(node.y) > 300) node.vy *= -1;
        if (Math.abs(node.z) > 300) node.vz *= -1;

        // Apply X-rotation
        let y1 = node.y * cosX - node.z * sinX;
        let z1 = node.z * cosX + node.y * sinX;

        // Apply Y-rotation
        let x2 = node.x * cosY - z1 * sinY;
        let z2 = z1 * cosY + node.x * sinY;

        node.x = x2;
        node.y = y1;
        node.z = z2;

        // Projection
        const scale = fov / (fov + z2 + 350);
        const px = x2 * scale + cx;
        const py = y1 * scale + cy;
        const size = Math.max(2, scale * 12);
        const alpha = Math.max(0.05, Math.min(0.8, scale));

        projected.push({ px, py, pz: z2, size, emoji: node.emoji, label: node.label, alpha });
      });

      // Draw Connection Lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.15 * projected[i].alpha * projected[j].alpha;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      projected.forEach((p, idx) => {
        ctx.fillStyle = `rgba(165, 180, 252, ${p.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Render Emojis for primary anchor nodes
        if (idx % 12 === 0 && p.alpha > 0.4) {
          ctx.font = `${Math.round(p.size * 1.5)}px sans-serif`;
          ctx.fillText(p.emoji, p.px - p.size, p.py + p.size / 2);

          // Draw micro labels for top nodes on hover proximity
          const mx = mouseRef.current.targetX + cx;
          const my = mouseRef.current.targetY + cy;
          const dx = p.px - mx;
          const dy = p.py - my;
          if (Math.sqrt(dx * dx + dy * dy) < 45) {
            ctx.font = "9px system-ui";
            ctx.fillStyle = "rgba(241, 245, 249, 0.85)";
            ctx.fillText(p.label, p.px + p.size * 1.2, p.py + 3);
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto opacity-75" />;
}

// --- Dynamic Product Browser Preview Mock Components ---
const DEMO_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Five-dimensional career metrics, pipeline summaries, action hubs." },
  { id: "resume", label: "Resume Studio", icon: FileText, desc: "Forensic ATS parsing audits, weak bullet rewriting, keyword densities." },
  { id: "copilot", label: "AI Copilot", icon: Bot, desc: "Multimodal chat workspaces with permanent memory and folder syncing." },
  { id: "interview", label: "Interview Lab", icon: Mic, desc: "Interactive company interview simulations and speech critiquing." },
  { id: "workflows", label: "Workflow Builder", icon: Workflow, desc: "Low-code node layout graph connecting 146 agent roles." }
];

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState("dashboard");
  const [agentSearch, setAgentSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");



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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans relative">
      
      {/* Aurora Radial Lighting Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-950/15 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-violet-950/10 blur-[150px] pointer-events-none" />



      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center border-b border-slate-900/60 overflow-hidden">
        {/* Animated R3F Particles Grid Simulation Canvas */}
        <NeuralNetworkCanvas />

        <div className="max-w-4xl mx-auto px-6 text-center z-10 py-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-semibold tracking-wider uppercase mb-6"
          >
            <Zap className="w-3 h-3 fill-indigo-400" />
            v8.0.0 Stable Enterprise Release
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 pointer-events-auto"
          >
            The Open Source AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400">
              Career Operating System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 pointer-events-auto"
          >
            Career Agents combines 146 specialized AI agents, Resume Intelligence, GitHub Analysis, 
            LinkedIn Optimization, Interview Preparation, Job Search, MCP, and an AI Copilot into one unified platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pointer-events-auto"
          >
            <Link href="/dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/20 px-6 py-5 rounded-lg text-xs">
                Launch Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/opensource">
              <Button variant="outline" className="border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white px-6 py-5 rounded-lg text-xs flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-400" />
                GitHub Project
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-900 text-xs px-4 py-5">
                Documentation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Sign Bar */}
      <section className="py-12 border-b border-slate-900/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-6">Trusted By Open Source Engineers and Recruiting Teams</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-center opacity-65 text-slate-400 font-semibold text-xs tracking-wider">
            <span>DEVELOPERS</span>
            <span>STUDENTS</span>
            <span>JOB SEEKERS</span>
            <span>RECRUITERS</span>
            <span>ENGINEERING TEAMS</span>
            <span>UNIVERSITIES</span>
          </div>
        </div>
      </section>

      {/* Traditional vs Career Agents */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-slate-900/60">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">A Next-Gen Career Blueprint</h2>
          <p className="text-xs sm:text-sm text-slate-400">How traditional templates compare with the active context-aware Career Agents ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-slate-900 bg-slate-950/40 p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Traditional Career Workflows</h3>
              <ul className="space-y-4 text-xs text-slate-500">
                <li className="flex items-center gap-3">❌ Static Word document templates needing manually adapted keywords</li>
                <li className="flex items-center gap-3">❌ Simulated or generic interview scripts found on public blogs</li>
                <li className="flex items-center gap-3">❌ Fragmented tools (spreadsheets for tracker, browser tabs for jobs)</li>
                <li className="flex items-center gap-3">❌ Outdated developer profiles that fail to signal GitHub activity</li>
              </ul>
            </div>
            <div className="mt-8 text-[10px] text-slate-500 font-medium">Standard search rate success: ~12% conversion</div>
          </div>

          <div className="border border-indigo-500/20 bg-indigo-500/5 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 mb-6 uppercase tracking-wider">Career Agents Platform</h3>
              <ul className="space-y-4 text-xs text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Live STAR bullet-rewriter audits matching target descriptions</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Voice-critiqued behavioral mock interview labs</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Unified App database syncing Kanban pipelines, memories, and RAGs</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Automated GitHub Analyzer building learning tracks and roadmaps</li>
              </ul>
            </div>
            <div className="mt-8 text-[10px] text-indigo-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-indigo-400" />
              Empowered target interview rate success: ~84% conversion
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Browser Demo */}
      <section className="py-20 border-b border-slate-900/60 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Explore the Interface</h2>
            <p className="text-xs sm:text-sm text-slate-400">Click the modules below to preview the responsive dashboards and diagnostic scorecards.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {DEMO_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDemo(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition",
                  activeDemo === tab.id
                    ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-400"
                    : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="border border-slate-900 bg-slate-950/60 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="bg-slate-900 px-12 py-1 rounded border border-slate-800 text-[10px] text-slate-400 select-none">
                https://career-os.dev/{activeDemo}
              </div>
              <div className="w-12" />
            </div>

            <div className="p-8 aspect-video flex items-center justify-center bg-slate-950/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">Active Module Showcase</p>
                    <h3 className="text-base font-bold text-white mb-2">{DEMO_TABS.find(t => t.id === activeDemo)?.label}</h3>
                    <p className="text-xs text-slate-400">{DEMO_TABS.find(t => t.id === activeDemo)?.desc}</p>
                  </div>
                  
                  {/* Dynamic mock graphic inside preview frame */}
                  <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
                    
                    {activeDemo === "dashboard" && (
                      <div className="space-y-4">
                        <div className="flex gap-4 justify-center">
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg w-28"><div className="text-[10px] text-slate-500 mb-1">Resume Score</div><div className="text-lg font-bold text-emerald-400">84%</div></div>
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg w-28"><div className="text-[10px] text-slate-500 mb-1">GitHub Score</div><div className="text-lg font-bold text-indigo-400">76%</div></div>
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg w-28"><div className="text-[10px] text-slate-500 mb-1">Visibility</div><div className="text-lg font-bold text-sky-400">89%</div></div>
                        </div>
                        <p className="text-[10px] text-slate-500">Live PostgreSQL aggregated metric analytics updates</p>
                      </div>
                    )}

                    {activeDemo === "resume" && (
                      <div className="max-w-md space-y-4">
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded text-left text-[11px] leading-relaxed">
                          <span className="text-rose-400 font-semibold line-through">Managed</span> database queries and <span className="text-rose-400 font-semibold line-through">worked</span> on API configurations.
                        </div>
                        <div className="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded text-left text-[11px] leading-relaxed text-indigo-200">
                          🚀 <span className="font-semibold text-indigo-300">Orchestrated</span> high-scale query pools and <span className="font-semibold text-indigo-300">stabilized</span> server-side API runtimes, achieving a 25% decrease in request latency.
                        </div>
                      </div>
                    )}

                    {activeDemo === "copilot" && (
                      <div className="space-y-3 w-full max-w-sm">
                        <div className="bg-slate-900/60 p-2.5 rounded text-left text-[11px] text-slate-400">Tell me about Google's SWE system design interview questions...</div>
                        <div className="bg-indigo-900/20 border border-indigo-500/20 p-3 rounded text-left text-[11px] space-y-2">
                          <div className="text-indigo-400 font-semibold flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" /> AI Brain Response</div>
                          <p className="text-slate-300">Here is the RAG context compiled from internal databases...</p>
                        </div>
                      </div>
                    )}

                    {activeDemo === "interview" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <Mic className="w-5 h-5 text-indigo-400 animate-pulse" />
                          <span className="text-xs text-slate-300">Analyzing speech pattern and filler words count...</span>
                        </div>
                        <div className="flex gap-2 justify-center text-[10px] text-slate-500">
                          <span>Filler rate: 1.2% (Excellent)</span>
                          <span>·</span>
                          <span>STAR signals: 92%</span>
                        </div>
                      </div>
                    )}

                    {activeDemo === "workflows" && (
                      <div className="flex gap-4 items-center">
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 text-[10px]">Resume Parse</div>
                        <ArrowRight className="w-4 h-4 text-slate-600" />
                        <div className="bg-indigo-900/20 border border-indigo-500/20 p-3 rounded text-[10px] text-indigo-300 font-semibold">AI Gateway Agent Audit</div>
                        <ArrowRight className="w-4 h-4 text-slate-600" />
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 text-[10px]">Offer Calibrator</div>
                      </div>
                    )}

                  </div>

                  <div className="mt-4 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Interactive Prototype Simulation</span>
                    <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                      Open Active App Route
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* AI Brain Architecture Pipeline */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-slate-900/60">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Orchestration Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-400">How the AI Brain routes, evaluates, and validates your career directives in real time.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "01", label: "Intent Classifier", desc: "Extracts action signals from user query inputs." },
            { id: "02", label: "Scheduler Planner", desc: "Selects and schedules specialist agent execution chains." },
            { id: "03", label: "Semantic RAG Search", desc: "Pulls matching coordinates from the hybrid vector database." },
            { id: "04", label: "Agent Execution", desc: "Runs parallel worker templates against LLM gateway endpoints." },
            { id: "05", label: "Prisma Memory Sync", desc: "Writes conversation events and state directly to Postgres." },
            { id: "06", label: "JSON Schema Validate", desc: "Confirms payload syntax satisfies target structure bounds." },
            { id: "07", label: "Gateway Failovers", msg: "Retries connections and rotates keys automatically." },
            { id: "08", label: "Stream Reasoning", desc: "Streams logs in thinking layouts before final outputs." }
          ].map(step => (
            <div key={step.id} className="border border-slate-900 bg-slate-950/40 p-6 rounded-xl flex flex-col justify-between">
              <span className="text-xs font-bold text-indigo-500 mb-4">{step.id}</span>
              <div>
                <h4 className="text-xs font-bold text-white mb-2">{step.label}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{step.desc || step.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 146 AI Agents Section */}
      <section className="py-20 bg-slate-950/40 border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ecosystem Directory</h2>
              <p className="text-xs sm:text-sm text-slate-400">Explore the list of the 146 specialist agents running concurrently inside the dashboard.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-700 w-44"
                />
              </div>

              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredAgents.map(agent => (
              <div key={agent.id} className="border border-slate-900/80 bg-slate-950/40 p-5 rounded-xl flex flex-col justify-between hover:border-slate-800 transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base">{agent.emoji || "🤖"}</span>
                    <span className="text-[9px] uppercase tracking-wider text-indigo-500 font-semibold bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/10">{agent.division}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5">{agent.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{agent.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Vibe: {agent.vibe?.split(",")[0] || "analytical"}</span>
                  <span className="text-indigo-400 font-medium">Ready</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/about">
              <Button variant="ghost" className="text-xs text-slate-400 hover:text-white hover:bg-slate-900">
                View Full Registry Validator Directory
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-slate-900/60">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Flexible SaaS Pricing Plans</h2>
          <p className="text-xs sm:text-sm text-slate-400">Scale feature limits as your career goals progress. Start free in guest mode.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              name: "Free / Guest",
              price: "$0",
              desc: "Quick audits with zero credentials required.",
              features: ["3 ATS Resume evaluations", "1 GitHub profile audit", "Basic gateway models", "Community support"]
            },
            {
              name: "Professional",
              price: "$29",
              desc: "For active candidates seeking targeted interview callbacks.",
              features: ["Unlimited resume evaluations", "Unlimited GitHub audits", "Full models (Claude, GPT)", "Advanced STAR checklists"],
              popular: true
            },
            {
              name: "Team Workspace",
              price: "$79",
              desc: "Shared metrics for cohorts, universities, and bootcamps.",
              features: ["Everything in Pro plan", "Shared candidate cohort lists", "Private RAG knowledge base", "Collaborative scoring cards"]
            },
            {
              name: "Enterprise SLA",
              price: "Custom",
              desc: "Custom deployment channels for massive scaling.",
              features: ["Everything in Team plan", "Dedicated private cloud DBs", "SSO & SAML integration", "Dedicated SLAs & support contracts"]
            }
          ].map(plan => (
            <div
              key={plan.name}
              className={cn(
                "border rounded-2xl p-6 flex flex-col justify-between relative",
                plan.popular
                  ? "border-indigo-500 bg-indigo-950/10 shadow-lg shadow-indigo-600/5"
                  : "border-slate-900 bg-slate-950/40"
              )}
            >
              {plan.popular && (
                <span className="bg-indigo-600 text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full absolute top-0 right-6 -translate-y-1/2">
                  Most Popular
                </span>
              )}
              
              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-[10px] text-slate-500">/mo</span>}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-6">{plan.desc}</p>
                
                <ul className="space-y-3 text-[10px] text-slate-400">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/pricing">
                  <Button
                    className={cn(
                      "w-full text-xs py-2 rounded-lg font-semibold transition",
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
}
