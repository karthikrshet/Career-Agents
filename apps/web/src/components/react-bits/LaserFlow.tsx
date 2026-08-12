"use client";

import React, { useRef, useEffect } from "react";

export interface LaserFlowProps {
  color?: string;
  horizontalBeamOffset?: number;
  verticalBeamOffset?: number;
  speed?: number;
  beamCount?: number;
  className?: string;
}

export default function LaserFlow({
  color = "#38bdf8",
  horizontalBeamOffset = 0.1,
  verticalBeamOffset = 0.0,
  speed = 1.2,
  beamCount = 6,
  className = "",
}: LaserFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    interface Beam {
      y: number;
      speed: number;
      width: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;
      length: number;
      x: number;
    }

    const beams: Beam[] = [];
    const colors = [color, "#818cf8", "#c084fc", "#38bdf8"];

    for (let i = 0; i < beamCount; i++) {
      beams.push({
        y: height * (0.2 + (i / beamCount) * 0.6 + (Math.random() - 0.5) * 0.1),
        speed: (2 + Math.random() * 4) * speed,
        width: 1 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.5,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
        length: width * (0.3 + Math.random() * 0.5),
        x: -width * (0.2 + Math.random() * 0.8),
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Ambient Horizon Glow
      const grad = ctx.createRadialGradient(
        width / 2 + horizontalBeamOffset * width,
        height / 2 + verticalBeamOffset * height,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, `${color}25`);
      grad.addColorStop(0.5, `${color}08`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render Laser Beams
      beams.forEach((beam, idx) => {
        beam.x += beam.speed;
        if (beam.x > width + beam.length) {
          beam.x = -beam.length - Math.random() * 200;
          beam.y = height * (0.15 + Math.random() * 0.7);
        }

        const currentOpacity =
          beam.opacity * (0.7 + 0.3 * Math.sin(time * 3 + beam.pulsePhase));

        const beamColor = colors[idx % colors.length];

        const lineGrad = ctx.createLinearGradient(
          beam.x,
          beam.y,
          beam.x + beam.length,
          beam.y
        );
        lineGrad.addColorStop(0, "transparent");
        lineGrad.addColorStop(0.7, beamColor);
        lineGrad.addColorStop(1, "#ffffff");

        // Glow Layer
        ctx.save();
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = beam.width * 3.5;
        ctx.globalAlpha = currentOpacity * 0.4;
        ctx.shadowColor = beamColor;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(beam.x + beam.length, beam.y);
        ctx.stroke();

        // Core Sharp Beam
        ctx.lineWidth = beam.width;
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(beam.x + beam.length, beam.y);
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, horizontalBeamOffset, verticalBeamOffset, speed, beamCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
