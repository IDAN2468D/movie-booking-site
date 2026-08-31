'use client';

import React from 'react';
import { CommentaryPersona } from '@/lib/schemas/directorsCut.schema';
import { Clapperboard, Camera, BookOpen, Sparkles } from 'lucide-react';

interface PersonaSelectorProps {
  selectedPersona: CommentaryPersona;
  onSelectPersona: (persona: CommentaryPersona) => void;
}

const PERSONA_CONFIG: {
  id: CommentaryPersona;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: 'director', label: 'במאי ראשי', sub: 'חזון דרמטי ומשחק', icon: Clapperboard },
  { id: 'cinematographer', label: 'צלם (DP)', sub: 'תאורה, זוויות ועדשות', icon: Camera },
  { id: 'critic', label: 'מבקר קולנוע', sub: 'ניתוח עומק ומבנה', icon: BookOpen },
  { id: 'easter_egg_hunter', label: 'צייד Easter Eggs', sub: 'רמזים וסודות רקע', icon: Sparkles },
];

export function PersonaSelector({ selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-right" dir="rtl">
      {PERSONA_CONFIG.map(({ id, label, sub, icon: Icon }) => {
        const isSelected = selectedPersona === id;

        return (
          <button
            key={id}
            onClick={() => onSelectPersona(id)}
            className={`p-4 rounded-2xl border text-right transition-all duration-300 flex flex-col gap-2 ${
              isSelected
                ? 'bg-gradient-to-tr from-cyan-500/20 to-primary/20 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-off-white/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <Icon size={20} className={isSelected ? 'text-cyan-400' : 'text-off-white/40'} />
              {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
            </div>
            <div>
              <p className={`text-sm font-black font-rubik ${isSelected ? 'text-white' : 'text-off-white/80'}`}>
                {label}
              </p>
              <p className="text-[11px] text-off-white/50">{sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
