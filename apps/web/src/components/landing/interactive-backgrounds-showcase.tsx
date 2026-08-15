"use client";

import React, { useState } from "react";
import {
  Scanner,
  GradientWaves,
  PixelBlast,
  DarkVeil,
  Antigravity,
  GradientText,
} from "@/components/react-bits";
import { Sparkles, Eye, Sliders, Play, Layers } from "lucide-react";

export function InteractiveBackgroundsShowcase() {
  const [activeShader, setActiveShader] = useState<
    "scanner" | "waves" | "pixel" | "veil" | "antigravity"
  >("scanner");

  const shaders = [
    {
      id: "scanner",
      name: "Cyber Scanner",
      desc: "Futuristic laser line sweep with grid crosshair telemetry",
    },
    {
      id: "waves",
      name: "Gradient Waves",
      desc: "Fluid undulating multi-layered wave physics with turbulence",
    },
    {
      id: "pixel",
      name: "Pixel Blast",
      desc: "Bayer dithered particle matrix with interactive ripples",
    },
    {
      id: "veil",
      name: "Dark Veil",
      desc: "Atmospheric drifting volumetric nebula & starlight mesh",
    },
    {
      id: "antigravity",
      name: "3D Antigravity",
      desc: "Magnetic sphere particle physics with cursor gravitational pull",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
          <Layers className="w-3.5 h-3.5" /> Real-time React Bits Canvas Engine
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Interactive{" "}
          <GradientText
            colors={["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#38bdf8"]}
            animationSpeed={5}
            className="inline-flex"
          >
            Shader &amp; Background Studio
          </GradientText>
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Switch between high-performance WebGL &amp; Canvas shaders built into the Career Agents architecture.
        </p>
      </div>

      {/* Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {shaders.map((s) => {
          const isActive = activeShader === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveShader(s.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-105"
                  : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/10"
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Live Interactive Stage */}
      <div className="relative h-[480px] rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#030712] shadow-[0_0_90px_rgba(56,189,248,0.15)] flex flex-col justify-between p-8">
        {/* Render Selected Shader Background */}
        {activeShader === "scanner" && (
          <Scanner
            color1="#38bdf8"
            color2="#818cf8"
            color3="#c084fc"
            speed={0.6}
            sweepSpeed={0.35}
            glow={0.3}
            scanDirection="vertical"
            scanline={true}
          />
        )}
        {activeShader === "waves" && (
          <GradientWaves
            horizonColor="#030712"
            waveColor="#1e1b4b"
            crestColor="#38bdf8"
            speed={0.45}
            amplitude={3}
            waveScale={0.7}
            swell={45}
            turbulence={25}
            grain={true}
          />
        )}
        {activeShader === "pixel" && (
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#38bdf8"
            enableRipples={true}
            rippleSpeed={0.5}
            speed={0.7}
          />
        )}
        {activeShader === "veil" && (
          <DarkVeil
            glowColor1="#0ea5e9"
            glowColor2="#6366f1"
            glowColor3="#a855f7"
          />
        )}
        {activeShader === "antigravity" && (
          <Antigravity
            count={240}
            magnetRadius={7}
            ringRadius={8}
            waveSpeed={0.4}
            waveAmplitude={1.3}
            particleSize={1.6}
            lerpSpeed={0.05}
            color="#38bdf8"
            autoAnimate={true}
          />
        )}

        {/* Foreground Telemetry HUD */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            LIVE_CANVAS_RENDER: {activeShader.toUpperCase()}
          </div>
          <div className="text-xs font-mono text-slate-400 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            Interactive: Move cursor / Click to pulse
          </div>
        </div>

        <div className="relative z-10 max-w-md bg-black/60 border border-white/10 backdrop-blur-xl p-5 rounded-2xl">
          <h4 className="text-sm font-bold text-white mb-1">
            {shaders.find((s) => s.id === activeShader)?.name}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {shaders.find((s) => s.id === activeShader)?.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
