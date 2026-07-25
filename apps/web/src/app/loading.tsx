import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse">
        <Zap className="w-6 h-6 text-white" />
      </div>
      <div className="space-y-2 text-center">
        <div className="h-1.5 w-32 bg-primary/20 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full w-16 bg-primary/70 rounded-full"
            style={{ animation: "slide 1.5s ease-in-out infinite" }}
          />
        </div>
        <p className="text-xs text-muted-foreground">Loading Career OS...</p>
      </div>
    </div>
  );
}
