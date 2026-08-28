"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface Props {
  audioLevel: number;
  isRecording: boolean;
  barCount?: number;
}

export const CineSubSpectrumVisualizer: React.FC<Props> = ({
  audioLevel,
  isRecording,
  barCount = 20,
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
      <Activity className={`w-4 h-4 ${isRecording ? "text-cyan-400 animate-pulse" : "text-slate-500"}`} />
      <div className="flex items-center gap-1 h-7">
        {[...Array(barCount)].map((_, i) => {
          const factor = Math.sin((i / barCount) * Math.PI);
          const computedHeight = isRecording
            ? Math.max(4, Math.min(26, Math.round((audioLevel * factor * 1.3) + (i % 3) * 2)))
            : 4;

          return (
            <motion.div
              key={i}
              animate={{ height: computedHeight }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-500 via-indigo-400 to-pink-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              style={{
                opacity: isRecording ? 0.4 + (computedHeight / 26) * 0.6 : 0.25,
              }}
            />
          );
        })}
      </div>
      <span className="text-[10px] font-mono font-bold text-cyan-300 min-w-[32px] text-left">
        {isRecording ? `${audioLevel}%` : "OFF"}
      </span>
    </div>
  );
};

export default CineSubSpectrumVisualizer;
