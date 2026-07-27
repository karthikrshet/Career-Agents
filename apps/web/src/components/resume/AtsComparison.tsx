// apps/web/src/components/resume/AtsComparison.tsx
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Copy, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AtsComparisonProps {
  originalBullets: string[];
  optimizedBullets: string[];
  onApplyOptimized?: () => void;
}

export function AtsComparison({ originalBullets, optimizedBullets, onApplyOptimized }: AtsComparisonProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getMetricCount = (text: string) => {
    // Simple regex to extract numbers/percentages as metrics
    const matches = text.match(/\b\d+(?:%|\s*percent|x|\s*billion|\s*million|\s*k)?\b/gi);
    return matches ? matches.length : 0;
  };

  const getActionVerbsCount = (text: string) => {
    // Basic software action verbs list
    const verbs = [
      "designed", "developed", "built", "implemented", "spearheaded", "orchestrated",
      "optimized", "improved", "reduced", "led", "architected", "managed", "created",
      "decreased", "increased", "saved", "resolved", "automated", "scaled", "modernized"
    ];
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(w => verbs.includes(w)).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            ATS Impact Comparison
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Compare original resume highlights with AI-optimized versions showing action-oriented structure and quantitative metrics.
          </p>
        </div>
        {onApplyOptimized && (
          <button
            onClick={onApplyOptimized}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Apply All Rewrites
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Original Bullets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Original Highlights</span>
            <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" /> Passive phrasing
            </span>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {originalBullets.map((bullet, i) => (
              <div key={`orig-${i}`} className="p-3.5 bg-secondary/10 border border-border/30 rounded-xl space-y-2 text-xs text-muted-foreground hover:border-border/60 transition-all leading-relaxed">
                <p className="italic">"{bullet}"</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60 border-t border-border/10 pt-2 flex-wrap">
                  <span className="flex items-center gap-1 font-mono">📊 Metrics: {getMetricCount(bullet)}</span>
                  <span className="flex items-center gap-1 font-mono">⚡ Verbs: {getActionVerbsCount(bullet)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Optimized Bullets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">AI Optimized (STAR Format)</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> High impact keywords
            </span>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {optimizedBullets.map((bullet, i) => (
              <div key={`opt-${i}`} className="p-3.5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-2 text-xs text-foreground hover:border-indigo-500/30 transition-all leading-relaxed">
                <p className="font-medium">"{bullet}"</p>
                <div className="flex items-center justify-between border-t border-border/10 pt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-[10px] text-indigo-300 font-mono">
                    <span className="flex items-center gap-1">📈 Metrics: {getMetricCount(bullet)}</span>
                    <span className="flex items-center gap-1">⚡ Verbs: {getActionVerbsCount(bullet)}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bullet, i)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedIndex === i ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
