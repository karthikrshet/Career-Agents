"use client";

import React, { useState, useEffect } from "react";
import PixelBlast from "@/components/react-bits/PixelBlast";

export function HeroBackground3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Interactive WebGL PixelBlast Layer */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-auto opacity-70">
          <PixelBlast
            variant="square"
            pixelSize={3}
            color="#38bdf8"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples={true}
            rippleSpeed={0.3}
            rippleThickness={0.1}
            rippleIntensityScale={1}
            speed={0.4}
            edgeFade={0.5}
            transparent={true}
          />
        </div>
      )}

      {/* Ambient Lighting Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />
    </div>
  );
}
