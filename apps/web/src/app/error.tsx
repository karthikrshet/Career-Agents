"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Career OS] Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Page Error</h1>
      <p className="text-sm text-muted-foreground mb-1 max-w-md leading-relaxed">
        Something went wrong loading this page. The error has been logged.
      </p>
      {error?.digest && (
        <p className="text-xs font-mono text-muted-foreground/60 mb-6">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Button onClick={reset} size="sm" className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </Button>
        <Button
          onClick={() => window.history.back()}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Go Back
        </Button>
        <Button asChild size="sm" variant="ghost">
          <a href="/" className="flex items-center gap-2">
            <Home className="w-3.5 h-3.5" /> Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
}
