'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AuraResonance } from '@/lib/validations/aura';
import { Heart, Activity } from 'lucide-react';

interface AuraSeatViewProps {
  seats: AuraResonance[];
  selectedSeatId: string | null;
  hoveredSeat: AuraResonance | null;
  onSeatHover: (seat: AuraResonance | null) => void;
  onSeatSelect: (seat: AuraResonance) => void;
}

export const AuraSeatView: React.FC<AuraSeatViewProps> = ({
  seats,
  selectedSeatId,
  hoveredSeat,
  onSeatHover,
  onSeatSelect,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl bg-neutral-950/40 border border-white/10 text-right backdrop-blur-xl shadow-2xl relative overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-outfit text-white">מפת ההילה הביומטרית</h2>
            <p className="text-xs text-neutral-400 font-sans">התאמת מושבים ביומטרית & הילת תדר חברתית</p>
          </div>
        </div>
        {hoveredSeat && (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40">
            <Heart size={14} className="text-emerald-400" />
            <span>תאימות: {(hoveredSeat.compatibilityScore * 100).toFixed(0)}% ({hoveredSeat.occupantGenreAffinity})</span>
          </div>
        )}
      </div>

      {/* Screen Curved Header */}
      <div className="w-full h-8 mb-10 rounded-b-full border-b-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent flex items-center justify-center">
        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">מסך קולנוע קוונטי מרכזי</span>
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-6 gap-4 max-w-xl mx-auto py-4">
        {seats.map((seat) => {
          const isSelected = selectedSeatId === seat.seatId;

          return (
            <motion.button
              key={seat.seatId}
              onMouseEnter={() => onSeatHover(seat)}
              onMouseLeave={() => onSeatHover(null)}
              onClick={() => onSeatSelect(seat)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: isSelected
                  ? '0 0 25px #00FFA3'
                  : `0 0 ${seat.compatibilityScore * 15}px ${seat.glowColor}`,
              }}
              className={`h-12 rounded-2xl border flex flex-col items-center justify-center relative transition-all duration-300 ${
                seat.isBooked
                  ? 'bg-neutral-900 border-white/5 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-[#00FFA3] text-black font-bold border-[#00FFA3]'
                  : 'bg-neutral-950/80 border-white/10 hover:border-emerald-400/50'
              }`}
            >
              <span className="text-xs font-bold font-mono">
                {seat.row}{seat.number}
              </span>
              {!seat.isBooked && (
                <span className="text-[9px] opacity-80 font-mono">
                  {(seat.compatibilityScore * 100).toFixed(0)}%
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
