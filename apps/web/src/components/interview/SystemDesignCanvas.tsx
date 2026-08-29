"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Server, Database, HardDrive, Cpu, Radio, Shield,
  Layers, Plus, Trash2, Zap, Play, CheckCircle2,
  AlertTriangle, RefreshCw, BarChart2, Activity, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ArchitectureNode {
  id: string;
  type: "lb" | "service" | "cache" | "sql" | "nosql" | "queue" | "storage" | "cdn";
  label: string;
  x: number;
  y: number;
  specs?: string;
}

export interface ArchitectureLink {
  id: string;
  from: string;
  to: string;
  label?: string;
}

const COMPONENT_PALETTE = [
  { type: "cdn" as const, label: "Cloudflare CDN", icon: Shield, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { type: "lb" as const, label: "Nginx Load Balancer", icon: Radio, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { type: "service" as const, label: "Go / Node API Service", icon: Cpu, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { type: "cache" as const, label: "Redis Cluster Cache", icon: Zap, color: "text-red-400 bg-red-500/10 border-red-500/30" },
  { type: "sql" as const, label: "PostgreSQL Master/Replica", icon: Database, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
  { type: "nosql" as const, label: "DynamoDB Sharded", icon: Layers, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { type: "queue" as const, label: "Apache Kafka Stream", icon: Server, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  { type: "storage" as const, label: "Amazon S3 Blob Store", icon: HardDrive, color: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
];

export function SystemDesignCanvas({
  onArchitectureChange,
}: {
  onArchitectureChange?: (nodes: ArchitectureNode[], links: ArchitectureLink[]) => void;
}) {
  const [nodes, setNodes] = useState<ArchitectureNode[]>([
    { id: "n1", type: "cdn", label: "Edge CDN", x: 60, y: 120, specs: "Edge Cache (95% hit rate)" },
    { id: "n2", type: "lb", label: "Layer 7 Load Balancer", x: 260, y: 120, specs: "Round Robin / SSL Termination" },
    { id: "n3", type: "service", label: "Core API Cluster", x: 480, y: 120, specs: "Stateless Microservices (10x Nodes)" },
    { id: "n4", type: "cache", label: "Redis Read Cache", x: 700, y: 50, specs: "LRU Eviction (Sub-ms latency)" },
    { id: "n5", type: "sql", label: "Primary DB + Read Replicas", x: 700, y: 200, specs: "Postgres ACID (B-Tree indexed)" },
  ]);

  const [links, setLinks] = useState<ArchitectureLink[]>([
    { id: "l1", from: "n1", to: "n2", label: "HTTPS / 443" },
    { id: "l2", from: "n2", to: "n3", label: "gRPC" },
    { id: "l3", from: "n3", to: "n4", label: "Cache Read" },
    { id: "l4", from: "n3", to: "n5", label: "Write-Through" },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  // Scalability estimation states
  const [dauMillions, setDauMillions] = useState(10);
  const [readRatio, setReadRatio] = useState(90);

  // Real-time capacity formulas
  const totalDailyQueries = dauMillions * 1000000 * 50; // 50 actions/user/day
  const avgQPS = Math.round(totalDailyQueries / 86400);
  const peakQPS = avgQPS * 3;
  const readQPS = Math.round((peakQPS * readRatio) / 100);
  const writeQPS = peakQPS - readQPS;
  const storageGrowthGBMonth = Math.round(((dauMillions * 1000000 * 10 * 2000) / (1024 * 1024 * 1024)) * 30);

  function addNode(type: ArchitectureNode["type"], label: string) {
    const newNode: ArchitectureNode = {
      id: `n_${Date.now()}`,
      type,
      label,
      x: 350 + (nodes.length % 4) * 40,
      y: 100 + (nodes.length % 3) * 50,
      specs: "Configured node",
    };
    const updated = [...nodes, newNode];
    setNodes(updated);
    if (onArchitectureChange) onArchitectureChange(updated, links);
  }

  function removeNode(id: string) {
    const updatedNodes = nodes.filter((n) => n.id !== id);
    const updatedLinks = links.filter((l) => l.from !== id && l.to !== id);
    setNodes(updatedNodes);
    setLinks(updatedLinks);
    if (selectedNodeId === id) setSelectedNodeId(null);
    if (onArchitectureChange) onArchitectureChange(updatedNodes, updatedLinks);
  }

  function handleNodeClick(id: string) {
    if (connectingFromId) {
      if (connectingFromId !== id) {
        const newLink: ArchitectureLink = {
          id: `l_${Date.now()}`,
          from: connectingFromId,
          to: id,
          label: "Data Stream",
        };
        const updated = [...links, newLink];
        setLinks(updated);
        if (onArchitectureChange) onArchitectureChange(nodes, updated);
      }
      setConnectingFromId(null);
    } else {
      setSelectedNodeId(id);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Architecture Palette & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/30 rounded-xl border border-border/50">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            System Design Palette
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {COMPONENT_PALETTE.map((comp) => {
            const Icon = comp.icon;
            return (
              <button
                key={comp.type}
                onClick={() => addNode(comp.type, comp.label)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all hover:scale-105",
                  comp.color
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>+ {comp.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Drag & Connect Canvas */}
      <div className="relative w-full h-[380px] bg-[#02050f] rounded-2xl border border-border/60 overflow-hidden shadow-inner flex flex-col">
        {/* Canvas Background Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {links.map((link) => {
            const fromNode = nodes.find((n) => n.id === link.from);
            const toNode = nodes.find((n) => n.id === link.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 90;
            const y1 = fromNode.y + 35;
            const x2 = toNode.x + 90;
            const y2 = toNode.y + 35;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={link.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse opacity-80"
                />
                <circle cx={x2} cy={y2} r="4" fill="#38bdf8" />
                {link.label && (
                  <text
                    x={midX}
                    y={midY - 8}
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono bg-black"
                  >
                    {link.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Nodes */}
        <div className="relative w-full h-full z-10 p-4">
          {nodes.map((node) => {
            const paletteItem = COMPONENT_PALETTE.find((c) => c.type === node.type);
            const Icon = paletteItem?.icon || Server;
            const isSelected = selectedNodeId === node.id;
            const isConnecting = connectingFromId === node.id;

            return (
              <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  setNodes((prev) =>
                    prev.map((n) =>
                      n.id === node.id
                        ? { ...n, x: Math.max(10, n.x + info.offset.x), y: Math.max(10, n.y + info.offset.y) }
                        : n
                    )
                  );
                }}
                onClick={() => handleNodeClick(node.id)}
                style={{
                  position: "absolute",
                  left: node.x,
                  top: node.y,
                }}
                className={cn(
                  "w-[180px] p-2.5 rounded-xl border bg-slate-900/90 backdrop-blur-md shadow-lg cursor-grab active:cursor-grabbing transition-all select-none",
                  isSelected ? "border-cyan-400 ring-2 ring-cyan-400/20" : "border-border/80 hover:border-cyan-500/40",
                  isConnecting && "ring-2 ring-amber-400 animate-pulse"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-100 truncate">{node.label}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(node.id);
                    }}
                    className="text-slate-400 hover:text-red-400 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {node.specs && (
                  <p className="text-[10px] text-slate-400 font-mono truncate">{node.specs}</p>
                )}

                {/* Connection button */}
                <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1 text-[10px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConnectingFromId(node.id);
                    }}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <ArrowRight className="w-2.5 h-2.5" />
                    Connect
                  </button>
                  <span className="text-slate-500">{node.type.toUpperCase()}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Real-time Capacity Estimation & Back-of-the-envelope Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="glass border-cyan-500/20">
          <CardContent className="p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Target Scale (DAU)</span>
              <span className="font-bold text-cyan-400">{dauMillions}M Users</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={dauMillions}
              onChange={(e) => setDauMillions(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </CardContent>
        </Card>

        <Card className="glass border-violet-500/20">
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Calculated Peak Read QPS</p>
            <p className="text-xl font-bold text-violet-400 mt-0.5">{readQPS.toLocaleString()} req/s</p>
            <p className="text-[10px] text-slate-400">90% cached at CDN & Redis</p>
          </CardContent>
        </Card>

        <Card className="glass border-amber-500/20">
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Calculated Write QPS</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{writeQPS.toLocaleString()} req/s</p>
            <p className="text-[10px] text-slate-400">Kafka queue + DB partition</p>
          </CardContent>
        </Card>

        <Card className="glass border-emerald-500/20">
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Est. Monthly Storage Growth</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{storageGrowthGBMonth.toLocaleString()} GB/mo</p>
            <p className="text-[10px] text-slate-400">S3 blob & cold compression</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
