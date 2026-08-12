"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StrokeTextProps {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  className?: string;
}

export default function StrokeText({
  text,
  strokeColor = "#38bdf8",
  fillColor = "#ffffff",
  strokeWidth = 1.5,
  drawDuration = 1.4,
  fillDelay = 0.3,
  stagger = 0.04,
  fontSize = 72,
  fontWeight = 800,
  letterSpacing = -2,
  className = "",
}: StrokeTextProps) {
  const letters = text.split("");

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        height={fontSize * 1.3}
        className="overflow-visible"
        style={{ width: "auto" }}
      >
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          className="font-sans"
        >
          {letters.map((char, index) => (
            <motion.tspan
              key={`${char}-${index}`}
              initial={{
                strokeDasharray: 300,
                strokeDashoffset: 300,
                fill: "transparent",
                stroke: strokeColor,
              }}
              animate={{
                strokeDashoffset: 0,
                fill: fillColor,
                stroke: "transparent",
              }}
              transition={{
                strokeDashoffset: {
                  duration: drawDuration,
                  delay: index * stagger,
                  ease: "easeInOut",
                },
                fill: {
                  duration: 0.6,
                  delay: drawDuration + fillDelay + index * stagger,
                  ease: "easeOut",
                },
                stroke: {
                  duration: 0.4,
                  delay: drawDuration + fillDelay + index * stagger,
                },
              }}
              style={{
                strokeWidth,
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.tspan>
          ))}
        </text>
      </svg>
    </div>
  );
}
