'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Loader2 } from 'lucide-react';
import { useVoiceEngine } from '@/lib/hooks/useVoiceEngine';
import { useVoiceStore } from '@/lib/store/voiceStore';

export default function VoiceOrb() {
  const { isListening, toggleListening } = useVoiceEngine();
  const volumeLevel = useVoiceStore((state) => state.volumeLevel);
  const transcript = useVoiceStore((state) => state.transcript);
  const isProcessing = useVoiceStore((state) => state.isProcessing);
  const feedbackText = useVoiceStore((state) => state.feedbackText);

  // Normalize volume for scale (0 to 255 -> 1 to 1.5)
  const scale = isListening && !isProcessing ? 1 + (volumeLevel / 255) * 0.8 : 1;
  const shadowIntensity = isListening && !isProcessing ? (volumeLevel / 255) : 0;

  return (
    <div className="relative z-[100] flex items-center justify-center">
      {/* Interactive Orb */}
      <motion.button
        onClick={toggleListening}
        animate={{ scale, rotate: isProcessing ? [0, -10, 10, -10, 10, 0] : 0 }}
        transition={{ 
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          rotate: { repeat: isProcessing ? Infinity : 0, duration: 1.5, ease: "easeInOut" }
        }}
        style={{
          boxShadow: isProcessing
            ? '0 0 40px rgba(168, 85, 247, 0.8), inset 0 0 20px rgba(255,255,255,0.8)'
            : isListening 
              ? `0 0 ${20 + shadowIntensity * 60}px rgba(34, 211, 238, ${0.4 + shadowIntensity * 0.6}), inset 0 0 20px rgba(255,255,255,0.5)`
              : '0 10px 25px -5px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.1)'
        }}
        className={`w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-[40px] border transition-colors duration-500 will-change-transform ${
          isProcessing
            ? 'bg-purple-500/30 border-purple-400/80'
            : isListening 
              ? 'bg-cyan-500/20 border-cyan-400/50' 
              : 'bg-white/5 border-white/20 hover:bg-white/10'
        }`}
      >
        {isProcessing ? (
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
            <Bot className="w-5 h-5 text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,1)]" />
          </motion.div>
        ) : isListening ? (
          <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <Bot className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
          </motion.div>
        ) : (
          <Bot className="w-5 h-5 text-slate-400 transition-all duration-300 hover:text-cyan-400 hover:scale-110" />
        )}
      </motion.button>

      {/* Transcript and Feedback tooltip */}
      <AnimatePresence>
        {(isListening || feedbackText || isProcessing) && (
          <motion.div 
            initial={{ opacity: 0, y: -10, filter: 'blur(10px)', x: '-50%' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', x: '-50%' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(10px)', x: '-50%' }}
            dir="rtl"
            className={`absolute top-full mt-4 left-1/2 w-max max-w-[85vw] sm:max-w-xs px-4 py-2 rounded-2xl backdrop-blur-xl border font-inter text-sm shadow-xl text-right leading-relaxed ${
              isProcessing || feedbackText 
                ? 'bg-purple-950/80 border-purple-500/30 text-purple-200' 
                : 'bg-black/60 border-white/10 text-cyan-300'
            }`}
          >
            {isProcessing ? 'Gemini מנתח...' : feedbackText || transcript || 'מקשיב...'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
