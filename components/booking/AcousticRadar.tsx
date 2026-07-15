"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAcousticResonance } from "@/hooks/useAcousticResonance";
import { useBookingStore } from "@/lib/store";

export function AcousticRadar() {
  const hoveredSeat = useBookingStore((state) => state.hoveredSeat);
  const { simulateResonance, isActive } = useAcousticResonance();

  useEffect(() => {
    if (hoveredSeat) {
      // Calculate normalized 3D coordinates based on Seat ID
      const rowChar = hoveredSeat.charAt(0);
      const colNum = parseInt(hoveredSeat.slice(1), 10);
      const rowIndex = rowChar.toUpperCase().charCodeAt(0) - 65; // A=0 to H=7
      
      const x = ((colNum - 1) / 5) * 2 - 1; // Col 1 -> -1 (Left), Col 6 -> 1 (Right)
      const y = (rowIndex / 7) * 2 - 1;     // Row A -> -1 (Front), Row H -> 1 (Back)

      simulateResonance(hoveredSeat, x, y);
    }
  }, [hoveredSeat]);

  return (
    <AnimatePresence>
      {isActive && hoveredSeat && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          {/* Hardware accelerated volumetric radar pulse */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
            }}
            className="absolute w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full border border-cyan-400/50"
            style={{
              boxShadow: "0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 40px rgba(34, 211, 238, 0.2)",
              background: "radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)"
            }}
          />
          <motion.div
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ 
              duration: 2, 
              ease: "easeOut",
              delay: 0.2
            }}
            className="absolute w-[30vw] h-[30vw] max-w-[450px] max-h-[450px] rounded-full border-[2px] border-violet-500/50"
            style={{
              boxShadow: "0 0 40px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(139, 92, 246, 0.3)",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 80%)"
            }}
          />
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["10px", "24px", "10px"] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                  className="w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                />
              ))}
            </div>
            <span className="text-white/80 font-['Outfit'] tracking-widest text-xs font-bold uppercase ml-2">
              Acoustic Profile Active
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
