"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchParty, useWatchPartyStore } from '../../hooks/useWatchParty';
import { HolographicCursor } from '../../components/booking/HolographicCursor';

export interface Seat {
  id: string;
  row: string; // 'A' through 'L'
  col: number; // 1 through 15
  status: 'available' | 'occupied' | 'selected';
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const COLS = Array.from({ length: 15 }, (_, i) => i + 1);

const isSweetSpot = (row: string, col: number) => {
  return ['F', 'G', 'H'].includes(row) && col >= 6 && col <= 12;
};

const generateSeatMap = (): Seat[] => {
  const map: Seat[] = [];
  for (const row of ROWS) {
    for (const col of COLS) {
      map.push({
        id: `${row}${col}`,
        row,
        col,
        status: 'available',
      });
    }
  }
  return map;
};

// Acoustic Web Audio Context
let audioCtx: AudioContext | null = null;

const playSpatialClick = (col: number) => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const panner = audioCtx.createPanner();
  panner.panningModel = 'equalpower';
  const panValue = ((col - 1) / 14) * 2 - 1;
  panner.positionX.value = panValue;
  panner.positionY.value = 0;
  panner.positionZ.value = 1 - Math.abs(panValue);

  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.connect(panner);
  panner.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

const playSubBassDrop = () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.4);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
};

const playPeerClick = (col: number) => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const panner = audioCtx.createPanner();
  panner.panningModel = 'equalpower';
  const panValue = ((col - 1) / 14) * 2 - 1;
  panner.positionX.value = panValue;
  panner.positionY.value = 0;
  panner.positionZ.value = 1 - Math.abs(panValue);

  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.connect(panner);
  panner.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

export default function SeatMap({ showtimeId = 'mock-showtime-1', currentUserId = 'user-' + Math.random().toString(36).substring(7) }) {
  const [seats, setSeats] = useState<Seat[]>(generateSeatMap());
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { emitCursorMove, emitPeerClick } = useWatchParty();
  const cursors = useWatchPartyStore((state) => state.cursors);
  const userColor = React.useMemo(() => `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`, []);
  const lastMoveTime = useRef<number>(0);

  useEffect(() => {
    const handlePeerClick = (e: any) => {
      const { col } = e.detail;
      playPeerClick(col);
    };
    window.addEventListener('watchparty_peer_click', handlePeerClick);
    return () => window.removeEventListener('watchparty_peer_click', handlePeerClick);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`/api/tickets/sync?showtimeId=${showtimeId}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'initial') {
          const locks = payload.data || [];
          setSeats((prev) => prev.map((s) => {
            const lock = locks.find((l: any) => l.seatId === s.id);
            if (!lock) return { ...s, status: 'available' };
            if (lock.userId === currentUserId) return { ...s, status: 'selected' };
            return { ...s, status: 'occupied' };
          }));
        } else if (payload.type === 'change') {
          const change = payload.data;
          if (change.operationType === 'insert' || change.operationType === 'update') {
            const doc = change.fullDocument;
            if (!doc) return;
            setSeats((prev) => prev.map((s) => {
              if (s.id === doc.seatId) {
                return { ...s, status: doc.userId === currentUserId ? 'selected' : 'occupied' };
              }
              return s;
            }));
          } else if (change.operationType === 'delete') {
            // For simplicity, we just trigger a refetch or we could rely on a robust SSE payload
            // Without full document on delete, we can't reliably know the seatId unless we store map of _id to seatId
            // We will let optimistic UI handle current user's deletes.
          }
        }
      } catch (e) {
        console.error("SSE parse error", e);
      }
    };

    return () => eventSource.close();
  }, [showtimeId, currentUserId]);

  const toggleSeat = async (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    playSpatialClick(seat.col);
    emitPeerClick(seat.col, seat.row);

    const isSelecting = seat.status === 'available';
    const action = isSelecting ? 'hold' : 'release';

    // Optimistic UI lock
    setSeats((prev) => prev.map((s) => s.id === seat.id ? { ...s, status: isSelecting ? 'selected' : 'available' } : s));

    try {
      const res = await fetch('/api/tickets/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId: seat.id, showtimeId, userId: currentUserId, action })
      });
      const data = await res.json();
      
      if (!data.success) {
        // Rollback on collision
        setSeats((prev) => prev.map((s) => s.id === seat.id ? { ...s, status: isSelecting ? 'available' : 'selected' } : s));
      } else if (isSelecting) {
        playSubBassDrop(); // Sub-bass frequency drop on successful server lock
      }
    } catch (err) {
      // Rollback on network error
      setSeats((prev) => prev.map((s) => s.id === seat.id ? { ...s, status: isSelecting ? 'available' : 'selected' } : s));
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const now = Date.now();
    // Throttle to roughly 15fps (~66ms)
    if (now - lastMoveTime.current < 66) return;
    lastMoveTime.current = now;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    emitCursorMove({ x, y, userId: currentUserId, color: userColor });
  };

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full flex flex-col items-center p-8 overflow-hidden select-none touch-none"
    >
      <AnimatePresence>
        {Object.values(cursors).map((cursor) => (
          <HolographicCursor 
            key={cursor.socketId}
            x={cursor.x}
            y={cursor.y}
            color={cursor.color}
            userId={cursor.userId}
          />
        ))}
      </AnimatePresence>
      <div className="w-3/4 max-w-4xl h-12 mb-16 rounded-[100%] border-t-4 border-purple-500/50 shadow-[0_-20px_40px_rgba(168,85,247,0.2)] opacity-80" />
      
      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center gap-4">
            <div className="w-6 text-center font-inter text-gray-400 text-sm font-semibold">{row}</div>
            <div className="flex gap-2">
              {COLS.map((col) => {
                const seatId = `${row}${col}`;
                const seat = seats.find((s) => s.id === seatId);
                if (!seat) return null;

                const sweetSpot = isSweetSpot(row, col);
                const isHovered = hoveredSeat === seatId;
                
                let seatStyle = "border-white/10 bg-white/5 backdrop-blur-md";
                if (seat.status === 'occupied') {
                  // Low-opacity strike-through styling
                  seatStyle = "opacity-35 bg-white/5 border-white/5 cursor-not-allowed bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"0\" y1=\"100%\" x2=\"100%\" y2=\"0\" stroke=\"rgba(255,255,255,0.2)\" stroke-width=\"2\"/></svg>')] bg-cover";
                } else if (seat.status === 'selected') {
                  // Ultraviolet glow pulse shadows
                  seatStyle = "border-purple-500 bg-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.6)]";
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
                      onClick={() => toggleSeat(seat)}
                      className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b flex items-center justify-center border transition-colors duration-300 ${seatStyle}`}
                      style={{ willChange: 'transform' }}
                    >
                      <span className="text-[10px] text-white/50 font-inter">{col}</span>
                    </motion.div>

                    <AnimatePresence>
                      {sweetSpot && isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 z-50 pointer-events-none"
                          style={{ willChange: 'transform, opacity' }}
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
            <div className="w-6 text-center font-inter text-gray-400 text-sm font-semibold">{row}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
