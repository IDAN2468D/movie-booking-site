"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSeatHaptics } from "@/hooks/useSeatHaptics";

export default function SeatHapticFeedback() {
  const { triggerSeatHapticPulse } = useSeatHaptics();

  const handleTrigger = () => {
    triggerSeatHapticPulse(0, 40, 300);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleTrigger}
      className="px-4 py-2 rounded-full bg-neutral-950/60 backdrop-blur-2xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-lg flex items-center gap-2"
    >
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      <span>🔊 משוב רטט ואקוסטיקה 40Hz מוכנים</span>
    </motion.button>
  );
}
