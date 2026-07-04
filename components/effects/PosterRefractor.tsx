"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface PosterRefractorProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PosterRefractor({ src, alt, className = "" }: PosterRefractorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for normalized cursor coordinates (-0.5 to 0.5)
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth spring physics for 120Hz rendering
  const springX = useSpring(cursorX, { stiffness: 200, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 200, damping: 20 });

  // Transform coordinates to 3D rotation angles
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  // Translate reflection glow highlight
  const glowX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

  // Slight chromatic offset for layered elements
  const chromaticOffsetX = useTransform(springX, [-0.5, 0.5], [-4, 4]);
  const chromaticOffsetY = useTransform(springY, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates to range [-0.5, 0.5]
    cursorX.set(mouseX / width - 0.5);
    cursorY.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    cursorX.set(0);
    cursorY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden cursor-pointer group select-none ${className}`}
      style={{
        perspective: 1000,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full w-inherit h-inherit transition-transform duration-100 ease-out"
      >
        {/* Chromatic Shadow Layer 1 (Red Accent) */}
        <motion.div
          style={{
            x: chromaticOffsetX,
            y: chromaticOffsetY,
            backgroundImage: `url(${src})`,
          }}
          className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-20 filter saturate-150 scale-102"
        />

        {/* Chromatic Shadow Layer 2 (Cyan Accent) */}
        <motion.div
          style={{
            x: useTransform(chromaticOffsetX, (val) => -val),
            y: useTransform(chromaticOffsetY, (val) => -val),
            backgroundImage: `url(${src})`,
          }}
          className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-20 filter saturate-150 scale-102"
        />

        {/* Core Image Layer */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:scale-105"
          draggable={false}
        />

        {/* Liquid Glass Overlay Shield */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-xl border border-white/10 pointer-events-none" />

        {/* Refractive Light Highlight Flare */}
        <motion.div
          style={{
            left: glowX,
            top: glowY,
            background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)",
          }}
          className="absolute w-60 h-60 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-overlay pointer-events-none filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Neon Ambient Outline Glow */}
        <div className="absolute inset-0 rounded-xl border border-cyan-400/0 group-hover:border-cyan-400/40 transition-all duration-500 shadow-[inset_0_0_20px_rgba(10,239,255,0)] group-hover:shadow-[inset_0_0_20px_rgba(10,239,255,0.25)] pointer-events-none" />
      </motion.div>
    </div>
  );
}
