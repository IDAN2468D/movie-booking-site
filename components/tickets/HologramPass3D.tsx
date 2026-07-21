"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useEffect, useState } from "react";
import { HologramTheme } from "@/lib/validations/hologramSchema";

interface HologramPass3DProps {
  theme: HologramTheme;
  movieTitle: string;
}

export const HologramPass3D: React.FC<HologramPass3DProps> = ({ theme, movieTitle }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the motion values for the 3D effect
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map motion values to rotations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Map motion values to specular highlights
  const specularX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const specularY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const [hasGyro, setHasGyro] = useState(false);

  useEffect(() => {
    // Attempt Device Orientation for mobile fallback
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        setHasGyro(true);
        // Normalize gamma (-90 to 90) and beta (-180 to 180) to [-0.5, 0.5]
        const nx = Math.max(-1, Math.min(1, event.gamma / 45)) * 0.5;
        const ny = Math.max(-1, Math.min(1, (event.beta - 45) / 45)) * 0.5;
        x.set(nx);
        y.set(ny);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [x, y]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasGyro) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (hasGyro) return;
    x.set(0);
    y.set(0);
  };

  // Dynamically generate background style based on texture type
  const getTextureBackground = () => {
    switch (theme.hologramTextureType) {
      case "cyber":
        return `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`;
      case "plasma":
        return `radial-gradient(circle at center, ${theme.primaryColor} 0%, transparent 70%)`;
      case "liquid":
        return `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`;
      case "crystal":
      default:
        return `conic-gradient(from 180deg at 50% 50%, ${theme.primaryColor} 0deg, ${theme.secondaryColor} 180deg, ${theme.primaryColor} 360deg)`;
    }
  };

  return (
    <div 
      className="relative w-full max-w-sm aspect-[1/1.5] mx-auto perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full rounded-2xl relative overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
          boxShadow: `0 30px 60px -12px rgba(0,0,0,0.8), 0 0 20px ${theme.primaryColor}66`,
          background: getTextureBackground(),
          border: `1px solid rgba(255,255,255,0.2)`
        }}
      >
        {/* Ambient Overlay Layer */}
        <div className="absolute inset-0 bg-black/40 mix-blend-overlay pointer-events-none" />

        {/* Specular Highlight Layer */}
        <motion.div 
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
          style={{
            background: `radial-gradient(circle at var(--specular-x) var(--specular-y), rgba(255,255,255,0.8) 0%, transparent 50%)`,
            // @ts-ignore
            "--specular-x": specularX,
            "--specular-y": specularY,
          }}
        />

        {/* Content Container (Floating above base) */}
        <div 
          className="absolute inset-0 p-6 flex flex-col justify-between"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-white tracking-wider font-['Outfit'] drop-shadow-md">
              {movieTitle}
            </h2>
            <div className="text-xs font-bold px-2 py-1 rounded bg-white/20 backdrop-blur-md text-white border border-white/30 uppercase tracking-widest">
              {theme.hologramTextureType}
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-white/70 uppercase tracking-widest mb-1 font-['Inter']">Holographic Pass</p>
            <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-['Outfit'] drop-shadow-lg" dir="rtl">
              {theme.passName}
            </h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
