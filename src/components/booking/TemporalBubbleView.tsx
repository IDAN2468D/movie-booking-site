'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TemporalBubbleNode } from '@/lib/validations/temporal';
import { Clock, Calendar, ShieldAlert } from 'lucide-react';

interface TemporalBubbleViewProps {
  bubbles: TemporalBubbleNode[];
  selectedId: string | null;
  scrubPosition: number;
  onScrubChange: (val: number) => void;
  onSelectBubble: (node: TemporalBubbleNode) => void;
}

export const TemporalBubbleView: React.FC<TemporalBubbleViewProps> = ({
  bubbles,
  selectedId,
  scrubPosition,
  onScrubChange,
  onSelectBubble,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl bg-neutral-950/40 border border-white/10 text-right backdrop-blur-xl shadow-2xl relative overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-outfit text-white">סרגל הזמן הטיפוגרפי-נוזלי</h2>
            <p className="text-xs text-neutral-400 font-sans">זרימת זמן רציפה & הקרנות תלת-ממדיות בשבירת אור</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-800/40">
          <Calendar size={14} />
          <span>עומק Z: {scrubPosition}%</span>
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 mb-8">
        <div className="flex justify-between text-xs text-neutral-400 mb-2 font-sans">
          <span>ניווט ברצף הזמן הקוונטי</span>
          <span className="font-mono text-amber-400 font-outfit">זמן עתידי 3D</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={scrubPosition}
          onChange={(e) => onScrubChange(parseFloat(e.target.value))}
          className="w-full accent-amber-400 bg-neutral-800 h-2 rounded-lg cursor-pointer"
        />
      </div>

      {/* 3D Liquid Time Stream Horizon */}
      <div className="relative h-64 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-900/40 border border-white/5 backdrop-blur-md perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        <div className="flex items-center justify-center gap-6 z-10 w-full px-4 overflow-x-auto py-8">
          {bubbles.map((bubble, idx) => {
            const isSelected = selectedId === bubble.id;
            const distance = Math.abs(scrubPosition - (idx + 1) * 20);
            const scale = Math.max(0.7, 1.2 - distance * 0.008);
            const opacity = Math.max(0.4, 1 - distance * 0.012);

            return (
              <motion.div
                key={bubble.id}
                onClick={() => onSelectBubble(bubble)}
                animate={{
                  scale: isSelected ? 1.25 : scale,
                  opacity: opacity,
                  z: bubble.depthZ,
                }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                className={`flex-shrink-0 cursor-pointer p-5 rounded-3xl border transition-all duration-300 relative flex flex-col items-center justify-center min-w-[140px] text-center ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] backdrop-blur-2xl'
                    : 'bg-neutral-950/70 border-white/10 hover:border-amber-400/50 backdrop-blur-xl'
                }`}
                style={{
                  boxShadow: isSelected
                    ? '0 10px 40px -10px rgba(245, 158, 11, 0.5)'
                    : 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                <span className="text-2xl font-black font-outfit text-white tracking-wider mb-1">
                  {bubble.time}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 mb-2">
                  {bubble.format}
                </span>
                <span className="text-xs text-neutral-300 font-sans">
                  ₪{bubble.price} • {bubble.availableSeats} מקומות
                </span>
                {bubble.availableSeats < 10 && (
                  <span className="mt-1 text-[9px] text-rose-400 font-bold flex items-center gap-1">
                    <ShieldAlert size={10} /> אחרונים
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
