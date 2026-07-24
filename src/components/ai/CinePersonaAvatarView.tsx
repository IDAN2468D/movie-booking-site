'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { PersonaResponse } from '@/lib/validations/cine-persona.schema';

interface CinePersonaAvatarViewProps {
  personaData: PersonaResponse | null;
  isThinking: boolean;
  userInput: string;
  onInputChange: (val: string) => void;
  onSubmitPrompt: () => void;
}

export const CinePersonaAvatarView: React.FC<CinePersonaAvatarViewProps> = ({
  personaData,
  isThinking,
  userInput,
  onInputChange,
  onSubmitPrompt,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const speakSynthesizedAudio = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL';
        utterance.pitch = 1.1;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech synthesis fallback
    }
  };

  return (
    <div className="relative w-full p-6 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-[40px] shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8A5CFF] animate-pulse" />
          AI Neural Cine-Persona Avatar
        </h3>
        <span className="text-xs text-neutral-400 font-['Inter']">v9.0 Voice Clone</span>
      </div>

      <div className="flex flex-col items-center justify-center my-6">
        <motion.div
          animate={{
            scale: isThinking ? [1, 1.15, 1] : [1, 1.05, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: isThinking ? 1.5 : 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 rounded-full border-2 border-[#8A5CFF] bg-gradient-to-tr from-[#8A5CFF]/40 via-[#00FFA3]/30 to-transparent backdrop-blur-xl shadow-[0_0_35px_rgba(138,92,255,0.6)] flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30" />
        </motion.div>
        <span className="text-xs text-neutral-400 mt-3 font-['Outfit'] tracking-wider uppercase">
          {isThinking ? 'Processing Neural Mood Vectors...' : 'Aura AI Persona Ready'}
        </span>
      </div>

      {personaData && (
        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5 text-right font-['Inter']">
          <div className="text-xs text-[#00FFA3] font-bold mb-1 font-['Outfit']">
            {personaData.personaName}
          </div>
          <p className="text-sm text-white leading-relaxed">{personaData.dialogueText}</p>
          <button
            onClick={() => speakSynthesizedAudio(personaData.dialogueText)}
            className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-[#8A5CFF]/20 border border-[#8A5CFF] text-white hover:bg-[#8A5CFF]/40 transition-all duration-200"
          >
            🔊 השמע בקול (TTS)
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="תאר את מצב הרוח שלך (למשל: סרט מתח עוצר נשימה...)"
          dir="rtl"
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 font-['Inter'] text-sm focus:outline-none focus:border-[#8A5CFF]"
        />
        <button
          onClick={onSubmitPrompt}
          disabled={isThinking || !userInput.trim()}
          className="px-5 py-3 rounded-xl bg-[#8A5CFF] text-white font-bold font-['Outfit'] hover:bg-[#8A5CFF]/90 transition-all duration-200"
        >
          שאל
        </button>
      </div>
    </div>
  );
};
