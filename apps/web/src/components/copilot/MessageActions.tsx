// apps/web/src/components/copilot/MessageActions.tsx
import { useState } from "react";
import { Copy, Volume2, RotateCcw, ThumbsUp, Check } from "lucide-react";
import { useVoice } from "@/hooks/use-voice";
import { toast } from "sonner";

interface MessageActionsProps {
  content: string;
  isAssistant: boolean;
  onRegenerate?: () => void;
}

export function MessageActions({ content, isAssistant, onRegenerate }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
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
    <div className="flex items-center gap-1 bg-card/80 border border-border/40 backdrop-blur-md rounded-lg p-0.5 shadow-sm">
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
