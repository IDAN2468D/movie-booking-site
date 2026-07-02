"use client";

import React, { useOptimistic, useTransition, useEffect, useState } from "react";
import { ISeat } from "@/lib/models/ShowtimeSeats";
import { lockSeatAction, releaseSeatAction, seedShowtimeSeats } from "@/app/actions/seatActions";

export function DynamicSeatMap({ showtimeId, userId }: { showtimeId: string; userId: string }) {
  const [serverSeats, setServerSeats] = useState<ISeat[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load and seed seats
  useEffect(() => {
    async function load() {
      const res = await seedShowtimeSeats(showtimeId);
      if (res.success && res.data) {
        setServerSeats(res.data.seats);
      }
    }
    load();
  }, [showtimeId]);

  const [optimisticSeats, setOptimisticSeats] = useOptimistic<ISeat[], { seatId: string; newStatus: ISeat['status']; lockedBy: string | null }>(
    serverSeats,
    (state, { seatId, newStatus, lockedBy }) =>
      state.map((s) => (s.seatId === seatId ? { ...s, status: newStatus, lockedBy } : s))
  );

  const handleSeatClick = (seat: ISeat) => {
    if (seat.status === 'occupied') return;
    if (seat.status === 'locked' && seat.lockedBy !== userId) return; // Locked by someone else

    startTransition(async () => {
      setErrorMsg(null);
      const isCurrentlyLockedByMe = seat.status === 'locked' && seat.lockedBy === userId;

      // Optimistically update
      setOptimisticSeats({ 
        seatId: seat.seatId, 
        newStatus: isCurrentlyLockedByMe ? 'available' : 'locked', 
        lockedBy: isCurrentlyLockedByMe ? null : userId 
      });

      // Call server
      const payload = { showtimeId, seatId: seat.seatId, userId };
      const res = isCurrentlyLockedByMe 
        ? await releaseSeatAction(payload)
        : await lockSeatAction(payload);

      if (res.success && res.data) {
        setServerSeats(res.data.seats);
      } else if (res.error) {
        setErrorMsg(res.error);
        // Revert will happen automatically since optimistic uses serverSeats as base
      }
    });
  };

  // Group seats by row for rendering
  const rows = optimisticSeats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, ISeat[]>);

  const rowKeys = Object.keys(rows).sort();

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-['Assistant',_'Rubik',_sans-serif] p-4 md:p-12 overflow-hidden flex flex-col items-center" dir="rtl">
      
      <header className="mb-8 text-center z-10">
        <h1 className="text-3xl md:text-5xl font-bold leading-relaxed text-transparent bg-clip-text bg-gradient-to-l from-[#00F0FF] to-blue-500 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          בחירת מושבים
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed py-1">
          תא הטייס ההולוגרפי מופעל. בחר את מיקומך.
        </p>
      </header>

      {errorMsg && (
        <div className="mb-6 z-10 px-6 py-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 backdrop-blur-md leading-relaxed shadow-lg">
          {errorMsg}
        </div>
      )}

      {/* Isometric Wrapper */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center mt-12" style={{ perspective: '1000px' }}>
        
        {/* Thematic Screen Glow */}
        <div 
          className="w-3/4 h-24 mb-16 rounded-t-full bg-gradient-to-t from-[#00F0FF]/30 to-transparent border-t border-[#00F0FF]/50 shadow-[0_-20px_60px_rgba(0,240,255,0.2)]"
          style={{ transform: 'rotateX(-10deg)' }}
        >
          <p className="text-center mt-4 text-[#00F0FF]/70 text-xs font-bold tracking-[0.2em] uppercase">המסך</p>
        </div>

        {/* 3D Seat Matrix */}
        <div 
          className="flex flex-col space-y-4 items-center transition-transform duration-1000"
          style={{ transform: 'rotateX(20deg)' }}
        >
          {rowKeys.map((rowKey) => {
            const sortedSeats = rows[rowKey].sort((a, b) => a.col - b.col);
            
            return (
              <div key={rowKey} className="flex items-center space-x-6 space-x-reverse">
                {/* Row Indicator */}
                <div className="w-8 text-center">
                  <span className="text-gray-400 text-sm font-bold leading-relaxed drop-shadow-md">
                    {rowKey}'
                  </span>
                </div>
                
                {/* Seats */}
                <div className="flex space-x-3 space-x-reverse">
                  {sortedSeats.map((seat) => {
                    const isOccupied = seat.status === 'occupied';
                    const isLockedByMe = seat.status === 'locked' && seat.lockedBy === userId;
                    const isLockedByOther = seat.status === 'locked' && seat.lockedBy !== userId;
                    const isVip = seat.type === 'vip';
                    
                    let seatClasses = "w-8 h-8 md:w-10 md:h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-xs font-bold transition-all duration-300 backdrop-blur-md bg-slate-900/40 border border-white/10 cursor-pointer ";
                    
                    if (isOccupied || isLockedByOther) {
                      seatClasses += " opacity-40 border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] pointer-events-none ";
                    } else if (isLockedByMe) {
                      seatClasses += " bg-[#00F0FF]/40 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.7)] text-white scale-110 ";
                    } else if (isVip) {
                      seatClasses += " hover:bg-[#FFB800]/20 hover:border-[#FFB800] hover:shadow-[0_0_15px_rgba(255,184,0,0.5)] text-gray-300 ";
                      // Optional default neon amber highlight for VIP
                      seatClasses += " border-[#FFB800]/30 shadow-[0_0_5px_rgba(255,184,0,0.2)] ";
                    } else {
                      seatClasses += " hover:bg-[#00F0FF]/20 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] text-gray-400 ";
                    }

                    return (
                      <button
                        key={seat.seatId}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isOccupied || isLockedByOther || isPending}
                        className={seatClasses}
                      >
                        {seat.col}
                      </button>
                    );
                  })}
                </div>
                
                {/* Right Row Indicator */}
                <div className="w-8 text-center">
                  <span className="text-gray-400 text-sm font-bold leading-relaxed drop-shadow-md">
                    {rowKey}'
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-16 flex flex-wrap justify-center items-center gap-6 z-10 backdrop-blur-md bg-white/5 px-8 py-4 rounded-full border border-white/10">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-5 h-5 rounded bg-slate-900/40 border border-white/10"></div>
          <span className="text-sm text-gray-300 leading-relaxed py-1">פנוי</span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-5 h-5 rounded bg-slate-900/40 border border-[#FFB800]/50 shadow-[0_0_5px_rgba(255,184,0,0.3)]"></div>
          <span className="text-sm text-gray-300 leading-relaxed py-1">VIP</span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-5 h-5 rounded bg-[#00F0FF]/40 border border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
          <span className="text-sm text-gray-300 leading-relaxed py-1">נבחר</span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-5 h-5 rounded border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] opacity-40"></div>
          <span className="text-sm text-gray-300 leading-relaxed py-1">תפוס</span>
        </div>
      </div>

    </div>
  );
}
