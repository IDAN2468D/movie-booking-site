"use client";

import React from "react";
import { motion } from "framer-motion";

interface SubtitleTextProps {
  text: string;
  audioEnergy: number;
}

export default function SubtitleText({ text, audioEnergy }: SubtitleTextProps) {
  // Map frequency energy to style values for zero-reflow rendering
  const scale = 1 + audioEnergy * 0.12;
  const yOffset = audioEnergy * -8; // upward kick on high energy
  const textGlow = audioEnergy * 12;
  const textWeight = 400 + Math.floor(audioEnergy * 350);
  const textColor = audioEnergy > 0.6 ? "#FF1464" : "#0AEFFF"; // dynamic crimson shift on peak frequencies

  return (
    <motion.p
      dir="rtl"
      animate={{
        scale,
        y: yOffset,
        textShadow: `0 0 ${textGlow}px ${textColor}`,
        fontWeight: textWeight,
        color: textColor,
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 18,
      }}
      className="font-Outfit text-sm sm:text-base tracking-wide text-white/90 selection:bg-amber-500/30 select-none text-center leading-relaxed"
    >
      {text}
    </motion.p>
  );
}
