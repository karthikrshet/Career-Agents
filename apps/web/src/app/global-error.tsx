"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Career Agents] Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070d1f] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            A critical error occurred in Career Agents. This has been logged automatically.
          </p>
          {error?.message && (
            <div className="w-full text-left bg-slate-950 border border-slate-900 rounded-lg p-3 text-xs font-mono mb-4 text-red-400 max-h-40 overflow-y-auto">
              <span className="font-bold block text-slate-500 mb-1">Diagnostics:</span>
              {error.message}
            </div>
          )}
          {error?.digest && (
            <span className="block mb-6 font-mono text-[10px] text-gray-500">
              Request ID / Digest: {error.digest}
            </span>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <a
              href="/contact"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Support
            </a>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Home className="w-4 h-4" /> Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
