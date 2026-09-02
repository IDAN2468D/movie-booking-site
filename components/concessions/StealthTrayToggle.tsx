'use client';

import React from 'react';
import { Moon, Eye } from 'lucide-react';
import { useStealthTrayStore } from '@/lib/store/stealthTrayStore';

export const StealthTrayToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isStealthActive, toggleStealthMode } = useStealthTrayStore();

  return (
    <button
      onClick={() => toggleStealthMode(true)}
      title="מצב מגש שקט באולם (Stealth Tray Mode)"
      aria-label="מצב מגש שקט באולם"
      className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10 bg-zinc-950/80 backdrop-blur-md hover:bg-zinc-900 text-amber-400 hover:text-amber-300 shadow-md ${className}`}
      dir="rtl"
    >
      <Moon className="w-3.5 h-3.5 text-amber-400" />
      <span className="hidden sm:inline">מגש שקט</span>
    </button>
  );
};
