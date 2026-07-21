"use client";

import { motion } from "framer-motion";
import React from "react";

interface SynapticAvatarProps {
  amplitude: number; // 0.0 to 1.0
  name: string;
  avatarUrl?: string;
  colorHex?: string;
}

export const SynapticAvatar: React.FC<SynapticAvatarProps> = ({ amplitude, name, avatarUrl, colorHex = "#3b82f6" }) => {
  // We want the pulse to scale based on amplitude. Base scale is 1, max scale is 2.5
  const pulseScale = 1 + amplitude * 1.5;
  const pulseOpacity = 0.1 + amplitude * 0.4;
  const blurRadius = 10 + amplitude * 20;

  return (
    <div className="relative flex flex-col items-center justify-center w-24 h-24">
      {/* Liquid Glass Waveform Rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ scale: pulseScale, opacity: pulseOpacity }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        style={{
          border: `2px solid ${colorHex}`,
          backgroundColor: `${colorHex}33`,
          filter: `blur(${blurRadius}px)`,
          willChange: "transform, opacity, filter",
          transform: "translateZ(0)",
        }}
      />
      
      <motion.div
        className="absolute inset-2 rounded-full"
        animate={{ scale: 1 + amplitude * 0.8, opacity: pulseOpacity * 1.5 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{
          border: `1px solid ${colorHex}80`,
          backgroundColor: "transparent",
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
      />

      {/* Core Avatar */}
      <div 
        className="relative z-10 w-16 h-16 rounded-full overflow-hidden border border-white/20 shadow-lg backdrop-blur-md bg-white/5 flex items-center justify-center"
        style={{ boxShadow: `0 0 ${10 + amplitude * 30}px ${colorHex}80` }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-outfit text-xl font-bold">{name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      
      <span className="absolute -bottom-6 text-white/70 font-inter text-xs tracking-wider">{name}</span>
    </div>
  );
};
