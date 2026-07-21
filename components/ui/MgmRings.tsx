'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MgmRingsProps {
  phase: number;
}

export const MgmRings: React.FC<MgmRingsProps> = ({ phase }) => {
  return (
    <AnimatePresence>
      {phase > 0 && phase < 4 && (
        <motion.div 
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center"
        >
          {/* Anamorphic Light Leaks */}
          <motion.div 
            className="absolute inset-0 bg-[#FFB800]/10 blur-[80px] rounded-full pointer-events-none"
            animate={phase === 2 ? { scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] } : { scale: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-0 bg-[#00F0FF]/15 blur-[100px] rounded-full mix-blend-screen pointer-events-none"
            animate={phase >= 2 ? { scale: [1, 1.2, 1], opacity: [0.2, 0.6, 0.2] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut", repeat: Infinity }}
          />

          {/* MGM Concentric Rings */}
          
          {/* Outer Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-white/5 bg-slate-900/10 backdrop-blur-xl shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]"
            initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          />
          
          {/* Middle Ring (Spinning) */}
          <motion.div 
            className="absolute inset-6 rounded-full border-2 border-white/10 bg-slate-900/20 backdrop-blur-lg border-t-[#FFB800]/40"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: phase >= 2 ? 360 : 0, scale: 1, opacity: 1 }}
            transition={{ 
              rotate: { duration: 8, ease: "linear", repeat: Infinity },
              default: { type: "spring", stiffness: 120, damping: 12, delay: 0.2 }
            }}
          />

          {/* Inner Ring (Shockwave) */}
          <motion.div 
            className="absolute inset-12 rounded-full border border-white/20 bg-slate-900/40 backdrop-blur-md"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === 2 
                ? { scale: [1, 1.25, 1], opacity: [1, 0.4, 1], borderColor: ['rgba(255,255,255,0.2)', 'rgba(0,240,255,0.5)', 'rgba(255,255,255,0.2)'] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              phase === 2 
                ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                : { type: "spring", stiffness: 120, damping: 12, delay: 0.4 }
            }
          />

          {/* Fusion Icon */}
          <motion.div 
            className="relative z-10 w-40 h-40 md:w-56 md:h-56 flex items-center justify-center text-[#FFB800]"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase >= 2 
                ? { scale: [1, 1.05, 0.98, 1], opacity: 1 }
                : { scale: 1, opacity: 1 }
            }
            transition={
              phase >= 2 
                ? { duration: 0.15, repeat: Infinity, repeatType: "mirror", ease: "linear" } // Violent vibration for roar
                : { type: "spring", stiffness: 120, damping: 12, delay: 0.6 }
            }
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,184,0,0.6)]">
              <path d="M15 30C15 30 32.5 25 50 30C67.5 25 85 30 85 30V70C85 70 67.5 65 50 70C32.5 65 15 70 15 70V30Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              <line x1="50" y1="30" x2="50" y2="70" stroke="white" strokeWidth="1" strokeDasharray="3 2" />
              <path d="M44 42L58 50L44 58V42Z" fill="#00F0FF" className="drop-shadow-[0_0_12px_rgba(0,240,255,0.9)]" />
            </svg>
          </motion.div>

          {/* Horizontal Lens Flare (Phase 2+) */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div 
                className="absolute top-1/2 left-[-50%] w-[200%] h-[2px] bg-[#00F0FF]/40 blur-[2px] mix-blend-screen pointer-events-none"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white/70 blur-[1px]" />
              </motion.div>
            )}
          </AnimatePresence>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
};
