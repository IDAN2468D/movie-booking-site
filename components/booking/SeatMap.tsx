"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBookingStore } from "@/lib/store";

interface SeatMapProps {
  showtimeId: string;
  userId: string;
  occupiedSeats?: string[];
  onSeatLocked?: (seatId: string) => void;
  compact?: boolean;
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function SeatMap({ showtimeId, userId, occupiedSeats = [], onSeatLocked, compact = false }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [loadingLocks, setLoadingLocks] = useState<Set<string>>(new Set());
  const globalSelectedSeats = useBookingStore((state) => state.selectedSeats);

  const handleSeatClick = async (seatId: string) => {
    if (occupiedSeats.includes(seatId) || selectedSeats.has(seatId) || globalSelectedSeats.includes(seatId) || loadingLocks.has(seatId)) {
      return;
    }

    setLoadingLocks(prev => {
      const next = new Set(prev);
      next.add(seatId);
      return next;
    });

    try {
      const res = await fetch("/api/seats/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showtimeId, seatId, userId }),
      });
      const data = await res.json();

      if (data.success && data.data?.locked) {
        setSelectedSeats(prev => {
          const next = new Set(prev);
          next.add(seatId);
          return next;
        });
        if (onSeatLocked) onSeatLocked(seatId);
      } else {
        console.error("Lock failed:", data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoadingLocks(prev => {
        const next = new Set(prev);
        next.delete(seatId);
        return next;
      });
    }
  };

  return (
    <div className={`w-full max-w-[600px] mx-auto ${compact ? 'px-2 py-4' : 'px-6 py-8 md:px-16 md:py-10'} rounded-[3rem] bg-[#090b10] border border-white/5 shadow-2xl relative overflow-hidden`} dir="ltr">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Top Bar with Toggles */}
      <div className={`flex justify-between items-center ${compact ? 'mb-8' : 'mb-16'} relative z-10`} dir="rtl">
        <button className="px-5 py-2 rounded-full border border-white/10 text-white/60 text-[11px] font-['Outfit'] font-bold hover:bg-white/5 transition-colors tracking-wide">
          הזמנה אישית
        </button>
        <button className="px-5 py-2 rounded-full border border-white/10 text-white/60 text-[11px] font-['Outfit'] font-bold flex items-center gap-2 hover:bg-white/5 transition-colors tracking-wide">
          מפת חום <span className="opacity-70">🔥</span>
        </button>
      </div>

      {/* Screen Arc */}
      <div className={`flex flex-col items-center ${compact ? 'mb-6' : 'mb-12'} relative z-10`}>
        <div className="w-[85%] h-6 rounded-t-[100%] border-t-[3px] border-cyan-400 opacity-90 shadow-[0_-10px_20px_rgba(34,211,238,0.2)]" />
        <span className="text-cyan-400 font-['Outfit'] tracking-[0.4em] text-[10px] mt-2 font-bold opacity-80">מסך</span>
      </div>

      {/* Seat Matrix */}
      <div className="flex flex-col gap-3 items-center relative z-10 pb-4">
        {ROWS.map((row) => (
          <div key={row} className={`flex ${compact ? 'gap-2' : 'gap-4'} items-center w-full justify-center`}>
            <div className={`w-4 text-left font-['Outfit'] font-bold text-white/30 uppercase ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{row}</div>
            
            <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
              {/* Left Block (Seats 1-3) */}
              <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
                {Array.from({ length: 3 }).map((_, idx) => {
                  const seatId = `${row}${idx + 1}`;
                  return (
                    <Seat
                      key={seatId}
                      seatId={seatId}
                      isOccupied={occupiedSeats.includes(seatId)}
                      isSelected={selectedSeats.has(seatId) || globalSelectedSeats.includes(seatId)}
                      isLoading={loadingLocks.has(seatId)}
                      onClick={() => handleSeatClick(seatId)}
                      compact={compact}
                    />
                  );
                })}
              </div>

              {/* Center Aisle */}
              <div className={compact ? 'w-3' : 'w-6'} />

              {/* Right Block (Seats 4-6) */}
              <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
                {Array.from({ length: 3 }).map((_, idx) => {
                  const seatId = `${row}${idx + 4}`;
                  return (
                    <Seat
                      key={seatId}
                      seatId={seatId}
                      isOccupied={occupiedSeats.includes(seatId)}
                      isSelected={selectedSeats.has(seatId) || globalSelectedSeats.includes(seatId)}
                      isLoading={loadingLocks.has(seatId)}
                      onClick={() => handleSeatClick(seatId)}
                      compact={compact}
                    />
                  );
                })}
              </div>
            </div>

            <div className={`w-4 text-right font-['Outfit'] font-bold text-white/30 uppercase ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{row}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={`${compact ? 'mt-6' : 'mt-12'} mx-auto max-w-[90%] rounded-full border border-white/10 bg-white/5 py-4 px-6 flex justify-between items-center relative z-10`} dir="rtl">
        <LegendItem colorClass="bg-white/10 border border-white/20" label="פנוי" />
        <LegendItem colorClass="bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" label="נבחר" />
        <LegendItem colorClass="bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" label="שותף" />
        <LegendItem colorClass="border-2 border-white/10" label="תפוס" />
      </div>
    </div>
  );
}

function Seat({ seatId, isOccupied, isSelected, isLoading, onClick, compact }: any) {
  let bgClass = "bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer";
  let contentClass = "opacity-100";
  
  if (isOccupied) {
    bgClass = "bg-transparent border-white/5 pointer-events-none opacity-40";
  } else if (isSelected) {
    bgClass = "bg-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] cursor-default";
    contentClass = "opacity-0"; // Hide text when selected to match glowing look
  } else if (isLoading) {
    bgClass = "bg-cyan-400/20 border-cyan-400/50 animate-pulse pointer-events-none";
  }

  const sizeClass = compact ? "w-8 h-9 text-[8px]" : "w-11 h-12 text-[10px]";

  return (
    <motion.div
      whileHover={!isOccupied && !isSelected ? { scale: 1.05 } : {}}
      whileTap={!isOccupied && !isSelected ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`${sizeClass} rounded-[10px] border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${bgClass}`}
    >
      <div className={`flex flex-col items-center justify-center ${contentClass}`}>
        <span className={`font-['Outfit'] font-bold text-white/50 mb-[2px] ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
          {seatId}
        </span>
        <div className="w-4 h-[2px] rounded-full bg-white/20" />
      </div>
    </motion.div>
  );
}

function LegendItem({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colorClass}`} />
      <span className="text-[10px] text-white/50 font-['Outfit'] tracking-wide">{label}</span>
    </div>
  );
}
