// apps/web/src/components/copilot/ChatExport.tsx
import { useState } from "react";
import { Download, Share2, Clipboard, Check, X, FileText, Code } from "lucide-react";
import { toast } from "sonner";

interface ChatExportProps {
  isOpen: boolean;
  onClose: () => void;
  messages: any[];
  title: string;
}

export function ChatExport({ isOpen, onClose, messages, title }: ChatExportProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "-")}-chat.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Chat exported as JSON");
  };

  const exportAsMarkdown = () => {
    let md = `# ${title}\n\n`;
    messages.forEach((msg) => {
      const roleName = msg.role === "user" ? "Candidate" : "Career Copilot";
      md += `### **${roleName}** (${new Date(msg.timestamp).toLocaleTimeString()})\n\n${msg.content}\n\n---\n\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "-")}-chat.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Chat exported as Markdown");
  };

  const handleShare = () => {
    // Generate a simulated public sharing URL
    const mockShareUrl = `${window.location.origin}/copilot/share/${Math.random().toString(36).slice(2, 10)}`;
    navigator.clipboard.writeText(mockShareUrl);
    setCopiedLink(true);
    toast.success("Share link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass border border-border/60 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            Export & Share Conversation
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary/60 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          <button
            onClick={exportAsMarkdown}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left text-xs font-semibold"
          >
            <FileText className="w-5 h-5 text-sky-400" />
            <div>
              <p className="text-foreground">Export as Markdown</p>
              <p className="text-[10px] text-muted-foreground font-normal">Saves as .md formatting with timestamps</p>
            </div>
          </button>

          <button
            onClick={exportAsJSON}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left text-xs font-semibold"
          >
            <Code className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-foreground">Export as JSON</p>
              <p className="text-[10px] text-muted-foreground font-normal">Saves as raw chat history array</p>
            </div>
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left text-xs font-semibold"
          >
            <Share2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-foreground">Get Share Link</p>
              <p className="text-[10px] text-muted-foreground font-normal">
                {copiedLink ? "Link copied!" : "Generates static snap share link"}
              </p>
            </div>
            {copiedLink && <Check className="w-4 h-4 text-emerald-400 ml-auto" />}
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/30 bg-secondary/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
