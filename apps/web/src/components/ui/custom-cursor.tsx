"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop with fine pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, input, textarea, [data-cursor]");
      if (interactive) {
        const cursorType = interactive.getAttribute("data-cursor");
        if (cursorType === "text") {
          setCursorVariant("text");
        } else if (cursorType === "magnetic") {
          setCursorVariant("magnetic");
        } else {
          setCursorVariant("pointer");
        }
      } else {
        setCursorVariant("default");
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const variants: Variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(56, 189, 248, 0.08)",
      border: "1px solid rgba(56, 189, 248, 0.4)",
      transition: { type: "spring", mass: 0.1, stiffness: 800, damping: 40 } as any,
    },
    pointer: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(99, 102, 241, 0.15)",
      border: "1.5px solid rgba(129, 140, 248, 0.8)",
      transition: { type: "spring", mass: 0.1, stiffness: 800, damping: 35 } as any,
    },
    text: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 12,
      height: 24,
      width: 4,
      backgroundColor: "#38bdf8",
      border: "none",
      borderRadius: 2,
      transition: { type: "spring", mass: 0.05, stiffness: 1000, damping: 30 } as any,
    },
    magnetic: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: "rgba(168, 85, 247, 0.18)",
      border: "1.5px solid rgba(192, 132, 252, 0.9)",
      transition: { type: "spring", mass: 0.15, stiffness: 500, damping: 28 } as any,
    },
  };

  return (
    <>
      {/* Outer Ring Cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full backdrop-blur-[1px]"
        variants={variants}
        animate={cursorVariant}
      />
      {/* Inner Precision Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          opacity: cursorVariant === "text" ? 0 : 1,
        }}
        transition={{ type: "spring", mass: 0.02, stiffness: 1200, damping: 40 } as any}
      />
    </>
  );
}
