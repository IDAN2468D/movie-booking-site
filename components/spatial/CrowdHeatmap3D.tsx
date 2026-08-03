'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Activity, Sparkles, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReactionPoint {
  id: string;
  row: number;
  col: number;
  emotion: 'excited' | 'scared' | 'amazed' | 'amused';
  intensity: number;
}

export const CrowdHeatmap3D: React.FC = () => {
  const [reactions, setReactions] = useState<ReactionPoint[]>([
    { id: 'r1', row: 2, col: 4, emotion: 'excited', intensity: 0.9 },
    { id: 'r2', row: 3, col: 7, emotion: 'amazed', intensity: 0.8 },
    { id: 'r3', row: 5, col: 2, emotion: 'scared', intensity: 0.95 },
    { id: 'r4', row: 4, col: 6, emotion: 'amused', intensity: 0.75 },
  ]);

  const emotionColors = {
    excited: 'from-amber-500 to-red-500 shadow-amber-500/50',
    scared: 'from-purple-600 to-indigo-700 shadow-purple-500/50',
    amazed: 'from-cyan-400 to-blue-600 shadow-cyan-400/50',
    amused: 'from-emerald-400 to-green-600 shadow-emerald-400/50',
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setReactions(prev => prev.map(r => ({
        ...r,
        intensity: Math.min(1, Math.max(0.3, r.intensity + (Math.random() * 0.4 - 0.2)))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-3xl bg-slate-950/80 border border-indigo-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.2)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-indigo-300">3D Real-Time Crowd Heatmap</h3>
            <p className="text-xs text-gray-400">מפת חום רגשית ופועם הפטי באולם הקולנוע בלייב</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
          <HeartPulse className="w-4 h-4 animate-ping" />
          <span>סנכרון קוונטי פעיל</span>
        </div>
      </div>

      {/* Grid 3D Auditorium Representation */}
      <div className="relative w-full h-64 rounded-2xl bg-black/60 border border-white/10 p-4 overflow-hidden flex flex-col justify-between perspective-1000">
        <div className="w-full h-6 bg-gradient-to-r from-indigo-500/20 via-cyan-500/40 to-indigo-500/20 rounded-lg border border-cyan-400/40 flex items-center justify-center text-[10px] text-cyan-300 tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          מסך קולנוע מרכזי IMAX 3D
        </div>

        <div className="grid grid-cols-10 gap-2 my-auto px-4 transform rotateX-12 transform-gpu">
          {Array.from({ length: 40 }).map((_, idx) => {
            const row = Math.floor(idx / 10);
            const col = idx % 10;
            const reaction = reactions.find(r => r.row === row && r.col === col);

            return (
              <div key={idx} className="relative aspect-square flex items-center justify-center">
                <div className="w-full h-full rounded-md bg-white/5 border border-white/10" />
                {reaction && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`absolute inset-0 rounded-md bg-gradient-to-tr ${emotionColors[reaction.emotion]} shadow-lg`}
                    style={{ opacity: reaction.intensity }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[10px] text-gray-400 px-2 pt-2 border-t border-white/5">
          <span>מקרא רגשות:</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500" /> התרגשות</span>
            <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500" /> מתח</span>
            <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-500" /> פליאה</span>
          </div>
        </div>
      </div>
    </div>
  );
};
