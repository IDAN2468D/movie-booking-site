'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface KineticRewardModalProps {
  isOpen: boolean;
  rewardTitle: string;
  onClose: () => void;
}

export function KineticRewardModal({ isOpen, rewardTitle, onClose }: KineticRewardModalProps) {
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } catch (e) {
        console.error('AudioContext error:', e);
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-md pointer-events-auto"
            onClick={onClose}
          />

          {/* Particle Explosion Layer */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{ 
                scale: Math.random() * 1.5 + 0.5,
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
                opacity: 0 
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.8)] will-change-transform transform-gpu"
            />
          ))}

          {/* Success Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: 45 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="relative pointer-events-auto max-w-sm w-full mx-4 backdrop-blur-[40px] saturate-[250%] bg-neutral-950/80 border border-[#00F0FF]/30 rounded-3xl p-8 text-center shadow-[0_25px_50px_-12px_rgba(0,240,255,0.2),inset_0_0_20px_rgba(0,240,255,0.1)] will-change-transform transform-gpu"
            dir="rtl"
          >
            <div className="mx-auto w-16 h-16 bg-[#00F0FF]/10 rounded-full flex items-center justify-center mb-4 border border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              <CheckCircle2 className="w-8 h-8 text-[#00F0FF]" />
            </div>
            <h3 className="text-2xl font-['Outfit'] font-bold text-white mb-2">מימוש הושלם!</h3>
            <p className="text-[#00F0FF] font-['Inter'] mb-6 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">{rewardTitle}</p>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/40 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)] active:scale-95"
            >
              המשך
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
