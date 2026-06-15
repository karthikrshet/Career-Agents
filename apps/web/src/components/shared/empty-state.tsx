"use client";

import React from "react";
import { LucideIcon, Inbox, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`p-8 sm:p-12 rounded-3xl bg-[#090d18] border border-white/10 text-center space-y-4 font-sans ${className}`}>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-fit mx-auto">
        <Icon className="w-8 h-8 text-cyan-400 opacity-85" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref} className="inline-block">
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-5 py-2 rounded-xl">
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          ) : (
            <Button onClick={onAction} size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-5 py-2 rounded-xl">
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
