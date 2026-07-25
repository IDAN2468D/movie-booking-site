'use client';

import React from 'react';
import { ScaleType } from '@/lib/validations/synth';
import { Sliders, Volume2, Music, Radio, Disc, Sparkles } from 'lucide-react';

interface SynthOscillatorControlsViewProps {
  scale: ScaleType;
  tempoBpm: number;
  cutoffFreqHz: number;
  activeLayers: {
    bassDrone: boolean;
    arpeggio: boolean;
    harmonicPad: boolean;
    subBass: boolean;
  };
  isGenerating: boolean;
  onScaleChange: (scale: ScaleType) => void;
  onTempoChange: (bpm: number) => void;
  onCutoffChange: (freq: number) => void;
  onToggleLayer: (layer: 'bassDrone' | 'arpeggio' | 'harmonicPad' | 'subBass') => void;
  onGeneratePreset: () => void;
}

const SCALE_PRESETS: { id: ScaleType; label: string }[] = [
  { id: 'cinematic_minor', label: 'דרמה קולנועית' },
  { id: 'sci_fi_major', label: 'סייבר קוונטי' },
  { id: 'dark_thriller', label: 'מתח אפל' },
  { id: 'ambient_harmony', label: 'אווירה הרמונית' },
];

export const SynthOscillatorControlsView: React.FC<SynthOscillatorControlsViewProps> = ({
  scale,
  tempoBpm,
  cutoffFreqHz,
  activeLayers,
  isGenerating,
  onScaleChange,
  onTempoChange,
  onCutoffChange,
  onToggleLayer,
  onGeneratePreset,
}) => {
  return (
    <div className="w-full p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] font-inter space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">בקרת סינתיסייזר ושכבות סאונד</h3>
            <p className="text-xs text-slate-400">בחר סולם מוזיקלי, התאם קצב והפעל שכבות אודיו</p>
          </div>
        </div>

        <button
          onClick={onGeneratePreset}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold font-inter shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'מחשב הרמוניה...' : 'חולל פסקול AI'}</span>
        </button>
      </div>

      {/* Scale presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SCALE_PRESETS.map((p) => {
          const isActive = scale === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onScaleChange(p.id)}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Layers Toggle Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onToggleLayer('bassDrone')}
          className={`p-3.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all ${
            activeLayers.bassDrone
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,159,10,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-slate-500'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>באס דרון</span>
        </button>

        <button
          onClick={() => onToggleLayer('arpeggio')}
          className={`p-3.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all ${
            activeLayers.arpeggio
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-slate-500'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>ארפג'יו סייבר</span>
        </button>

        <button
          onClick={() => onToggleLayer('harmonicPad')}
          className={`p-3.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all ${
            activeLayers.harmonicPad
              ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-slate-500'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>פאד הרמוני</span>
        </button>

        <button
          onClick={() => onToggleLayer('subBass')}
          className={`p-3.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all ${
            activeLayers.subBass
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-slate-500'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>סאב-באס</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300 font-inter">קצב (BPM)</span>
            <span className="font-mono text-cyan-400">{tempoBpm} BPM</span>
          </div>
          <input
            type="range"
            min="60"
            max="180"
            value={tempoBpm}
            onChange={(e) => onTempoChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10 accent-cyan-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300 font-inter">פילטר תדרים (Filter Cutoff)</span>
            <span className="font-mono text-cyan-400">{cutoffFreqHz} Hz</span>
          </div>
          <input
            type="range"
            min="200"
            max="8000"
            step="100"
            value={cutoffFreqHz}
            onChange={(e) => onCutoffChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10 accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
};
