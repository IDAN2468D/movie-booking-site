'use client';

import React from 'react';
import { CineDnaNodeType } from '@/lib/schemas/cineDna.schema';
import { Film, User, Music, Camera, Sparkles, Palette } from 'lucide-react';

interface DnaFilterControlsProps {
  activeFilters: CineDnaNodeType[];
  onToggleFilter: (type: CineDnaNodeType) => void;
}

const FILTER_CONFIG: { type: CineDnaNodeType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { type: 'movie', label: 'סרטי ליבה', icon: Film },
  { type: 'director', label: 'במאים', icon: User },
  { type: 'composer', label: 'פסקול ומלחינים', icon: Music },
  { type: 'cinematographer', label: 'צילום ועדשות', icon: Camera },
  { type: 'theme', label: 'מוטיבים ותמות', icon: Sparkles },
  { type: 'color_palette', label: 'פלטת צבעים', icon: Palette },
];

export function DnaFilterControls({ activeFilters, onToggleFilter }: DnaFilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-lg">
      <span className="text-xs font-bold text-off-white/60 px-2">סינון גנים:</span>
      {FILTER_CONFIG.map(({ type, label, icon: Icon }) => {
        const isActive = activeFilters.includes(type);
        return (
          <button
            key={type}
            onClick={() => onToggleFilter(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-primary/30 to-cyan-500/30 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 text-off-white/60 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-off-white/40'} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
