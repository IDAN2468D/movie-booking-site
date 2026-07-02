'use client';

import { useBookingStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Users, Monitor } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import SVGSeat from './SVGSeat';
import CineSyncSeatOverlay from '../premium/cinesync/CineSyncSeatOverlay';
import { useCineSyncStore } from '@/lib/store/cinesyncStore';

interface LobbyCursorProps {
  name: string;
  initialX: number;
  initialY: number;
}

function LobbyCursor({ name, initialX, initialY }: LobbyCursorProps) {
  return (
    <motion.g
      initial={{ x: initialX, y: initialY }}
      animate={{
        x: [initialX - 8, initialX + 12, initialX - 4, initialX + 8, initialX - 8],
        y: [initialY + 4, initialY - 8, initialY + 10, initialY - 4, initialY + 4]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className="pointer-events-none"
    >
      <circle r="5" fill="#22D3EE" stroke="#000" strokeWidth="1.5" className="animate-pulse" filter="url(#glow-partner)" />
      <g transform="translate(10, -7)">
        <rect width="32" height="14" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="0.5" />
        <text x="16" y="10" textAnchor="middle" fill="#22D3EE" fontSize="7px" fontWeight="black">{name}</text>
      </g>
    </motion.g>
  );
}

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
  
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);

  const mockOccupiedSeats = ['s-5', 's-12', 's-13', 's-24', 's-31', 's-40', 's-42'];
  const mockLobbyUserSeats = ['s-3', 's-16'];

  const popularityMap: Record<string, number> = {
    's-18': 0.9, 's-19': 0.95, 's-20': 0.92, 's-21': 0.88
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 'aisle', 4, 5, 6];

  useEffect(() => {
    if (!selectedMovie) return;
    const movie = selectedMovie;

    let active = true;
    async function fetchOccupied() {
      try {
        const queryParams = new URLSearchParams({
          movieId: String(movie.id),
          showtime: selectedShowtime || '19:30',
          date: selectedDate || new Date().toLocaleDateString('he-IL'),
        });
        const res = await fetch(`/api/bookings?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.occupiedSeats && active) {
            setRealOccupiedSeats(data.occupiedSeats);
          }
        }
      } catch (err) {
        console.error('Failed to fetch occupied seats:', err);
      }
    }

    fetchOccupied();
    return () => {
      active = false;
    };
  }, [selectedMovie, selectedShowtime, selectedDate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / (rect.height / 12));
    setRotateY(x / (rect.width / 12));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div 
      ref={mapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 150, damping: 25 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="flex flex-col items-center py-10 px-6 max-w-md mx-auto bg-black/40 backdrop-blur-[40px] rounded-[44px] border-[0.5px] border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden w-full transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="w-full flex justify-between items-center mb-6 px-2">
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
        
        {activeRoomId ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Users size={12} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-wider">חדר פעיל: {participants.length} משתמשים</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-400">
            <Users size={12} />
            <span className="text-[9px] font-black uppercase tracking-wider">הזמנה אישית</span>
          </div>
        )}
      </div>

      <div className="w-full relative mb-8">
        <CineSyncSeatOverlay />
        <svg viewBox="0 0 370 420" className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(10, 239, 255, 0)" />
              <stop offset="50%" stopColor="#0AEFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgba(10, 239, 255, 0)" />
            </linearGradient>
            
            <filter id="glow-selected" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComponentTransfer in="blur" result="boost">
                <feFuncA type="linear" slope="1.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="boost" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-partner" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-heatmap" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
            </filter>
          </defs>

          <g className="opacity-80">
            <path d="M 40 35 Q 185 15 330 35" fill="none" stroke="url(#screenGradient)" strokeWidth="5" strokeLinecap="round" />
            <path d="M 40 35 Q 185 15 330 35" fill="none" stroke="#0AEFFF" strokeWidth="1.5" strokeOpacity="0.4" filter="url(#glow-partner)" />
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
                  const popularity = popularityMap[seatId] || 0.1;
                  const isLobbyUserSelecting = mockLobbyUserSeats.includes(seatId);

                  return (
                    <SVGSeat
                      key={seatId}
                      seatId={seatId}
                      row={row}
                      col={colNum}
                      x={x}
                      y={y}
                      isOccupied={isOccupied}
                      isSelected={isSelected}
                      isLobbyUserSelecting={isLobbyUserSelecting}
                      showHeatmap={showHeatmap}
                      popularity={popularity}
                      auraColor={auraColor}
                      onHover={setHoveredSeat}
                      onClick={() => toggleSeat(seatId)}
                    />
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 liquid-glass rounded-2xl z-50 pointer-events-none flex flex-col items-center border border-white/20 shadow-2xl"
            >
              <div className="w-full h-24 rounded-lg overflow-hidden bg-black/60 relative mb-2 flex items-center justify-center border border-white/15">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-cyan-500/10 rounded-md border border-cyan-400/20 flex items-center justify-center">
                  <span className="text-[6px] text-cyan-400/80 font-black tracking-widest">THE SCREEN</span>
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-cyan-400/15 to-transparent blur-md" />
                <Monitor className="text-cyan-400/40 w-8 h-8 absolute bottom-2" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(10,239,255,0.05)_100%)]" />
              </div>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">
                שורה {hoveredSeat.split('-')[1]} • מושב {Number(hoveredSeat.split('-')[1]) || 1}
              </span>
              <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest mt-1">מבט מהמושב: מעולה (100% ראות)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between w-full max-w-sm px-4 py-5 bg-white/[0.03] rounded-3xl border-[0.5px] border-white/20 backdrop-blur-[40px] text-xs">
        {[
          { color: 'bg-white/10', label: 'פנוי' },
          { color: 'bg-primary shadow-[0_0_15px_rgba(255,20,100,0.5)]', label: 'נבחר' },
          { color: 'bg-cyan-400 shadow-[0_0_15px_rgba(10,239,255,0.5)]', label: 'שותף' },
          { color: 'bg-white/5 opacity-20', label: 'תפוס' }
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-md ${item.color}`} />
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
