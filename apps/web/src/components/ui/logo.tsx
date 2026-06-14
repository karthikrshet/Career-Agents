"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "navbar" | "sidebar" | "footer" | "standalone";
  showVersion?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  variant = "standalone",
  showVersion = false,
  showTagline = false,
  className = "",
}: LogoProps) {
  const iconPixelSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const textSizes = {
    sm: "text-xs sm:text-sm font-bold",
    md: "text-sm sm:text-base font-extrabold",
    lg: "text-lg sm:text-xl font-extrabold",
  };

  const px = iconPixelSizes[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Circular Glowing Logo Graphic */}
      <div className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
        <div
          className="rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          style={{ width: px, height: px }}
        >
          <Image
            src="/branding/logo.svg"
            alt="Career Agents"
            width={px}
            height={px}
            style={{ width: px, height: px }}
            className="object-contain"
            priority
            onError={(e) => {
              // Fallback to vector icon if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`tracking-tight text-white group-hover:text-cyan-300 transition-colors ${textSizes[size]}`}>
            Career Agents
          </span>
          {showVersion && (
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 uppercase tracking-wider">
              OPEN SOURCE
            </span>
          )}
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            v16.0 • AI Career OS
          </span>
        )}
      </div>
    </Link>
  );
}
