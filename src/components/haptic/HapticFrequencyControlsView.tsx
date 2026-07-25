'use client';

import React from 'react';
import { HapticPreset } from '@/lib/validations/haptic';
import { Sliders, Sparkles, Shield, Film, Flame, Wind } from 'lucide-react';

interface HapticFrequencyControlsViewProps {
  preset: HapticPreset;
  subBassFrequency: number;
  hapticIntensity: number;
  isCalibrating: boolean;
  onPresetChange: (preset: HapticPreset) => void;
  onFrequencyChange: (freq: number) => void;
  onIntensityChange: (intensity: number) => void;
  onCalibrate: () => void;
}

const PRESETS: { id: HapticPreset; label: string; icon: any; freq: number }[] = [
  { id: 'sci-fi', label: 'מדע בדיוני (Sci-Fi)', icon: Film, freq: 40 },
  { id: 'action', label: 'אקשן עוצמתי (Action)', icon: Flame, freq: 65 },
  { id: 'thriller', label: 'מתח עמוק (Thriller)', icon: Shield, freq: 30 },
  { id: 'ambient', label: 'אווירה מרגיעה (Ambient)', icon: Wind, freq: 45 },
];

export const HapticFrequencyControlsView: React.FC<HapticFrequencyControlsViewProps> = ({
  preset,
  subBassFrequency,
  hapticIntensity,
  isCalibrating,
  onPresetChange,
  onFrequencyChange,
  onIntensityChange,
  onCalibrate,
}) => {
  return (
    <div className="w-full p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">בקרת תדרים וכיול הפטי</h3>
            <p className="text-xs text-slate-400 font-inter">התאם אישית את עוצמת הבאס וקצב הרטט במכשיר</p>
          </div>
        </div>

        <button
          onClick={onCalibrate}
          disabled={isCalibrating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold font-inter shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isCalibrating ? 'animate-spin' : ''}`} />
          <span>{isCalibrating ? 'מכייל תהודה...' : 'כיול AI אוטומטי'}</span>
        </button>
      </div>

      {/* Preset selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          const isActive = preset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                onPresetChange(p.id);
                onFrequencyChange(p.freq);
              }}
              className={`p-3.5 rounded-2xl border text-xs font-bold font-inter flex items-center gap-2.5 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300 font-inter">תדר סאב-באס (Sub-Bass)</span>
            <span className="font-mono text-cyan-400">{subBassFrequency} Hz</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={subBassFrequency}
            onChange={(e) => onFrequencyChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10 accent-cyan-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300 font-inter">עוצמת רטט הפטי (Haptic Pulse)</span>
            <span className="font-mono text-cyan-400">{Math.round(hapticIntensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={hapticIntensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10 accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
};
