"use client";

import React, { useRef, useEffect } from "react";
import agentRegistry from "../../../../../agent-registry.json";

export function HeroBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isTabVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const rawAgents = agentRegistry?.agents || [];
    const nodeCount = Math.min(90, Math.max(50, rawAgents.length));

    interface Node3D {
      x: number;
      y: number;
      z: number;
      orbitRadius: number;
      orbitSpeed: number;
      angleOffset: number;
      yOffset: number;
      ySpeed: number;
      size: number;
      color: string;
      label: string;
    }

    const nodes: Node3D[] = [];
    const themeColors = ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#60a5fa"];

    for (let i = 0; i < nodeCount; i++) {
      const orbitRadius = 180 + Math.random() * 320;
      const angleOffset = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.5;

      nodes.push({
        x: 0,
        y: 0,
        z: 0,
        orbitRadius,
        orbitSpeed: (0.0005 + Math.random() * 0.001) * (i % 2 === 0 ? 1 : -1),
        angleOffset,
        yOffset: (Math.random() - 0.5) * 350,
        ySpeed: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 1.2,
        color: themeColors[i % themeColors.length],
        label: rawAgents[i % rawAgents.length]?.name || `Agent ${i + 1}`,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let globalRotation = 0;

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      const centerX = width / 2;
      const centerY = height / 2 - 20;

      globalRotation += 0.0008;
      const tiltX = (mouse.y - centerY) * 0.0002;
      const tiltY = (mouse.x - centerX) * 0.0002;

      const projected: Array<{
        px: number;
        py: number;
        pz: number;
        size: number;
        alpha: number;
        color: string;
        label: string;
      }> = [];

      nodes.forEach((node) => {
        // Individual rotation & movement one by one
        node.angleOffset += node.orbitSpeed;
        node.yOffset += Math.sin(globalRotation * 2 + node.angleOffset) * 0.15 + node.ySpeed * 0.1;

        const currentAngle = node.angleOffset + globalRotation + tiltY;
        const x3d = Math.cos(currentAngle) * node.orbitRadius;
        const z3d = Math.sin(currentAngle) * node.orbitRadius;
        const y3d = node.yOffset + Math.sin(tiltX) * x3d;

        const fov = 380;
        const scale = fov / (fov + z3d + 300);
        const px = x3d * scale + centerX;
        const py = y3d * scale + centerY;

        const alpha = Math.max(0.12, Math.min(0.8, scale * 0.75));
        const size = Math.max(1.2, node.size * scale);

        projected.push({
          px,
          py,
          pz: z3d,
          size,
          alpha,
          color: node.color,
          label: node.label,
        });
      });

      // Sort by z-depth
      projected.sort((a, b) => a.pz - b.pz);

      // Render Connection Lines
      ctx.lineWidth = 0.45;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.22 * projected[i].alpha * projected[j].alpha;
            ctx.strokeStyle = projected[i].color;
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Render Floating 3D Nodes
      projected.forEach((p) => {
        const dx = p.px - mouse.x;
        const dy = p.py - mouse.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = mouseDist < 55;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.px, p.py, isHovered ? p.size * 2.2 : p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle Halo
        if (isHovered || Math.random() < 0.05) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.2;
          ctx.fill();
        }

        if (isHovered && p.alpha > 0.35) {
          ctx.globalAlpha = 0.95;
          ctx.font = "600 10px system-ui, sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(p.label, p.px + 8, p.py + 3);
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient Gradient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[480px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/10 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full opacity-65 pointer-events-auto" />
    </div>
  );
}
