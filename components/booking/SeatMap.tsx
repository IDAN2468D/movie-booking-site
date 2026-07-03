'use client';

import { useBookingStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Users } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import SVGSeat from './SVGSeat';
import CineSyncSeatOverlay from '../premium/cinesync/CineSyncSeatOverlay';
import { useCineSyncStore } from '@/lib/store/cinesyncStore';
import LobbyCursor from './LobbyCursor';
import SeatLegend from './SeatLegend';

export default function SeatMap() {
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const toggleSeat = useBookingStore((state) => state.toggleSeat);
  const auraColor = useBookingStore((state) => state.auraColor);
  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const { activeRoomId, participants } = useCineSyncStore();

  const [showHeatmap, setShowHeatmap] = useState(false);
  const hoveredSeat = useBookingStore((state) => state.hoveredSeat);
  const setHoveredSeat = useBookingStore((state) => state.setHoveredSeat);
  const [realOccupiedSeats, setRealOccupiedSeats] = useState<string[]>([]);
  
  const [rotateX, setRotateX] = useState(30);
  const [rotateY, setRotateY] = useState(-5);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rippleOrigin, setRippleOrigin] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const mockOccupiedSeats = ['s-5', 's-12', 's-13', 's-24', 's-31', 's-40', 's-42'];
  const mockLobbyUserSeats = ['s-3', 's-16'];

  const popularityMap: Record<string, number> = { 's-18': 0.9, 's-19': 0.95, 's-20': 0.92, 's-21': 0.88 };
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 'aisle', 4, 5, 6];

  useEffect(() => {
    if (!selectedMovie) return;
    async function fetchOccupied() {
      try {
        const queryParams = new URLSearchParams({
          movieId: String(selectedMovie!.id),
          showtime: selectedShowtime || '19:30',
          date: selectedDate || new Date().toLocaleDateString('he-IL'),
        });
        const res = await fetch(`/api/bookings?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.occupiedSeats) setRealOccupiedSeats(data.occupiedSeats);
        }
      } catch (err) {
        console.error('Failed to fetch occupied seats:', err);
      }
    }
    fetchOccupied();
  }, [selectedMovie, selectedShowtime, selectedDate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setRotateX(30 - (e.clientY - rect.top - rect.height / 2) / (rect.height / 15));
    setRotateY(-5 + (e.clientX - rect.left - rect.width / 2) / (rect.width / 15));
  };

  const handleSeatClick = (seatId: string) => {
    setRippleOrigin(seatId);
    toggleSeat(seatId);
    setTimeout(() => setRippleOrigin(null), 800);
  };

  return (
    <motion.div 
      ref={mapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(30); setRotateY(-5); }}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="flex flex-col items-center py-10 px-6 max-w-md mx-auto bg-black/40 backdrop-blur-[40px] rounded-[44px] border-[0.5px] border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden w-full transition-all duration-500"
    >
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60" style={{ background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.08) 0%, transparent 50%)` }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="w-full flex justify-between items-center mb-6 px-2 z-10">
        <button onClick={() => setShowHeatmap(!showHeatmap)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all duration-500 ${showHeatmap ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          <Flame size={14} className={showHeatmap ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">מפת חום</span>
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-400">
          <span className="text-[9px] font-black uppercase tracking-wider">{activeRoomId ? `חדר פעיל: ${participants.length}` : 'הזמנה אישית'}</span>
        </div>
      </div>

      <div className="w-full relative mb-8 z-10" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateZ(-3deg) skewX(2deg)', perspective: 1000 }}>
        <CineSyncSeatOverlay />
        <svg viewBox="0 0 370 420" className="w-full h-auto overflow-visible select-none" style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.7))' }}>
          <defs>
            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(10, 239, 255, 0)" /><stop offset="50%" stopColor="#0AEFFF" stopOpacity="0.8" /><stop offset="100%" stopColor="rgba(10, 239, 255, 0)" /></linearGradient>
            <filter id="glow-selected" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="glow-partner" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g className="opacity-80">
            <path d="M 40 35 Q 185 15 330 35" fill="none" stroke="url(#screenGradient)" strokeWidth="5" strokeLinecap="round" />
            <text x="185" y="55" textAnchor="middle" fill="rgba(10, 239, 255, 0.4)" fontSize="8px" fontWeight="black" letterSpacing="4">מסך</text>
          </g>
          {rows.map((row, rowIndex) => {
            const y = 80 + rowIndex * 42;
            return (
              <g key={row}>
                <text x="20" y={y + 20} fill="rgba(255, 255, 255, 0.2)" fontSize="10px" fontWeight="bold" textAnchor="middle">{row}</text>
                {cols.map((col) => {
                  if (col === 'aisle') return null;
                  const colNum = Number(col);
                  const x = colNum <= 3 ? 15 + colNum * 38 : 35 + colNum * 38;
                  const seatIndex = rowIndex * 6 + (colNum - 1);
                  const seatId = `s-${seatIndex}`;
                  const isOccupied = mockOccupiedSeats.includes(seatId) || realOccupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  
                  let rippleDelay = 0;
                  let shouldRipple = false;
                  if (rippleOrigin) {
                    const origIndex = parseInt(rippleOrigin.split('-')[1]);
                    const dist = Math.sqrt(Math.pow(rowIndex - Math.floor(origIndex / 6), 2) + Math.pow(colNum - ((origIndex % 6) + 1), 2));
                    if (dist <= 3) { shouldRipple = true; rippleDelay = dist * 0.08; }
                  }

                  return (
                    <motion.g key={seatId} animate={shouldRipple ? { scale: [1, 1.15, 0.95, 1] } : { scale: 1 }} transition={{ duration: 0.6, delay: rippleDelay }}>
                      <SVGSeat seatId={seatId} row={row} col={colNum} x={x} y={y} isOccupied={isOccupied} isSelected={isSelected} isLobbyUserSelecting={mockLobbyUserSeats.includes(seatId)} showHeatmap={showHeatmap} popularity={popularityMap[seatId] || 0.1} auraColor={auraColor} onHover={setHoveredSeat} onClick={() => handleSeatClick(seatId)} />
                    </motion.g>
                  );
                })}
                <text x="350" y={y + 20} fill="rgba(255, 255, 255, 0.2)" fontSize="10px" fontWeight="bold" textAnchor="middle">{row}</text>
              </g>
            );
          })}
          <LobbyCursor name="עידן" initialX={120} initialY={170} />
          <LobbyCursor name="נועה" initialX={260} initialY={250} />
        </svg>

        <AnimatePresence>
          {hoveredSeat && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 liquid-glass rounded-2xl z-50 pointer-events-none flex flex-col items-center border border-white/20 shadow-2xl">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">שורה {hoveredSeat.split('-')[1]} • מושב {Number(hoveredSeat.split('-')[1]) || 1}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SeatLegend />
    </motion.div>
  );
}
