'use client';

import { useBookingStore } from '@/lib/store';
import { useRouletteStore } from '@/lib/store/rouletteStore';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Flame } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import SVGSeat from './SVGSeat';
import CineSyncSeatOverlay from '../premium/cinesync/CineSyncSeatOverlay';
import { useCineSyncStore } from '@/lib/store/cinesyncStore';
import SeatLegend from './SeatLegend';

export default function SeatMap() {
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const toggleSeat = useBookingStore((state) => state.toggleSeat);
  const auraColor = useBookingStore((state) => state.auraColor);
  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const { activeRoomId, participants } = useCineSyncStore();

  // Subscribe to roulette store events with atomic selectors
  const rippleTriggerId = useRouletteStore((state) => state.rippleTriggerId);
  const winningSeatCoords = useRouletteStore((state) => state.winningSeatCoords);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const hoveredSeat = useBookingStore((state) => state.hoveredSeat);
  const setHoveredSeat = useBookingStore((state) => state.setHoveredSeat);
  const [realOccupiedSeats, setRealOccupiedSeats] = useState<string[]>([]);
  const [rippleOrigin, setRippleOrigin] = useState<string | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);

  // GPU composited tilt values (replaces useState to bypass React render cycle entirely)
  const tiltX = useMotionValue(0.5);
  const tiltY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(tiltY, [0, 1], [40, 20]), { stiffness: 100, damping: 22 });
  const rotateY = useSpring(useTransform(tiltX, [0, 1], [-15, 5]), { stiffness: 100, damping: 22 });

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Zero-render CSS variable injection for the cursor light refraction highlight
    mapRef.current.style.setProperty('--mouse-x', `${x}px`);
    mapRef.current.style.setProperty('--mouse-y', `${y}px`);

    // GPU mapped values triggering composited motion without component recalculation
    tiltX.set(x / rect.width);
    tiltY.set(y / rect.height);
  };

  const handleMouseLeave = () => {
    tiltX.set(0.5);
    tiltY.set(0.5);
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
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="flex flex-col items-center py-10 px-6 max-w-md mx-auto bg-black/40 backdrop-blur-[40px] rounded-[44px] border-[0.5px] border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden w-full transition-all duration-500"
    >
      {/* Light Refraction Gradient using CSS variables to prevent layout/repaint triggers */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60" 
        style={{ background: 'radial-gradient(circle at var(--mouse-x, 150px) var(--mouse-y, 150px), rgba(255,255,255,0.08) 0%, transparent 50%)' }} 
      />
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

                  const isRouletteRipple = !rippleOrigin && winningSeatCoords && rippleTriggerId > 0;
                  const rouletteDelay = isRouletteRipple
                    ? Math.sqrt(Math.pow(rowIndex - winningSeatCoords.row, 2) + Math.pow(colNum - winningSeatCoords.col, 2)) * 0.05
                    : 0;

                  const animateObj = isRouletteRipple
                    ? {
                        scale: [1, 1.35, 0.9, 1.05, 1],
                        filter: [
                          'hue-rotate(0deg) brightness(1)',
                          'hue-rotate(180deg) brightness(2) drop-shadow(0 0 12px #FF1464)',
                          'hue-rotate(360deg) brightness(1.2) drop-shadow(0 0 4px #0AEFFF)',
                          'hue-rotate(360deg) brightness(1)'
                        ],
                      }
                    : (shouldRipple ? { scale: [1, 1.15, 0.95, 1] } : { scale: 1 });

                  const delayVal = isRouletteRipple ? rouletteDelay : rippleDelay;
                  const durationVal = isRouletteRipple ? 1.0 : 0.6;

                  return (
                    <motion.g 
                      key={`${seatId}-${rippleTriggerId}`} 
                      animate={animateObj} 
                      transition={{ duration: durationVal, delay: delayVal, ease: 'easeInOut' }}
                      transformTemplate={(_props, transform) => `${transform} translateZ(0)`}
                      className="transform-gpu"
                    >
                      <SVGSeat seatId={seatId} row={row} col={colNum} x={x} y={y} isOccupied={isOccupied} isSelected={isSelected} isLobbyUserSelecting={mockLobbyUserSeats.includes(seatId)} showHeatmap={showHeatmap} popularity={popularityMap[seatId] || 0.1} auraColor={auraColor} onHover={setHoveredSeat} onClick={() => handleSeatClick(seatId)} />
                    </motion.g>
                  );
                })}
                <text x="350" y={y + 20} fill="rgba(255, 255, 255, 0.2)" fontSize="10px" fontWeight="bold" textAnchor="middle">{row}</text>
              </g>
            );
          })}
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
