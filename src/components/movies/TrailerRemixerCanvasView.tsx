'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { EraType, RemixResponse } from '@/lib/validations/trailer-remixer.schema';

interface TrailerRemixerCanvasViewProps {
  activeEra: EraType;
  remixData: RemixResponse | null;
  isLoading: boolean;
  onSelectEra: (era: EraType) => void;
}

export const TrailerRemixerCanvasView: React.FC<TrailerRemixerCanvasViewProps> = ({
  activeEra,
  remixData,
  isLoading,
  onSelectEra,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const eras: { id: EraType; label: string }[] = [
    { id: '80s_synthwave', label: 'סינת׳ווייב 80s' },
    { id: '50s_film_noir', label: 'פילם נואר 50s' },
    { id: 'cyberpunk_2099', label: 'סייברפאנק 2099' },
    { id: '70s_technicolor', label: 'טכניקולור 70s' },
  ];

  const playEraSynthTone = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio fallback
    }
  };

  return (
    <div dir="rtl" className="relative w-full p-6 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-[40px] shadow-2xl overflow-hidden text-right font-sans">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8A5CFF] animate-pulse" />
          ממקסס הטריילרים במסע בזמן AI
        </h3>
        <span className="text-xs text-[#00FFA3] font-['Inter'] uppercase tracking-widest font-mono">
          שיידר GPU בלייב
        </span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {eras.map((e) => (
          <button
            key={e.id}
            onClick={() => {
              onSelectEra(e.id);
              playEraSynthTone(remixData?.synthFrequencyHz || 440);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Outfit'] transition-all duration-200 border whitespace-nowrap ${
              activeEra === e.id
                ? 'bg-[#8A5CFF] text-white border-[#8A5CFF] shadow-[0_0_15px_rgba(138,92,255,0.5)]'
                : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/20'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-neutral-400 font-['Inter'] animate-pulse text-sm">
          מסנכרן מטריצת שיידרים אקוסטית ומשחזר תקופה...
        </div>
      ) : remixData ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ filter: remixData.colorFilterCss }}
          className="relative p-6 rounded-xl border border-white/20 bg-neutral-900/60 backdrop-blur-md shadow-inner transition-all duration-500"
        >
          <div className="text-xs font-extrabold text-[#00FFA3] tracking-widest uppercase mb-2 font-['Outfit']">
            {remixData.tagline}
          </div>
          <p className="text-base text-white leading-relaxed font-['Inter']">
            {remixData.remixedSynopsis}
          </p>
        </motion.div>
      ) : null}
    </div>
  );
};
