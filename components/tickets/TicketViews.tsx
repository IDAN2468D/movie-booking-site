'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Star } from 'lucide-react';

interface CountdownViewProps {
  timeLeft: { hours: number; minutes: number; seconds: number };
}

export function TicketCountdownView({ timeLeft }: CountdownViewProps) {
  const units = [
    { val: timeLeft.hours, label: 'שעות' },
    { val: timeLeft.minutes, label: 'דקות' },
    { val: timeLeft.seconds, label: 'שניות' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 flex flex-col items-center justify-center h-full text-center"
    >
      <span className="text-[11px] font-black text-primary tracking-[0.3em] uppercase">הספירה לאחור החלה</span>
      <div className="flex gap-4 justify-center">
        {units.map((unit, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
              <span className="text-xl font-black font-mono text-white">
                {unit.val.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold mt-1.5">{unit.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface QrViewProps {
  ticketId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TicketQrView({ ticketId }: QrViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center h-full py-4 space-y-4"
    >
      <div className="p-4 bg-white rounded-3xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        <QrCode size={90} className="text-black" />
      </div>
      <p className="text-[10px] font-black text-slate-400">הקש להגדלה וסריקה</p>
    </motion.div>
  );
}

interface MemoryViewProps {
  userRating: number;
  setUserRating: (rating: number) => void;
  personalNote: string;
  setPersonalNote: (note: string) => void;
}

export function TicketMemoryView({
  userRating,
  setUserRating,
  personalNote,
  setPersonalNote
}: MemoryViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3 text-right py-2 h-full"
    >
      <span className="text-[11px] font-black text-yellow-400 tracking-[0.2em] uppercase block">זיכרון קולנועי</span>
      <div className="flex gap-1 justify-start">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={(e) => {
              e.stopPropagation();
              setUserRating(star);
            }}
            className="text-yellow-400 transition-transform hover:scale-125"
          >
            <Star size={16} fill={userRating >= star ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      <textarea
        value={personalNote}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setPersonalNote(e.target.value)}
        placeholder="איך הייתה החוויה שלך?"
        className="w-full h-16 p-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none custom-scrollbar"
      />
    </motion.div>
  );
}
