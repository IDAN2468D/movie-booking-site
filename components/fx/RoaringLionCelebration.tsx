'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { Sparkles, X } from 'lucide-react';

export default function RoaringLionCelebration() {
  // Shallow-baked atomic selector for transaction settlement state
  const isTransactionCompleted = useBookingStore((state) => state.isTransactionCompleted);
  const setTransactionCompleted = useBookingStore((state) => state.setTransactionCompleted);
  const [showGate, setShowGate] = useState(false);

  const handleClose = () => {
    setShowGate(false);
    setTransactionCompleted(false);
  };

  useEffect(() => {
    if (isTransactionCompleted) {
      setShowGate(true);

      // Play the MGM roaring lion sound natively
      const audio = new Audio('/sounds/mgm-roar.mp3');
      audio.volume = 1.0;
      audio.play().catch((err) => console.warn('Audio playback blocked/failed:', err));

      // Auto close after 5 seconds
      const timeout = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isTransactionCompleted]);

  return (
    <AnimatePresence>
      {showGate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={handleClose} // Clicking the backdrop dismisses it
        >
          {/* Main Cinematic Celebration Gate Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            style={{
              boxShadow: '0 0 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)'
            }}
            className="w-full max-w-md p-8 rounded-[40px] backdrop-blur-3xl saturate-[200%] brightness-110 bg-black/40 border border-white/10 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent clicking the card from dismissing it
          >
            {/* Manual Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>

            {/* Ambient gold/orange background radial shine */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15)_0%,transparent_70%)] pointer-events-none" />

            {/* Glowing Crown/Mane Rings */}
            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center relative animate-pulse">
              <div className="absolute inset-2 rounded-full border border-dashed border-yellow-500/30 animate-[spin_20s_linear_infinite]" />
              
              {/* Cinematic Roaring Lion Head SVG */}
              <svg viewBox="0 0 100 100" className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]">
                <path
                  d="M 50 15 L 65 30 L 60 40 L 75 35 L 70 50 L 85 55 L 75 65 L 65 60 L 60 75 L 50 65 L 40 75 L 35 60 L 25 65 L 15 55 L 30 50 L 25 35 L 40 40 L 35 30 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
                <path d="M 42 45 Q 50 38 58 45" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M 38 58 Q 50 72 62 58" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight uppercase font-outfit mb-2 flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-400 w-5 h-5 animate-spin" />
              חגיגת פרימיום VIP
              <Sparkles className="text-yellow-400 w-5 h-5 animate-spin" />
            </h2>
            
            <p className="text-xs text-slate-300 font-bold max-w-xs mx-auto leading-relaxed">
              עסקת כרטיסי ה-VIP שלך הושלמה בהצלחה. האריה השואג מאשר את ההזמנה שלך!
            </p>

            {/* Micro-sparkle particles loop */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 opacity-60">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                  style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.5s' }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
