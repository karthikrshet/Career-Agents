import { Search, Home, ArrowLeft, Bot } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist in Career OS.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center select-none">
      {/* Decorative glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-600/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-sky-400/60" />
        </div>

        <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-indigo-500 mb-4 leading-none">
          404
        </p>
        <h1 className="text-xl font-bold mb-3 text-foreground">Page Not Found</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist in Career OS. 
          It may have been moved, deleted, or you might have mistyped the URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </a>
          <a
            href="/copilot"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors border border-border"
          >
            <Bot className="w-4 h-4" /> Ask Copilot
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground/60">
            Career OS v2.5.0 · 146 AI Career Agents
          </p>
        </div>
      </div>
    </div>
  );
}
