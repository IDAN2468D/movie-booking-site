"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateHeroAuraAction } from "@/app/actions/heroAura.actions";
import { HeroAuraOutput } from "@/lib/validations/heroAura.schema";

interface HeroAuraModalProps {
  movieTitle: string;
  movieId: number | string;
  onClose: () => void;
  onSubBassTrigger: () => void;
}

export const HeroAuraModal: React.FC<HeroAuraModalProps> = ({
  movieTitle,
  movieId,
  onClose,
  onSubBassTrigger,
}) => {
  const [data, setData] = useState<HeroAuraOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    let active = true;
    calculateHeroAuraAction({ movieId, title: movieTitle }).then((res) => {
      if (active) {
        if (res.success && res.data) {
          setData(res.data);
        }
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [movieId, movieTitle]);

  const handlePulseClick = () => {
    setIsPulsing(true);
    onSubBassTrigger();
    setTimeout(() => setIsPulsing(false), 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] brightness-105 bg-neutral-950/85 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] text-white"
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="font-['Outfit'] text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-purple-400">
              ⚡ הילת סרטים נוירונית — {movieTitle}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-sm font-bold transition-all"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="h-44 flex items-center justify-center text-primary animate-pulse font-mono text-sm">
              מחשב תהודה אקוסטית והילה נוירונית...
            </div>
          ) : (
            <>
              {/* Glowing Aura Sphere Visualizer with Dynamic Pulse Response */}
              <div className="relative h-44 w-full rounded-2xl bg-black/80 overflow-hidden flex flex-col items-center justify-center border border-white/10 my-3">
                <motion.div
                  animate={{
                    scale: isPulsing ? [1, 1.5, 1.1] : [1, 1.15, 1],
                    rotate: [0, 180, 360],
                    opacity: isPulsing ? 0.9 : 0.4,
                  }}
                  transition={{ duration: isPulsing ? 0.4 : 8, repeat: isPulsing ? 1 : Infinity, ease: "linear" }}
                  className={`w-28 h-28 rounded-full bg-gradient-to-tr ${
                    data?.auraColor || "from-primary to-purple-600"
                  } blur-xl absolute`}
                />

                <motion.div
                  animate={{
                    scale: isPulsing ? [1, 1.2, 1] : [0.95, 1.08, 0.95],
                    borderColor: isPulsing ? "rgba(255, 20, 100, 1)" : "rgba(255, 255, 255, 0.3)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 w-24 h-24 rounded-full border bg-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,20,100,0.4)]"
                >
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                    {isPulsing ? "PULSING!" : "Aura Sync"}
                  </span>
                  <span className="text-xl font-bold font-outfit text-white">
                    {data?.emotionalValence}%
                  </span>
                </motion.div>
              </div>

              <div className="mb-4 text-center">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                  {isPulsing ? "⚡ פולס תהודה נוירוני פועל!" : data?.resonanceRating}
                </span>
              </div>

              {/* Acoustic & Mood Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-neutral-400 mb-1">עוצמה רגשית</span>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-primary h-full transition-all duration-300"
                      style={{ width: `${data?.emotionalValence}%` }}
                    />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-neutral-400 mb-1">תהודה אקוסטית</span>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${data?.acousticResonance}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePulseClick}
                className={`w-full py-3.5 rounded-2xl font-bold shadow-[0_10px_30px_rgba(255,20,100,0.4)] transition-all transform-gpu active:scale-[0.98] flex items-center justify-center gap-2 border border-white/20 ${
                  isPulsing
                    ? "bg-gradient-to-r from-cyan-400 via-primary to-amber-400 text-white scale-[1.02]"
                    : "bg-gradient-to-r from-amber-500 via-primary to-purple-600 hover:brightness-110 text-white"
                }`}
              >
                <span>
                  {isPulsing
                    ? "⚡ פולס נוירוני פעיל! (Sub-Bass Active)"
                    : "🔊 הפעל פולס תהודה נוירוני (35Hz Sub-Bass)"}
                </span>
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
