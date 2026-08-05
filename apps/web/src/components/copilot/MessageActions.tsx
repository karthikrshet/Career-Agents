// apps/web/src/components/copilot/MessageActions.tsx
import { useState } from "react";
import { Copy, Volume2, RotateCcw, ThumbsUp, Check, Download, ChevronDown } from "lucide-react";
import { useVoice } from "@/hooks/use-voice";
import { toast } from "sonner";

interface MessageActionsProps {
  content: string;
  isAssistant: boolean;
  onRegenerate?: () => void;
  onExport?: (type: string) => void;
}

export function MessageActions({ content, isAssistant, onRegenerate, onExport }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { speak } = useVoice();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Message copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    // Strip markdown formatting before speaking
    const plainText = content.replace(/[*#`_\-]/g, "");
    speak(plainText);
    toast.info("Speaking response...");
  };

  return (
    <div className="flex items-center gap-1 bg-card/80 border border-border/40 backdrop-blur-md rounded-lg p-0.5 shadow-sm relative">
      <button
        onClick={handleCopy}
        className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded transition-colors"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>

      {isAssistant && (
        <button
          onClick={handleSpeak}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded transition-colors"
          title="Read aloud"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      )}

      {isAssistant && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded transition-colors"
          title="Regenerate response"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}

      {isAssistant && onExport && (
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded transition-colors flex items-center gap-0.5"
            title="Export response as file"
          >
            <Download className="w-3.5 h-3.5" />
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>
          {showExportMenu && (
            <div className="absolute bottom-full left-0 mb-1 w-32 bg-card border border-border/60 rounded-xl p-1 shadow-xl z-50 text-[10px] space-y-0.5 animate-in fade-in zoom-in-95">
              <button
                onClick={() => { onExport("pdf"); setShowExportMenu(false); }}
                className="w-full px-2 py-1 text-left rounded hover:bg-secondary flex items-center gap-1.5 text-foreground"
              >
                <span>📄</span> PDF Document
              </button>
              <button
                onClick={() => { onExport("docx"); setShowExportMenu(false); }}
                className="w-full px-2 py-1 text-left rounded hover:bg-secondary flex items-center gap-1.5 text-foreground"
              >
                <span>📝</span> Word (DOCX)
              </button>
              <button
                onClick={() => { onExport("csv"); setShowExportMenu(false); }}
                className="w-full px-2 py-1 text-left rounded hover:bg-secondary flex items-center gap-1.5 text-foreground"
              >
                <span>📊</span> Spreadsheet (CSV)
              </button>
              <button
                onClick={() => { onExport("md"); setShowExportMenu(false); }}
                className="w-full px-2 py-1 text-left rounded hover:bg-secondary flex items-center gap-1.5 text-foreground"
              >
                <span>📑</span> Markdown (.md)
              </button>
              <button
                onClick={() => { onExport("json"); setShowExportMenu(false); }}
                className="w-full px-2 py-1 text-left rounded hover:bg-secondary flex items-center gap-1.5 text-foreground"
              >
                <span>⚙️</span> JSON Data
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setLiked(!liked)}
        className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded transition-colors"
        title="Like response"
      >
        <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "text-primary fill-primary/10" : ""}`} />
      </button>
    </div>
  );
}

