"use client";

import React, { useState } from "react";

export interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  className?: string;
}

export default function LogoLoop({
  logos,
  speed = 40,
  direction = "left",
  logoHeight = 44,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = "#030712",
  ariaLabel = "Partner Logos",
  className = "",
}: LogoLoopProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isVertical = direction === "up" || direction === "down";
  const isReverse = direction === "right" || direction === "down";

  // Double list to create seamless infinite loop
  const displayLogos = [...logos, ...logos, ...logos];

  const duration = Math.max(10, (logos.length * 120) / (isHovered && hoverSpeed > 0 ? hoverSpeed : speed));

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edge Fades */}
      {fadeOut && !isVertical && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      {fadeOut && isVertical && (
        <>
          <div
            className="absolute left-0 right-0 top-0 h-16 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-0 h-16 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      <div
        className={`flex ${isVertical ? "flex-col" : "flex-row"} w-max`}
        style={{
          gap: `${gap}px`,
          animationName: isVertical ? "marquee-vertical" : "marquee-horizontal",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: isReverse ? "reverse" : "normal",
          animationPlayState: isHovered && hoverSpeed === 0 ? "paused" : "running",
        }}
      >
        {displayLogos.map((item, index) => {
          const content = (
            <div
              className={`flex items-center justify-center transition-all duration-300 ${
                scaleOnHover ? "hover:scale-110" : ""
              } opacity-70 hover:opacity-100`}
              style={{
                height: `${logoHeight}px`,
                minWidth: isVertical ? "auto" : `${logoHeight * 1.8}px`,
              }}
            >
              {item.node ? (
                <div className="flex items-center gap-2 text-slate-300 hover:text-white">
                  {item.node}
                  {item.title && (
                    <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </div>
              ) : item.src ? (
                <img
                  src={item.src}
                  alt={item.alt || item.title || "Logo"}
                  style={{ maxHeight: `${logoHeight}px`, objectFit: "contain" }}
                />
              ) : (
                <span className="text-sm font-bold text-slate-200">{item.title}</span>
              )}
            </div>
          );

          return item.href ? (
            <a
              key={`${item.title || index}-${index}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
            >
              {content}
            </a>
          ) : (
            <div key={`${item.title || index}-${index}`}>{content}</div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes marquee-horizontal {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes marquee-vertical {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}
