'use client';

import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import ShowtimeSelector from '@/components/booking/ShowtimeSelector';
import SeatMap from '@/components/booking/SeatMap';
import { RightPanelSnackGrid } from './RightPanelSnackGrid';

interface Props {
  showtimeId: string;
  userId: string;
  seatCount: number;
}

export const RightPanelLiveCinemaCard: React.FC<Props> = ({
  showtimeId,
  userId,
  seatCount,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="gradient-border-card group relative bg-gradient-to-br from-white/[0.05] to-transparent rounded-[40px] p-8 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden text-right"
    >
      {/* Radial Gradient Border Mask */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: 'radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), rgba(255, 159, 10, 0.95), rgba(59, 130, 246, 0.8), transparent 70%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="flex items-center gap-4 mb-8 relative z-10 justify-end">
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">מיקום שידור חי</p>
          <p className="text-lg text-white font-black tracking-tight">קולנוע נייטהוק VIP</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg">
          <Calendar className="text-primary w-6 h-6" />
        </div>
      </div>

      <div id="booking-section" className="space-y-8 relative z-10">
        <ShowtimeSelector />

        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,159,10,0.5)]" />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">נבחר ({seatCount})</span>
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-60">בחירת מושבים בלייב</h3>
          </div>
          <SeatMap showtimeId={showtimeId} userId={userId} occupiedSeats={[]} compact />
        </div>

        <div className="pt-8 border-t border-white/10">
          <RightPanelSnackGrid />
        </div>
      </div>
    </div>
  );
};
