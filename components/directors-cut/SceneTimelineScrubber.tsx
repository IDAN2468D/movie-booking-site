'use client';

import React from 'react';
import { CommentarySegment } from '@/lib/schemas/directorsCut.schema';
import { Clock } from 'lucide-react';

interface SceneTimelineScrubberProps {
  segments: CommentarySegment[];
  currentSec: number;
  activeSegmentIndex: number;
  onSeek: (sec: number) => void;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function SceneTimelineScrubber({
  segments,
  currentSec,
  activeSegmentIndex,
  onSeek,
}: SceneTimelineScrubberProps) {
  const maxSec = Math.max(120, ...(segments.map((s) => s.timestampSec) || [120]));

  return (
    <div className="p-5 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 space-y-4" dir="rtl">
      <div className="flex items-center justify-between text-xs font-bold text-off-white/70">
        <span className="flex items-center gap-1">
          <Clock size={14} className="text-cyan-400" />
          ציר זמן וסצנות מפתח
        </span>
        <span className="font-mono text-cyan-300 font-bold">{formatTime(currentSec)}</span>
      </div>

      {/* Progress Track */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-primary rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, (currentSec / maxSec) * 100)}%` }}
        />
      </div>

      {/* Segments Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {segments.map((seg, idx) => {
          const isActive = idx === activeSegmentIndex;

          return (
            <button
              key={seg.id}
              onClick={() => onSeek(seg.timestampSec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 border border-white/5 text-off-white/60 hover:bg-white/10'
              }`}
            >
              <span className="font-mono text-[10px] text-off-white/40">{formatTime(seg.timestampSec)}</span>
              <span>{seg.sceneName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
