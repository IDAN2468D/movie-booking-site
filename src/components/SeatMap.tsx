"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Basic seat type definition
export interface Seat {
  id: string;
  row: string; // 'A' through 'L'
  col: number; // 1 through 15
  status: 'available' | 'occupied' | 'selected';
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const COLS = Array.from({ length: 15 }, (_, i) => i + 1);

// Architectural blueprint rule: Optimal acoustics at Rows F-H, Columns 6-12
const isSweetSpot = (row: string, col: number) => {
  return ['F', 'G', 'H'].includes(row) && col >= 6 && col <= 12;
};

// Generate an initial mock seat map
const generateSeatMap = (): Seat[] => {
  const map: Seat[] = [];
  for (const row of ROWS) {
    for (const col of COLS) {
      map.push({
        id: `${row}${col}`,
        row,
        col,
        status: Math.random() > 0.85 ? 'occupied' : 'available', // Mock occupancy
      });
    }
  }
  return map;
};

export default function SeatMap() {
  const [seats, setSeats] = useState<Seat[]>(generateSeatMap());
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const toggleSeat = (id: string) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.id === id && s.status !== 'occupied') {
          return { ...s, status: s.status === 'selected' ? 'available' : 'selected' };
        }
        return s;
      })
    );
  };

  return (
    <div className="w-full flex flex-col items-center p-8 overflow-x-auto select-none">
      {/* Screen Curve representation */}
      <div className="w-3/4 max-w-4xl h-12 mb-16 rounded-[100%] border-t-4 border-purple-500/50 shadow-[0_-20px_40px_rgba(168,85,247,0.2)] opacity-80" />
      
      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center gap-4">
            {/* Row Label */}
            <div className="w-6 text-center font-inter text-gray-400 text-sm font-semibold">
              {row}
            </div>

            <div className="flex gap-2">
              {COLS.map((col) => {
                const seatId = `${row}${col}`;
                const seat = seats.find((s) => s.id === seatId);
                if (!seat) return null;

                const sweetSpot = isSweetSpot(row, col);
                const isHovered = hoveredSeat === seatId;
                
                // Base Glassmorphic Seat Styles aligned to Liquid Glass rules
                let seatStyle = "border-white/10 bg-white/5 backdrop-blur-md";
                if (seat.status === 'occupied') {
                  // Muted token styling as per strict UX guidelines
                  seatStyle = "opacity-35 bg-white/5 border-white/5 cursor-not-allowed";
                } else if (seat.status === 'selected') {
                  seatStyle = "border-purple-500 bg-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.5)]";
                } else {
                  seatStyle += " hover:bg-white/15 cursor-pointer";
                }

                return (
                  <div
                    key={seatId}
                    className="relative"
                    onMouseEnter={() => setHoveredSeat(seatId)}
                    onMouseLeave={() => setHoveredSeat(null)}
                  >
                    {/* Subtle pulsing radial gradient safely layered behind the seat for sweet-spots */}
                    {sweetSpot && (
                      <div 
                        className="absolute -inset-2 rounded-full opacity-70 animate-pulse pointer-events-none z-0"
                        style={{
                          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
                          willChange: 'opacity, background',
                        }}
                      />
                    )}
                    
                    <motion.div
                      whileHover={seat.status !== 'occupied' ? { scale: 1.1 } : {}}
                      whileTap={seat.status !== 'occupied' ? { scale: 0.9 } : {}}
                      onClick={() => toggleSeat(seatId)}
                      className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b flex items-center justify-center border transition-colors duration-300 ${seatStyle}`}
                    >
                      <span className="text-[10px] text-white/50 font-inter">{col}</span>
                    </motion.div>

                    {/* Highly polished Liquid Glass 3.0 Sweet-Spot Hover Preview Overlay */}
                    <AnimatePresence>
                      {sweetSpot && isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 z-50 pointer-events-none"
                        >
                          <div className="flex flex-col items-center justify-center p-2 rounded-xl backdrop-blur-md bg-black/40 border border-white/10 shadow-lg text-xs text-white font-inter text-center">
                            <span className="font-semibold text-purple-300 drop-shadow-md">✨ Prime Audio Sweet-Spot</span>
                            <span className="text-gray-300 mt-1">Acoustic Fidelity: 98%</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Row Label Right */}
            <div className="w-6 text-center font-inter text-gray-400 text-sm font-semibold">
              {row}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
