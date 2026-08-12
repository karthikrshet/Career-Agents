"use client";

import React, { useRef, useEffect } from "react";

export interface SplashCursorProps {
  className?: string;
  colors?: string[];
  maxRipples?: number;
}

export default function SplashCursor({
  className = "",
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#f472b6"],
  maxRipples = 15,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Splash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      color: string;
      alpha: number;
      speed: number;
      lineWidth: number;
    }

    const splashes: Splash[] = [];
    let lastPos = { x: -1, y: -1 };

    const addSplash = (x: number, y: number, isClick = false) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      splashes.push({
        x,
        y,
        radius: isClick ? 12 : 6,
        maxRadius: isClick ? 120 : 50,
        color,
        alpha: isClick ? 0.9 : 0.45,
        speed: isClick ? 4 : 2,
        lineWidth: isClick ? 2.5 : 1.2,
      });

      if (splashes.length > maxRipples) {
        splashes.shift();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastPos.x, e.clientY - lastPos.y);
      if (dist > 35) {
        addSplash(e.clientX, e.clientY, false);
        lastPos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleClick = (e: MouseEvent) => {
      addSplash(e.clientX, e.clientY, true);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.radius += s.speed;
        s.alpha = Math.max(0, s.alpha - 0.02);

        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.lineWidth;
        ctx.globalAlpha = s.alpha;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [colors, maxRipples]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
    />
  );
}
