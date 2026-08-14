'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Heart, Compass, Zap, Film, Send } from 'lucide-react';

export interface MoodPreset {
  id: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
}

export const MOOD_PRESETS: MoodPreset[] = [
  { id: 'adrenaline', label: 'אדרנלין ואקשן שיא', icon: Flame, gradient: 'from-amber-500/20 to-red-600/20 border-amber-500/40 text-amber-300' },
  { id: 'mindbending', label: 'מסתורין ומדע בדיוני', icon: Zap, gradient: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300' },
  { id: 'emotional', label: 'עמוק, מרגש ומטלטל', icon: Heart, gradient: 'from-pink-500/20 to-purple-600/20 border-pink-500/40 text-pink-300' },
  { id: 'epic', label: 'אפוס קולנועי מרהיב', icon: Compass, gradient: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300' },
  { id: 'fun', label: 'קליל, מצחיק ומבדר', icon: Film, gradient: 'from-yellow-500/20 to-orange-600/20 border-yellow-500/40 text-yellow-300' },
];

interface AIMoodSelectorProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  customPrompt: string;
  onCustomPromptChange: (val: string) => void;
  onSubmitCustomPrompt: () => void;
  loading: boolean;
}

export function AIMoodSelector({
  selectedMood,
  onSelectMood,
  customPrompt,
  onCustomPromptChange,
  onSubmitCustomPrompt,
  loading,
}: AIMoodSelectorProps) {
  return (
    <div className="space-y-4" dir="rtl">
      {/* Preset Mood Pills Grid */}
      <div className="flex flex-wrap gap-2.5">
        {MOOD_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedMood === preset.label;

          return (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMood(preset.label)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                isSelected
                  ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                  : `bg-white/[0.04] hover:bg-white/[0.08] ${preset.gradient}`
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : ''}`} />
              <span>{preset.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom AI Prompt Input */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmitCustomPrompt()}
          placeholder="או תאר במילים שלך... (לדוגמה: משהו עם טוויסט עלילתי ענק ופסקול תזמורתי)"
          className="w-full bg-black/40 backdrop-blur-md border border-white/10 focus:border-primary/50 text-white placeholder-white/40 text-xs rounded-2xl py-3 pr-10 pl-12 outline-none transition-all"
        />
        <Sparkles className="w-4 h-4 text-primary/70 absolute right-3.5 pointer-events-none" />
        <button
          onClick={onSubmitCustomPrompt}
          disabled={loading || !customPrompt.trim()}
          className="absolute left-2 px-3 py-1.5 rounded-xl bg-primary text-black text-xs font-bold hover:brightness-110 disabled:opacity-30 transition-all flex items-center gap-1"
        >
          <span>נתח</span>
          <Send className="w-3 h-3 rotate-180" />
        </button>
      </div>
    </div>
  );
}

export default AIMoodSelector;
