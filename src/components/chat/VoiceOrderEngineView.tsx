'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { VoiceOrderParsedOutput } from '@/lib/validations/voice-order.schema';

interface VoiceOrderEngineViewProps {
  isListening: boolean;
  transcriptBuffer: string;
  lastParsedAction: VoiceOrderParsedOutput | null;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const VoiceOrderEngineView: React.FC<VoiceOrderEngineViewProps> = ({
  isListening,
  transcriptBuffer,
  lastParsedAction,
  onStartListening,
  onStopListening,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSpatialConfirmationTone = (freq = 440) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
  };

  return (
    <div className="relative w-full p-6 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-[40px] shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00FFA3] animate-pulse" />
          Hands-Free Voice AI Command Shell
        </h3>
        <span className="text-xs text-neutral-400 font-['Inter']">Hebrew Web Speech</span>
      </div>

      <div className="flex flex-col items-center justify-center my-6">
        <motion.button
          onClick={() => {
            if (isListening) {
              onStopListening();
            } else {
              onStartListening();
              playSpatialConfirmationTone(600);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'bg-[#FF2E5B]/20 border-[#FF2E5B] shadow-[0_0_30px_rgba(255,46,91,0.6)] animate-pulse'
              : 'bg-white/5 border-white/20 hover:border-[#00FFA3] shadow-lg'
          }`}
        >
          <span className="text-2xl">{isListening ? '🎙️' : '🎤'}</span>
        </motion.button>

        <span className="text-xs font-bold text-white mt-3 font-['Outfit'] tracking-wider uppercase">
          {isListening ? 'מקשיב לפקודה קולית...' : 'לחץ להפעלת זיהוי קולי (Hands-Free)'}
        </span>
      </div>

      {transcriptBuffer && (
        <div className="p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-center font-['Inter'] text-sm text-neutral-300" dir="rtl">
          "{transcriptBuffer}"
        </div>
      )}

      {lastParsedAction && (
        <div className="p-4 rounded-xl border border-[#00FFA3]/30 bg-[#00FFA3]/10 text-right font-['Inter']">
          <div className="text-xs font-bold text-[#00FFA3] uppercase font-['Outfit'] mb-1">
            Intent: {lastParsedAction.intentType} ({Math.round(lastParsedAction.confidence * 100)}%)
          </div>
          <div className="text-sm font-semibold text-white">
            {lastParsedAction.actionResultText}
          </div>
        </div>
      )}
    </div>
  );
};
