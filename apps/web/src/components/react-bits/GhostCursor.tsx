"use client";

import React, { useRef, useEffect } from "react";

export interface GhostCursorProps {
  color?: string;
  brightness?: number;
  edgeIntensity?: number;
  trailLength?: number;
  inertia?: number;
  grainIntensity?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  className?: string;
}

export default function GhostCursor({
  color = "#38bdf8",
  brightness = 1,
  trailLength = 40,
  inertia = 0.45,
  bloomStrength = 0.2,
  fadeDelayMs = 1000,
  fadeDurationMs = 1200,
  className = "",
}: GhostCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Point {
      x: number;
      y: number;
      age: number;
      size: number;
    }

    const trail: Point[] = [];
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      lastMoveTime: performance.now(),
      hasMoved: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.lastMoveTime = performance.now();
      mouse.hasMoved = true;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * inertia;
      mouse.y += (mouse.targetY - mouse.y) * inertia;

      const idleTime = time - mouse.lastMoveTime;
      let opacityFactor = 1;
      if (idleTime > fadeDelayMs) {
        opacityFactor = Math.max(0, 1 - (idleTime - fadeDelayMs) / fadeDurationMs);
      }

      if (mouse.hasMoved && opacityFactor > 0.01) {
        trail.unshift({
          x: mouse.x,
          y: mouse.y,
          age: 0,
          size: 14 * brightness,
        });
      }

      if (trail.length > trailLength) {
        trail.pop();
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.age += 1;
        const progress = i / trail.length;
        const alpha = (1 - progress) * 0.45 * opacityFactor;
        const currentSize = p.size * (1 - progress * 0.7);

        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15 * bloomStrength * (1 - progress);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, brightness, trailLength, inertia, bloomStrength, fadeDelayMs, fadeDurationMs]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 ${className}`}
    />
  );
}
