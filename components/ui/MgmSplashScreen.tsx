'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MgmSplashScreenProps {
  onComplete: () => void;
}

export const MgmSplashScreen: React.FC<MgmSplashScreenProps> = ({ onComplete }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);

  const startSequence = useCallback(() => {
    setPhase(1);
    setTimeout(() => setPhase(2), 1500); // Metamorphosis (1.5s)
    setTimeout(() => setPhase(3), 3500); // Ignition (3.5s)
    setTimeout(() => setPhase(4), 4500); // Dissolve (4.5s)
    setTimeout(() => onComplete(), 5500); // Complete
  }, [onComplete]);

  useEffect(() => {
    // Attempt autoplay immediately
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setAudioBlocked(false);
        startSequence();
      }).catch(() => {
        // Autoplay blocked by browser policy
        setAudioBlocked(true);
      });
    } else {
      // Fallback if no audio ref
      startSequence();
    }
  }, [startSequence]);

  const handleManualPlay = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setAudioBlocked(false);
    startSequence();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05070B] overflow-hidden flex flex-col items-center justify-center text-white" dir="rtl">
      {/* Audio Element */}
      <audio ref={audioRef} src="/sounds/mgm-roar.mp3" preload="auto" />
      
      {/* Skip Button (Top Left - logical RTL layout constraint) */}
      <button 
        onClick={onComplete}
        className="absolute top-6 left-6 z-50 text-white/40 hover:text-white text-sm tracking-widest transition-colors font-medium"
      >
        דלג / SKIP
      </button>

      {/* Fallback Overlay if Audio Autoplay is blocked */}
      <AnimatePresence>
        {audioBlocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl flex items-center justify-center cursor-pointer"
            onClick={handleManualPlay}
          >
            <div className="text-xl md:text-2xl font-light tracking-wider animate-pulse text-white/90">
              לחץ לחוויה קולנועית / Tap for Cinematic Experience
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Phase 3: Ignition (Typography) */}
      <AnimatePresence>
        {phase >= 3 && phase < 4 && (
          <motion.div 
            className="absolute bottom-1/4 flex flex-col items-center font-outfit"
            initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <h1 className="flex items-center gap-1 md:gap-2 font-black leading-none text-5xl md:text-7xl">
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">MOVIE</span>
              <motion.span 
                className="text-[#FFB800]"
                animate={{ opacity: [1, 0.2, 1, 0.7, 1] }}
                transition={{ duration: 0.3, repeat: 3 }}
                style={{ textShadow: "0 0 25px rgba(255,184,0,0.9)" }}
              >
                BOOK
              </motion.span>
            </h1>
            <h2 className="text-white/80 tracking-[0.4em] md:tracking-[0.6em] uppercase mt-4 text-xs md:text-sm font-light">
              Premium Cinema
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
