"use client";

import React, { useRef, useEffect } from "react";

export interface DarkVeilProps {
  className?: string;
  glowColor1?: string;
  glowColor2?: string;
  glowColor3?: string;
}

export default function DarkVeil({
  className = "",
  glowColor1 = "#0ea5e9",
  glowColor2 = "#6366f1",
  glowColor3 = "#a855f7",
}: DarkVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      // Base Dark Fill
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Drifting Glowing Orbs / Veils
      const orbs = [
        {
          x: width * 0.3 + Math.sin(time) * 120,
          y: height * 0.35 + Math.cos(time * 0.8) * 80,
          radius: Math.min(width, height) * 0.45,
          color: glowColor1,
          alpha: 0.12,
        },
        {
          x: width * 0.7 + Math.cos(time * 0.7) * 140,
          y: height * 0.6 + Math.sin(time * 0.9) * 90,
          radius: Math.min(width, height) * 0.5,
          color: glowColor2,
          alpha: 0.1,
        },
        {
          x: width * 0.5 + Math.sin(time * 1.1) * 100,
          y: height * 0.8 + Math.cos(time * 0.6) * 70,
          radius: Math.min(width, height) * 0.35,
          color: glowColor3,
          alpha: 0.08,
        },
      ];

      orbs.forEach((orb) => {
        ctx.save();
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        grad.addColorStop(0, orb.color);
        grad.addColorStop(0.5, `${orb.color}33`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.globalAlpha = orb.alpha;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Subtle Starlight Dust
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i * 99 + time * 0.2) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 33 + time * 0.15) * 0.5 + 0.5) * height;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [glowColor1, glowColor2, glowColor3]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
