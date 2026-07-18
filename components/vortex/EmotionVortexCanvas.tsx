"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVortexStore } from "@/lib/store/vortexStore";
import { useVortexAcoustics } from "@/hooks/useVortexAcoustics";
import { castEmotionOrbAction } from "@/app/actions/vortexActions";
import DraggableEmotionOrb, { emotionColors } from "./DraggableEmotionOrb";
import { ValidEmotions } from "@/lib/validations/emotionVortex";

interface Props {
  movieId: string;
}

export default function EmotionVortexCanvas({ movieId }: Props) {
  const { activeEmotion, isSwallowed, setSwallowed } = useVortexStore();
  const { playResolutionDrop } = useVortexAcoustics();
  const [success, setSuccess] = useState(false);

  const handleDrop = async (emotion: string) => {
    setSwallowed(true);
    playResolutionDrop();
    
    // Attempt DB sync
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await castEmotionOrbAction({ movieId, emotion: emotion as any });
    if (res.success) {
      setSuccess(true);
    }
  };

  const vortexColor = activeEmotion ? emotionColors[activeEmotion] : "rgba(255, 255, 255, 0.1)";
  const vortexBg = activeEmotion ? vortexColor.replace("1)", "0.3)") : "transparent";

  return (
    <div className="relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#020203] rounded-3xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_25px_50px_-12px_rgba(0,0,0,0.7)]">
      
      {/* Background Liquid Glass Vortex Ambient Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at 50% 40%, ${vortexBg} 0%, transparent 60%)`
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Center Black Hole / Vortex Core */}
      <motion.div
        className="absolute w-40 h-40 rounded-full z-0 top-[20%]"
        animate={{
          scale: activeEmotion ? [1, 1.05, 1] : 1,
          boxShadow: `0 0 80px ${vortexColor}, inset 0 0 30px #000`
        }}
        transition={{
          scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          boxShadow: { duration: 0.6 }
        }}
        style={{
          background: "#000",
          border: `2px solid ${vortexColor}`
        }}
      >
        <div className="w-full h-full rounded-full backdrop-blur-[40px] saturate-[250%]" />
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute z-20 text-white font-outfit text-3xl font-bold tracking-widest text-center"
            style={{ textShadow: `0 0 25px ${vortexColor}` }}
          >
            <div>SENTIMENT</div>
            <div className="text-xl opacity-80 mt-2">REGISTERED</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orbs container */}
      <div className="absolute bottom-12 flex gap-4 z-10 w-full justify-center px-4 flex-wrap">
        {!isSwallowed && ValidEmotions.map((emotion) => (
          <DraggableEmotionOrb
            key={emotion}
            emotion={emotion}
            onDropInVortex={handleDrop}
          />
        ))}
      </div>
      
      {/* Instructions */}
      {!isSwallowed && (
        <p className="absolute top-8 text-white/60 font-inter text-lg tracking-wide z-10 animate-pulse">
          גרור רגש אל תוך המערבולת
        </p>
      )}
    </div>
  );
}
