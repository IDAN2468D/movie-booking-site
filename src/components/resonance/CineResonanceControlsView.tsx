'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CineResonanceControlsViewProps {
  resonance: number;
  mode: 'dialogue' | 'bass' | 'surround';
  onResonanceChange: (val: number) => void;
  onModeChange: (m: 'dialogue' | 'bass' | 'surround') => void;
  onAutoCalibrate: () => void;
  targetFreq: number;
}

export const CineResonanceControlsView: React.FC<CineResonanceControlsViewProps> = ({
  resonance,
  mode,
  onResonanceChange,
  onModeChange,
  onAutoCalibrate,
  targetFreq,
}) => {
  const modeLabels: Record<'dialogue' | 'bass' | 'surround', string> = {
    dialogue: 'הדגשת דיאלוג',
    bass: 'מכת באס חזקה',
    surround: 'סאונד היקפי עוטף',
  };

  return (
    <div className="w-full space-y-4 p-5 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-xl shadow-xl text-right" dir="rtl">
      <div className="flex justify-between items-center text-sm">
        <span className="font-sans font-bold text-neutral-100">
          כיול עוצמת התהודה האקוסטית
        </span>
        <span className="font-mono text-xs text-purple-300 dir-ltr">
          {targetFreq} Hz
        </span>
      </div>

      {/* Range Slider */}
      <div className="relative w-full flex items-center">
        <input
          type="range"
          min="0"
          max="100"
          value={resonance}
          onChange={(e) => onResonanceChange(Number(e.target.value))}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
      </div>

      {/* Audio Mode Selectors in Hebrew */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {(['dialogue', 'bass', 'surround'] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`py-2 px-2 rounded-xl text-xs font-sans font-medium transition-all border ${
              mode === m
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      {/* Action Button in Hebrew */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAutoCalibrate}
        className="w-full py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-sky-600 to-purple-600 border border-white/20 shadow-lg backdrop-blur-lg hover:brightness-110 transition-all"
      >
        ✨ הפעל כיול אוטומטי חכם
      </motion.button>
    </div>
  );
};
