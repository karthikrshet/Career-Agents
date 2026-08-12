"use client";

import React, { useRef, useEffect } from "react";

export interface ScannerProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepFalloff?: number;
  scale?: number;
  frequency?: number;
  ripple?: number;
  bandDensity?: number;
  lineSharpness?: number;
  glow?: number;
  scanDirection?: "vertical" | "horizontal";
  colorSpread?: number;
  brightness?: number;
  contrast?: number;
  softness?: number;
  vignette?: number;
  scanline?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
  className?: string;
}

export default function Scanner({
  color1 = "#38bdf8",
  color2 = "#818cf8",
  color3 = "#c084fc",
  speed = 0.5,
  sweepSpeed = 0.35,
  glow = 0.25,
  scanDirection = "vertical",
  scanline = true,
  opacity = 0.8,
  mouseInteraction = true,
  className = "",
}: ScannerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const mouse = {
      x: -9999,
      y: -9999,
      isHovered: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const parent = canvas.parentElement || window;
    parent.addEventListener("mousemove", handleMouseMove as EventListener);
    parent.addEventListener("mouseleave", handleMouseLeave as EventListener);
    window.addEventListener("resize", handleResize);

    let sweepPos = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      sweepPos = (sweepPos + sweepSpeed * 2.5) % (scanDirection === "vertical" ? height : width);

      // Cyber Grid
      ctx.save();
      ctx.strokeStyle = color1;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.08 * opacity;
      const gridSize = 40;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Scanner Sweep Bar
      ctx.save();
      const sweepGrad =
        scanDirection === "vertical"
          ? ctx.createLinearGradient(0, sweepPos - 40, 0, sweepPos + 40)
          : ctx.createLinearGradient(sweepPos - 40, 0, sweepPos + 40, 0);

      sweepGrad.addColorStop(0, "transparent");
      sweepGrad.addColorStop(0.5, color1);
      sweepGrad.addColorStop(0.8, color2);
      sweepGrad.addColorStop(1, "transparent");

      ctx.fillStyle = sweepGrad;
      ctx.globalAlpha = 0.3 * opacity;
      if (scanDirection === "vertical") {
        ctx.fillRect(0, sweepPos - 40, width, 80);
      } else {
        ctx.fillRect(sweepPos - 40, 0, 80, height);
      }

      // Bright Laser Line
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7 * opacity;
      ctx.shadowColor = color1;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      if (scanDirection === "vertical") {
        ctx.moveTo(0, sweepPos);
        ctx.lineTo(width, sweepPos);
      } else {
        ctx.moveTo(sweepPos, 0);
        ctx.lineTo(sweepPos, height);
      }
      ctx.stroke();
      ctx.restore();

      // Scanlines
      if (scanline) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1.5);
        }
        ctx.restore();
      }

      // Interactive Mouse Scanner Highlight
      if (mouse.isHovered) {
        ctx.save();
        const radGrad = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, 140);
        radGrad.addColorStop(0, `${color3}35`);
        radGrad.addColorStop(0.5, `${color2}15`);
        radGrad.addColorStop(1, "transparent");
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair
        ctx.strokeStyle = color1;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(mouse.x - 20, mouse.y);
        ctx.lineTo(mouse.x + 20, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 20);
        ctx.lineTo(mouse.x, mouse.y + 20);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      parent.removeEventListener("mousemove", handleMouseMove as EventListener);
      parent.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      window.removeEventListener("resize", handleResize);
    };
  }, [color1, color2, color3, speed, sweepSpeed, glow, scanDirection, scanline, opacity, mouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
