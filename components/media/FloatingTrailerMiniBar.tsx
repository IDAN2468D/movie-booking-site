'use client';

import React from 'react';
import { X, Maximize2, Play } from 'lucide-react';

interface FloatingTrailerMiniBarProps {
  movieTitle: string;
  onMaximize: () => void;
  onClose: () => void;
}

export function FloatingTrailerMiniBar({
  movieTitle,
  onMaximize,
  onClose,
}: FloatingTrailerMiniBarProps) {
  return (
    <div className="flex items-center gap-3 p-2.5 px-4 rounded-full bg-neutral-950/95 backdrop-blur-2xl border border-primary/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
      <Play className="w-4 h-4 text-primary shrink-0" />
      <span className="text-xs font-semibold text-white/90 truncate max-w-[160px]">
        {movieTitle || 'טריילר פעיל'}
      </span>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onMaximize}
        className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        title="הגדל נגן"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors"
        title="סגור נגן"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default FloatingTrailerMiniBar;
