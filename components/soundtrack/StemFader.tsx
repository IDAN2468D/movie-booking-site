'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface StemFaderProps {
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  value: number;
  color: string;
  isMuted: boolean;
  onChange: (val: number) => void;
  onToggleMute: () => void;
}

export const StemFader: React.FC<StemFaderProps> = ({
  label,
  subLabel,
  icon,
  value,
  color,
  isMuted,
  onChange,
  onToggleMute,
}) => {
  return (
    <div className="flex flex-col items-center bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 p-4 rounded-2xl transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)] w-full">
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${color}`}>
            {icon}
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-white block">{label}</span>
            <span className="text-[10px] text-gray-400 block">{subLabel}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleMute}
          className={`p-1.5 rounded-lg transition-all ${
            isMuted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
          }`}
          title={isMuted ? 'בטל השתקה' : 'השתק ערוץ'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="relative flex flex-col items-center w-full my-2">
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : value}
          disabled={isMuted}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400 disabled:opacity-40"
        />
        <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-gray-400">
          <span>0%</span>
          <span className={`font-bold ${isMuted ? 'text-rose-400' : 'text-amber-400'}`}>
            {isMuted ? 'מושתק' : `${value}%`}
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
