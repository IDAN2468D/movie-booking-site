'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FrequencySliderViewProps {
  alignment: number;
  threshold: 'low' | 'medium' | 'high';
  onAlignmentChange: (val: number) => void;
  onThresholdChange: (t: 'low' | 'medium' | 'high') => void;
  onTriggerPreset: () => void;
  targetFreq: number;
}

export const FrequencySliderView: React.FC<FrequencySliderViewProps> = ({
  alignment,
  threshold,
  onAlignmentChange,
  onThresholdChange,
  onTriggerPreset,
  targetFreq,
}) => {
  return (
    <div className="w-full space-y-4 p-5 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-xl shadow-xl">
      <div className="flex justify-between items-center text-sm">
        <span className="font-outfit font-semibold text-neutral-200">
          Acoustic Low-Pass Calibration
        </span>
        <span className="font-mono text-xs text-purple-400">
          {targetFreq} Hz Target
        </span>
      </div>

      {/* Glass Range Slider */}
      <div className="relative w-full flex items-center">
        <input
          type="range"
          min="0"
          max="100"
          value={alignment}
          onChange={(e) => onAlignmentChange(Number(e.target.value))}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
      </div>

      {/* Threshold Selector Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {(['low', 'medium', 'high'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onThresholdChange(mode)}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono capitalize transition-all border ${
              threshold === mode
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {mode} Sensitivity
          </button>
        ))}
      </div>

      {/* Preset Warm-Up Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onTriggerPreset}
        className="w-full py-2.5 rounded-xl font-outfit text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500/80 via-blue-600/80 to-purple-600/80 border border-white/20 shadow-lg backdrop-blur-lg hover:brightness-110 transition-all"
      >
        ✨ Initiate Synaptic Auto-Warmup
      </motion.button>
    </div>
  );
};
