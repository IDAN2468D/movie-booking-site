"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDirectorsTriviaAction } from '@/app/actions/getDirectorsTriviaActions';

interface DirectorsAudioCompanionProps {
  movieId: string;
}

export const DirectorsAudioCompanion: React.FC<DirectorsAudioCompanionProps> = ({ movieId }) => {
  const [mode, setMode] = useState<'balanced' | 'dialogue_boost' | 'bass_drop' | 'score_focus'>('balanced');
  const [timestamp, setTimestamp] = useState<number>(15);
  const [trivia, setTrivia] = useState<string>('');

  useEffect(() => {
    getDirectorsTriviaAction({ movieId, timestampSeconds: timestamp, audioMode: mode }).then((res) => {
      if (res.success && res.data) {
        setTrivia(res.data.activeTrivia);
      }
    });
  }, [movieId, timestamp, mode]);

  return (
    <div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] text-white shadow-2xl" dir="rtl">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
        <h4 className="font-['Outfit'] text-lg font-bold text-amber-400">
          🎙️ Director&apos;s Cut — מבודד שמע וטריוויה
        </h4>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
          {timestamp}s
        </span>
      </div>

      {/* Audio Mode Selectors */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { id: 'balanced', label: '🔊 איזון טבעי' },
          { id: 'dialogue_boost', label: '🗣️ הגברת דיאלוג' },
          { id: 'bass_drop', label: '💥 Sub-Bass 40Hz' },
          { id: 'score_focus', label: '🎻 פסקול עוצמתי' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as typeof mode)}
            className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all duration-200 ${
              mode === item.id
                ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Timestamp Scrubber */}
      <div className="mb-4">
        <label className="block text-xs text-neutral-400 mb-1 font-mono">בחר זמן בטריילר: {timestamp} שניות</label>
        <input
          type="range"
          min={0}
          max={120}
          step={15}
          value={timestamp}
          onChange={(e) => setTimestamp(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer"
        />
      </div>

      {/* Trivia Bubble Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={trivia}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-100 text-xs font-['Inter'] leading-relaxed flex items-start gap-2"
        >
          <span className="text-base">💡</span>
          <span>{trivia}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
