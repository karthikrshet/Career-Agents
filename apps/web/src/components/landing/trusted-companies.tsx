"use client";

import React from "react";
import { LogoLoop } from "@/components/react-bits";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiDocker,
  SiKubernetes,
  SiRust,
  SiPostgresql,
  SiGoogle,
  SiApple,
  SiVercel,
  SiMeta,
  SiStripe,
} from "react-icons/si";
import { Bot, Sparkles, Cloud, Building2 } from "lucide-react";

export function TrustedCompanies() {
  const techLogos = [
    { node: <SiReact className="w-4 h-4 text-sky-400" />, title: "React 19" },
    { node: <SiNextdotjs className="w-4 h-4 text-white" />, title: "Next.js" },
    { node: <SiTypescript className="w-4 h-4 text-sky-300" />, title: "TypeScript" },
    { node: <SiTailwindcss className="w-4 h-4 text-sky-400" />, title: "Tailwind CSS" },
    { node: <SiPython className="w-4 h-4 text-slate-300" />, title: "Python 3.12" },
    { node: <Bot className="w-4 h-4 text-sky-400" />, title: "OpenAI API" },
    { node: <SiDocker className="w-4 h-4 text-sky-400" />, title: "Docker" },
    { node: <SiKubernetes className="w-4 h-4 text-sky-300" />, title: "Kubernetes" },
    { node: <Cloud className="w-4 h-4 text-sky-400" />, title: "AWS Cloud" },
    { node: <SiVercel className="w-4 h-4 text-white" />, title: "Vercel Edge" },
    { node: <SiRust className="w-4 h-4 text-slate-300" />, title: "Rust Engine" },
    { node: <SiPostgresql className="w-4 h-4 text-sky-400" />, title: "PostgreSQL" },
  ];

  const companyLogos = [
    { node: <SiGoogle className="w-4 h-4 text-slate-300" />, title: "Google" },
    { node: <SiMeta className="w-4 h-4 text-sky-400" />, title: "Meta" },
    { node: <SiStripe className="w-4 h-4 text-sky-300" />, title: "Stripe" },
    { node: <SiApple className="w-4 h-4 text-slate-300" />, title: "Apple" },
    { node: <Sparkles className="w-4 h-4 text-sky-400" />, title: "OpenAI" },
    { node: <Cloud className="w-4 h-4 text-sky-400" />, title: "Amazon" },
    { node: <SiVercel className="w-4 h-4 text-white" />, title: "Vercel" },
    { node: <Sparkles className="w-4 h-4 text-sky-400" />, title: "Perplexity" },
  ];

  return (
    <section className="relative py-10 sm:py-12 border-y border-white/10 bg-[#060a14] overflow-hidden z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <p className="text-[11px] sm:text-xs font-mono font-medium text-slate-400 uppercase tracking-widest">
          Calibrated For Technical Interviews &amp; Infrastructure At Leading Companies
        </p>
      </div>

      <div className="space-y-4">
        {/* Horizontal Tech Partners Loop */}
        <LogoLoop
          logos={techLogos}
          speed={45}
          direction="left"
          logoHeight={34}
          gap={36}
          hoverSpeed={10}
          scaleOnHover
          fadeOut
          fadeOutColor="#060a14"
          ariaLabel="Supported Technologies"
        />

        {/* Reverse Target Companies Loop */}
        <LogoLoop
          logos={companyLogos}
          speed={40}
          direction="right"
          logoHeight={34}
          gap={36}
          hoverSpeed={10}
          scaleOnHover
          fadeOut
          fadeOutColor="#060a14"
          ariaLabel="Target Companies"
        />
      </div>
    </section>
  );
}
