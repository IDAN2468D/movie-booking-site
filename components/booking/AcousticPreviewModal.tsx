"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AcousticPreviewModalProps {
  seatId: string;
  onClose: () => void;
  profile: any;
}

export function AcousticPreviewModal({ seatId, onClose, profile }: AcousticPreviewModalProps) {
  // Generate random bars for the visualizer
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial bars
    setBars(Array.from({ length: 30 }, () => Math.random() * 100));
    
    // Animate bars at ~120Hz (every 8ms)
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (time - lastTime > 30) { // Slightly throttled to prevent overkill, 30ms is ~30fps visual
        setBars(prev => prev.map(val => Math.max(10, Math.min(100, val + (Math.random() - 0.5) * 40))));
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        dir="rtl"
      >
        <div className="absolute inset-0" onClick={onClose} />
        
        <div className="relative w-full max-w-sm rounded-[2rem] bg-white/5 border border-white/10 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(34,211,238,0.2)] backdrop-blur-[40px] saturate-[250%] overflow-hidden">
          {/* Glass glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-['Outfit'] font-bold text-white mb-1">
                הדמיה אקוסטית
              </h3>
              <p className="text-sm text-cyan-400 font-mono tracking-widest uppercase">
                מושב {seatId}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
            >
              <span className="text-white/70">✕</span>
            </button>
          </div>

          <div className="bg-black/20 rounded-xl p-4 mb-6 border border-white/5">
            <div className="flex items-end justify-center h-24 gap-1 overflow-hidden">
              {bars.map((height, i) => (
                <motion.div
                  key={i}
                  className="w-2 rounded-t-sm bg-cyan-400"
                  style={{ height: `${height}%` }}
                  // Use transform-gpu for zero-reflow rendering
                  animate={{ transform: `scaleY(${height / 100})` }}
                  transition={{ type: "tween", duration: 0.05 }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">הדהוד (Reverb)</div>
              <div className="text-lg font-['Outfit'] text-white">
                {profile?.reverbTime?.toFixed(2)}s
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">תדר חיתוך</div>
              <div className="text-lg font-['Outfit'] text-white">
                {(profile?.lowpassFreq / 1000)?.toFixed(1)}kHz
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
