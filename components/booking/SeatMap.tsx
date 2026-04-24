'use client';

import { useBookingStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Info } from 'lucide-react';
import { useState } from 'react';

export default function SeatMap() {
  const { selectedSeats, toggleSeat } = useBookingStore();
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Mock occupied seats
  const occupiedSeats = ['s-5', 's-12', 's-13', 's-24', 's-31', 's-40', 's-42'];

  // Mock "Popularity" data
  const popularityMap: Record<string, number> = {
    's-18': 0.9, 's-19': 0.95, 's-20': 0.92, 's-21': 0.88
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 'aisle', 4, 5, 6];

  return (
    <div className="flex flex-col items-center py-10 px-6 bg-[#0A0A0F]/60 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden w-full">
      {/* Glossy Refraction */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="w-full flex justify-between items-center mb-10 px-2">
        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all duration-500 ${
            showHeatmap 
            ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          <Flame size={14} className={showHeatmap ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">מפת חום</span>
        </button>
        <div className="flex items-center gap-2 text-slate-500">
          <Info size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">בחר מושבים</span>
        </div>
      </div>

      {/* The Screen */}
      <div className="w-full text-center mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-3/4 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_8px_30px_rgba(34,211,238,0.4)]"
        />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-20 bg-cyan-500/5 blur-[40px] pointer-events-none" />
        <span className="block mt-6 text-[9px] text-cyan-400/50 font-black tracking-[0.6em] uppercase">The Screen</span>
      </div>

      {/* Seat Grid - Expanded Layout */}
      <div className="flex flex-col gap-6 mb-12">
        {rows.map((row, rowIndex) => (
          <div key={row} className="flex items-center gap-5">
            <span className="w-4 text-[10px] font-black text-slate-600 text-center">{row}</span>
            <div className="grid grid-cols-7 gap-x-4">
              {cols.map((col) => {
                if (col === 'aisle') {
                  return <div key="aisle" className="w-6" />;
                }
                
                const seatId = `s-${rowIndex * 6 + (Number(col) - 1)}`;
                const isOccupied = occupiedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                const popularity = popularityMap[seatId] || 0.1;

                return (
                  <motion.button
                    key={seatId}
                    disabled={isOccupied}
                    onClick={() => toggleSeat(seatId)}
                    whileHover={{ scale: isOccupied ? 1 : 1.2, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 rounded-xl transition-all duration-500 relative group ${
                      isSelected 
                        ? 'bg-primary shadow-[0_0_20px_rgba(255,159,10,0.6)] z-10 shimmer' 
                        : isOccupied
                        ? 'bg-white/5 cursor-not-allowed border border-white/5 opacity-20'
                        : 'bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Heatmap */}
                    <AnimatePresence>
                      {showHeatmap && !isOccupied && !isSelected && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ opacity: popularity * 0.8 }}
                          className="absolute inset-0 bg-orange-500 rounded-xl blur-[3px]"
                        />
                      )}
                    </AnimatePresence>
                    
                    <span className="relative z-10 text-[7px] font-black opacity-0 group-hover:opacity-100 transition-opacity text-white/90">
                      {row}{col}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-between w-full max-w-sm px-8 py-5 bg-white/[0.03] rounded-3xl border border-white/5 backdrop-blur-md">
        {[
          { color: 'bg-white/10', label: 'פנוי' },
          { color: 'bg-primary shadow-[0_0_15px_rgba(255,159,10,0.5)]', label: 'נבחר' },
          { color: 'bg-white/5 opacity-20', label: 'תפוס' }
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-md ${item.color}`} />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
