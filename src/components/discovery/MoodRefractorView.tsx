'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoodInput, MoodRecommendation } from '@/lib/validations/mood';
import { Sparkles, Sliders, Volume2 } from 'lucide-react';

interface MoodRefractorViewProps {
  mood: MoodInput;
  blurRadius: number;
  recommendations: MoodRecommendation[];
  onMoodChange: (key: keyof MoodInput, value: number) => void;
  onPresetSelect: (preset: MoodInput['preset']) => void;
  onHoverAudio: (freq: number) => void;
}

export const MoodRefractorView: React.FC<MoodRefractorViewProps> = ({
  mood,
  blurRadius,
  recommendations,
  onMoodChange,
  onPresetSelect,
  onHoverAudio,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl bg-neutral-950/40 border border-white/10 text-right backdrop-blur-xl shadow-2xl relative overflow-hidden" dir="rtl">
      {/* Background Chromatic Refraction Shader Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30 transition-all duration-700"
        style={{
          backdropFilter: `blur(${blurRadius}px) saturate(200%)`,
          background: `radial-gradient(circle at 50% 50%, rgba(0,255,200,${mood.valence * 0.3}) 0%, rgba(147,51,234,${mood.arousal * 0.3}) 70%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sliders size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-outfit text-white">מנוע המיפוי הסינסתזי</h2>
              <p className="text-xs text-neutral-400 font-sans">כיוונון ביומטרי רגשי & שבירת אור זכוכית נוזלית</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
            רמת טשטוש: {blurRadius} פיקסלים
          </span>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'melancholy', label: 'מלנכוליה עמוקה', val: { valence: 0.2, arousal: 0.3, dominance: 0.4 } },
            { id: 'hype', label: 'אדרנלין קוונטי', val: { valence: 0.9, arousal: 0.95, dominance: 0.8 } },
            { id: 'cyber_euphoria', label: 'סייבר יופוריה', val: { valence: 0.85, arousal: 0.7, dominance: 0.9 } },
            { id: 'cosmic_horror', label: 'אימה קוסמית', val: { valence: 0.15, arousal: 0.8, dominance: 0.2 } },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => onPresetSelect(p.id as MoodInput['preset'])}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 transition-all font-outfit"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-white/5">
            <div className="flex justify-between text-xs text-neutral-300 mb-2 font-sans">
              <span>ולנטיות (חיוביות)</span>
              <span className="font-mono text-cyan-400">{(mood.valence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={mood.valence}
              onChange={(e) => onMoodChange('valence', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-white/5">
            <div className="flex justify-between text-xs text-neutral-300 mb-2 font-sans">
              <span>עוררות אדרנלין</span>
              <span className="font-mono text-purple-400">{(mood.arousal * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={mood.arousal}
              onChange={(e) => onMoodChange('arousal', parseFloat(e.target.value))}
              className="w-full accent-purple-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-white/5">
            <div className="flex justify-between text-xs text-neutral-300 mb-2 font-sans">
              <span>עוצמה וציטוט</span>
              <span className="font-mono text-amber-400 font-sans">{(mood.dominance * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={mood.dominance}
              onChange={(e) => onMoodChange('dominance', parseFloat(e.target.value))}
              className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Recommendations list */}
        <div className="mt-2 flex flex-col gap-3">
          <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            המלצות סרטים מותאמות תדר
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.map((item, idx) => (
              <motion.div
                key={item.id}
                onMouseEnter={() => onHoverAudio(220 + idx * 110)}
                whileHover={{ scale: 1.03 }}
                className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 right-0 left-0 h-1"
                  style={{ background: item.refractionColor }}
                />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md">
                    {item.matchScore}% התאמה
                  </span>
                  <Volume2 size={14} className="text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1 font-outfit">{item.title}</h4>
                <span className="text-[11px] text-neutral-400 block mb-2">{item.genre}</span>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
