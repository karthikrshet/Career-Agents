"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "navbar" | "sidebar" | "footer" | "standalone";
  showVersion?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
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
    sm: "text-sm font-bold",
    md: "text-base font-bold",
    lg: "text-lg font-bold",
  };

  const px = iconPixelSizes[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Circular Logo Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className="rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center p-1"
          style={{ width: px, height: px }}
        >
          <Image
            src="/branding/logo.svg"
            alt="Career Agents"
            width={px - 8}
            height={px - 8}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
            priority
            onError={(e) => {
              e.currentTarget.style.display = "none";
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
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-medium rounded bg-white/[0.06] border border-white/10 text-slate-300 uppercase">
              Open Source
            </span>
          )}
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-normal">
            AI Career Intelligence Platform
          </span>
        )}
      </div>
    </Link>
  );
}
