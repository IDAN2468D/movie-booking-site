'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcousticEngine } from '@/lib/hooks/useAcousticEngine';
import { MgmRings } from './MgmRings';

interface MgmSplashScreenProps {
  onComplete: () => void;
}

export const MgmSplashScreen: React.FC<MgmSplashScreenProps> = ({ onComplete }) => {
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  
  const { playCinematicImpact, playSubBassDrop, playSpatializedClick, initAudio, isAudioSuspended } = useAcousticEngine();

  const startSequence = useCallback(() => {
    setPhase(1);
    playCinematicImpact(); // Play the massive Hans Zimmer cinematic impact!
    setTimeout(() => setPhase(2), 1500); // Metamorphosis (1.5s)
    setTimeout(() => setPhase(3), 3500); // Ignition (3.5s)
    setTimeout(() => setPhase(4), 4500); // Dissolve (4.5s)
    setTimeout(() => {
      playSubBassDrop(); // Sub-bass frequency drop on completion
      onComplete();
    }, 5500); // Complete
  }, [onComplete, playSubBassDrop, playCinematicImpact]);

  useEffect(() => {
    // Try to init audio immediately. If the browser blocks it without user gesture,
    // the state will remain 'suspended'.
    initAudio();
    if (isAudioSuspended()) {
      setAudioBlocked(true);
    } else {
      setAudioBlocked(false);
      startSequence();
    }
  }, [initAudio, isAudioSuspended, startSequence]);

  const handleManualPlay = (e: React.MouseEvent) => {
    initAudio();
    playSpatializedClick(e.clientX, e.clientY);
    setAudioBlocked(false);
    startSequence();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05070B] overflow-hidden flex flex-col items-center justify-center text-white" dir="rtl">
      {/* Skip Button (Top Left - logical RTL layout constraint) */}
      <button 
        onClick={(e) => {
          initAudio();
          playSpatializedClick(e.clientX, e.clientY);
          onComplete();
        }}
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

      <MgmRings phase={phase} />

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
