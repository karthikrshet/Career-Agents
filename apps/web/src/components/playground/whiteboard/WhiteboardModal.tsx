"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Eraser, Pen, Circle, Square, ArrowRight, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhiteboardModal({ isOpen, onClose }: WhiteboardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<"pen" | "eraser" | "circle" | "rect" | "line">("pen");
  const [color, setColor] = useState("#38bdf8");
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 500;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0d1117";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    ctx.strokeStyle = tool === "eraser" ? "#0d1117" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : 3;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-[#0d1117] border border-border/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-card/30">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Pen className="w-4 h-4 text-sky-400" />
            <span>Interactive Data Structure Whiteboard</span>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTool("pen")}
              className={`p-2 rounded-lg border text-xs font-semibold ${tool === "pen" ? "bg-primary/20 border-primary text-primary" : "border-border/40 text-muted-foreground"}`}
              title="Pen"
            >
              <Pen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={`p-2 rounded-lg border text-xs font-semibold ${tool === "eraser" ? "bg-red-500/20 border-red-500 text-red-400" : "border-border/40 text-muted-foreground"}`}
              title="Eraser"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 pl-2 border-l border-border/40">
              {["#38bdf8", "#34d399", "#f59e0b", "#f43f5e", "#ffffff"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border ${color === c ? "scale-110 border-white" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={clearCanvas} className="h-8 text-xs gap-1 ml-2">
              <RotateCcw className="w-3 h-3" /> Clear
            </Button>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className="flex-1 relative w-full h-full">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full cursor-crosshair"
          />
        </div>
      </div>
    </div>
  );
}
