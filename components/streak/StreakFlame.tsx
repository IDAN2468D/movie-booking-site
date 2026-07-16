"use client";

import React from "react";
import { motion } from "framer-motion";

interface StreakFlameProps {
  streak: number;
  size?: number;
}

export default function StreakFlame({ streak, size = 48 }: StreakFlameProps) {
  // Scale flame with streak: min 1.0, max 2.0
  const flameScale = Math.min(1 + streak * 0.05, 2.0);
  const glowIntensity = Math.min(streak * 2, 30);

  return (
    <motion.div
      animate={{
        y: [-2, 2, -2],
        scale: flameScale,
      }}
      transition={{
        y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 100, damping: 15 },
      }}
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 ${glowIntensity}px rgba(249, 115, 22, 0.6))`,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="transform-gpu"
      >
        <defs>
          <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="70%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="flame-inner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>

        {/* Outer flame */}
        <path
          d="M32 4 C32 4 12 28 12 40 C12 52 20 60 32 60
             C44 60 52 52 52 40 C52 28 32 4 32 4Z"
          fill="url(#flame-grad)"
          opacity="0.9"
        />

        {/* Inner flame core */}
        <path
          d="M32 20 C32 20 22 34 22 42 C22 50 26 54 32 54
             C38 54 42 50 42 42 C42 34 32 20 32 20Z"
          fill="url(#flame-inner)"
          opacity="0.85"
        />

        {/* Bright center */}
        <ellipse cx="32" cy="46" rx="5" ry="6" fill="#fef9c3" opacity="0.7" />
      </svg>

      {/* Streak counter overlay */}
      {streak > 0 && (
        <span
          className="absolute text-xs font-black text-neutral-900
            font-[Outfit] select-none"
          style={{ bottom: size * 0.22, fontSize: size * 0.22 }}
        >
          {streak}
        </span>
      )}
    </motion.div>
  );
}
