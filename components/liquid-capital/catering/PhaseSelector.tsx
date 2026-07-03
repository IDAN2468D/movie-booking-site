'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface PhaseSelectorProps {
  itemId: string;
  currentPhase: 'Trailers' | 'Act 1' | 'Climax';
  onChange: (phase: 'Trailers' | 'Act 1' | 'Climax') => void;
}

const PHASES: { id: 'Trailers' | 'Act 1' | 'Climax'; label: string; time: string }[] = [
  { id: 'Trailers', label: 'קדימונים', time: 'T-0 min' },
  { id: 'Act 1', label: 'מערכה 1', time: 'T+20 min' },
  { id: 'Climax', label: 'שיא הסרט', time: 'T+75 min' },
];

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({ itemId, currentPhase, onChange }) => {
  return (
    <div className="flex flex-col gap-2 w-full text-right">
      <div className="flex items-center gap-2 justify-end text-white/50 text-xs">
        <span>תזמון הגשה לשלב המוקרן</span>
        <Clock className="w-3.5 h-3.5" />
      </div>
      
      <div className="relative grid grid-cols-3 bg-black/40 rounded-xl p-1 border border-white/5 overflow-hidden">
        {PHASES.map((phase) => {
          const isActive = currentPhase === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => onChange(phase.id)}
              className="relative py-2 text-xs font-bold transition-colors z-10 flex flex-col items-center justify-center cursor-pointer"
              style={{ contentVisibility: 'auto' }}
            >
              {isActive && (
                <motion.div
                  layoutId={`phase-bg-${itemId}`}
                  className="absolute inset-0 bg-[#00f2fe]/20 border border-[#00f2fe]/30 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  style={{ willChange: 'transform' }} // hardware acceleration
                />
              )}
              <span className={`${isActive ? 'text-[#00f2fe]' : 'text-white/60 hover:text-white'}`}>
                {phase.label}
              </span>
              <span className="text-[9px] text-white/40 font-medium">
                {phase.time}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
