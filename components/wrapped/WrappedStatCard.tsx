"use client";

import React from "react";
import { motion } from "framer-motion";

interface WrappedStatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
  index: number;
}

export default function WrappedStatCard({
  label,
  value,
  subtitle,
  icon,
  accentColor = "rgba(234, 179, 8, 0.15)",
  index,
}: WrappedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay: index * 0.05,
      }}
      className="w-full max-w-xs mx-auto p-6 rounded-2xl
        backdrop-blur-3xl saturate-[250%] brightness-105
        border border-white/[0.12] text-center
        flex flex-col items-center gap-3"
      style={{
        background: `linear-gradient(135deg, ${accentColor}, rgba(0,0,0,0.3))`,
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.3)",
      }}
    >
      {/* Icon container with glow ring */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center
          border border-white/10"
        style={{
          background: accentColor,
          boxShadow: `0 0 24px ${accentColor}`,
        }}
      >
        {icon}
      </div>

      {/* Stat value — large counter */}
      <motion.span
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 + index * 0.05 }}
        className="text-4xl font-black text-white font-[Outfit]
          tracking-tight drop-shadow-lg"
      >
        {value}
      </motion.span>

      {/* Label */}
      <p
        className="text-sm font-medium text-white/70 font-[Inter]
          leading-relaxed"
        dir="rtl"
      >
        {label}
      </p>

      {/* Optional subtitle */}
      {subtitle && (
        <p
          className="text-xs text-white/40 font-[Inter] -mt-1"
          dir="rtl"
        >
          {subtitle}
        </p>
      )}

      {/* Reveal particle burst */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.6 }}
        whileInView={{ scale: 2.5, opacity: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute inset-0 rounded-2xl border border-white/10
          pointer-events-none"
      />
    </motion.div>
  );
}
