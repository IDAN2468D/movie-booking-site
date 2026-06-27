"use client";

import { motion } from "framer-motion";

export function BrainOrb({ sentiment = "neutral" }: { sentiment?: "greed" | "fear" | "neutral" }) {
  const getGradient = () => {
    switch (sentiment) {
      case "greed":
        return "radial-gradient(circle, rgba(34,197,94,0.6) 0%, rgba(34,197,94,0) 70%)";
      case "fear":
        return "radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(239,68,68,0) 70%)";
      default:
        return "radial-gradient(circle, rgba(245,166,35,0.6) 0%, rgba(245,166,35,0) 70%)";
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm mx-auto aspect-square">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: sentiment === "fear" ? 1.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-full h-full rounded-full blur-3xl"
        style={{ background: getGradient() }}
      />
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: sentiment === "fear" ? 1.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className="relative z-10 flex flex-col items-center justify-center w-40 h-40 rounded-full glass-panel shadow-[0_0_60px_rgba(245,166,35,0.3)]"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.8) 100%)",
        }}
      >
        <div className="text-xl font-bold text-white tracking-widest uppercase">
          {sentiment === "greed" ? "חמדנות" : sentiment === "fear" ? "פחד" : "ניטרלי"}
        </div>
        <div className="text-xs text-white/60">סנטימנט שוק</div>
      </motion.div>
    </div>
  );
}
