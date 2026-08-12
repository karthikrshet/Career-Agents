"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Terminal, Layers } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon?: React.ReactNode;
  tag?: string;
  gradient?: string;
}

export interface CircularGalleryProps {
  items?: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollEase?: number;
  className?: string;
}

const defaultItems: GalleryItem[] = [
  {
    id: "1",
    title: "AI Engineering Division",
    category: "LLM & System Architecture",
    description: "18 Autonomous Agents for RAG, Fine-Tuning & Quantization pipelines.",
    icon: <Cpu className="w-6 h-6 text-cyan-400" />,
    tag: "18 Agents",
    gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
  },
  {
    id: "2",
    title: "FAANG & Principal Prep",
    category: "System Design & Leadership",
    description: "16 Agents tailored for L6/E6+ Google, Meta, Apple and Stripe technical tracks.",
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    tag: "16 Agents",
    gradient: "from-purple-500/20 via-pink-600/10 to-transparent",
  },
  {
    id: "3",
    title: "Cybersecurity & AppSec",
    category: "Cloud Security & Threat Modeling",
    description: "14 Agents analyzing zero-trust IAM, OWASP Top 10, and DevSecOps architecture.",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    tag: "14 Agents",
    gradient: "from-emerald-500/20 via-teal-600/10 to-transparent",
  },
  {
    id: "4",
    title: "Data & ML Platform",
    category: "Distributed Streaming & ETL",
    description: "15 Agents mastering Kafka, Spark, dbt, Snowflake and Feature Stores.",
    icon: <Layers className="w-6 h-6 text-amber-400" />,
    tag: "15 Agents",
    gradient: "from-amber-500/20 via-orange-600/10 to-transparent",
  },
  {
    id: "5",
    title: "MCP & Tool Integration",
    category: "Model Context Protocol",
    description: "Universal server connectivity across Cursor, Claude Code, Windsurf & Antigravity.",
    icon: <Terminal className="w-6 h-6 text-sky-400" />,
    tag: "Open Standard",
    gradient: "from-sky-500/20 via-indigo-600/10 to-transparent",
  },
];

export default function CircularGallery({
  items = defaultItems,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 16,
  scrollEase = 0.05,
  className = "",
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const lastRotRef = useRef(0);
  const targetRotRef = useRef(0);

  const total = items.length;
  const anglePerItem = 360 / total;
  const radius = 320;

  useEffect(() => {
    let animId: number;
    const update = () => {
      setRotation((prev) => {
        const next = prev + (targetRotRef.current - prev) * scrollEase;
        return next;
      });
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [scrollEase]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    lastRotRef.current = targetRotRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startXRef.current;
    targetRotRef.current = lastRotRef.current + delta * 0.35;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const rotateBy = (step: number) => {
    targetRotRef.current += step * anglePerItem;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full h-[520px] flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing perspective-[1200px] ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* 3D Cylinder Carousel */}
      <div
        className="relative w-[320px] h-[380px] transform-style-preserve-3d transition-transform ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {items.map((item, index) => {
          const itemAngle = index * anglePerItem;

          return (
            <div
              key={item.id}
              className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between border border-white/10 bg-[#070d1e]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400/60 group"
              style={{
                borderRadius: `${borderRadius}px`,
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              {/* Card Gradient Background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${
                  item.gradient || "from-cyan-500/15 via-transparent to-transparent"
                } opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  {item.tag && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {item.tag}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
                  {item.category}
                </p>
                <h3
                  className="text-lg font-bold tracking-tight mb-2 group-hover:text-cyan-200 transition-colors"
                  style={{ color: textColor }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                <span className="font-medium">Explore Agents</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 flex items-center gap-3 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            rotateBy(1);
          }}
          className="p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white transition-all backdrop-blur-md"
          aria-label="Previous card"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
        <span className="text-xs font-mono text-slate-400">Drag or click to spin</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            rotateBy(-1);
          }}
          className="p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white transition-all backdrop-blur-md"
          aria-label="Next card"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
