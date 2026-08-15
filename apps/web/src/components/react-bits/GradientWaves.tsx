"use client";

import React, { useRef, useEffect } from "react";

export interface GradientWavesProps {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  detail?: "low" | "medium" | "high";
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  grain?: boolean;
  grainIntensity?: number;
  className?: string;
}

export default function GradientWaves({
  horizonColor = "#030712",
  waveColor = "#1e1b4b",
  crestColor = "#38bdf8",
  speed = 0.4,
  amplitude = 2.5,
  waveScale = 0.6,
  swell = 35,
  turbulence = 20,
  brightness = 1.0,
  opacity = 0.75,
  mouseInteraction = true,
  parallaxStrength = 0.5,
  grain = true,
  grainIntensity = 0.04,
  className = "",
}: GradientWavesProps) {
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
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const parent = canvas.parentElement || window;
    parent.addEventListener("mousemove", handleMouseMove as EventListener);
    window.addEventListener("resize", handleResize);

    let time = 0;
    const waveLayers = [
      { color: waveColor, ampMult: 1.0, speedMult: 1.0, freqMult: 1.0, alpha: 0.35 },
      { color: "#312e81", ampMult: 1.4, speedMult: 0.7, freqMult: 0.8, alpha: 0.25 },
      { color: crestColor, ampMult: 0.8, speedMult: 1.3, freqMult: 1.5, alpha: 0.2 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01 * speed;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const parallaxX = ((mouse.x - width / 2) / width) * 40 * parallaxStrength;
      const parallaxY = ((mouse.y - height / 2) / height) * 30 * parallaxStrength;

      ctx.fillStyle = horizonColor;
      ctx.fillRect(0, 0, width, height);

      const step = 6;
      waveLayers.forEach((layer, layerIdx) => {
        const baseHeight = height * 0.55 + layerIdx * 40 + parallaxY;

        ctx.save();
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.alpha * opacity * brightness;

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseHeight);

        for (let x = 0; x <= width; x += step) {
          const normX = (x + parallaxX) * 0.005 * waveScale * layer.freqMult;
          const y1 = Math.sin(normX + time * layer.speedMult) * swell * amplitude;
          const y2 = Math.cos(normX * 1.8 - time * 0.8) * turbulence;
          const y = baseHeight + y1 + y2;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Top Crest Highlights
      ctx.save();
      ctx.strokeStyle = crestColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4 * opacity;
      ctx.shadowColor = crestColor;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      for (let x = 0; x <= width; x += step) {
        const normX = (x + parallaxX) * 0.007 * waveScale;
        const y = height * 0.55 + parallaxY + Math.sin(normX + time * 1.2) * swell * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Subtle Noise/Grain
      if (grain && grainIntensity > 0) {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = grainIntensity;
        for (let i = 0; i < 150; i++) {
          const gx = Math.random() * width;
          const gy = Math.random() * height;
          ctx.fillRect(gx, gy, 1.2, 1.2);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      parent.removeEventListener("mousemove", handleMouseMove as EventListener);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    horizonColor,
    waveColor,
    crestColor,
    speed,
    amplitude,
    waveScale,
    swell,
    turbulence,
    brightness,
    opacity,
    mouseInteraction,
    parallaxStrength,
    grain,
    grainIntensity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
