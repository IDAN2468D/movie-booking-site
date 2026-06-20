'use client';

import { useBookingStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Info, Users, Monitor } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function SeatMap() {
  const { selectedSeats, toggleSeat, lobbyUsers, setLobbyUsers } = useBookingStore();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  // 3D Tilt Coordinates
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock occupied seats
  const occupiedSeats = ['s-5', 's-12', 's-13', 's-24', 's-31', 's-40', 's-42'];

  // Mock "Popularity" data
  const popularityMap: Record<string, number> = {
    's-18': 0.9, 's-19': 0.95, 's-20': 0.92, 's-21': 0.88
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 'aisle', 4, 5, 6];

  // Simulating live users inside the lobby
  useEffect(() => {
    setLobbyUsers([
      { id: 'user-1', name: 'עידן', x: 140, y: 180, seat: 's-3' },
      { id: 'user-2', name: 'נועה', x: 280, y: 260, seat: 's-16' }
    ]);

    const interval = setInterval(() => {
      setLobbyUsers([
        { id: 'user-1', name: 'עידן', x: 140 + Math.sin(Date.now() / 300) * 15, y: 180 + Math.cos(Date.now() / 400) * 10, seat: 's-3' },
        { id: 'user-2', name: 'נועה', x: 280 + Math.cos(Date.now() / 250) * 12, y: 260 + Math.sin(Date.now() / 350) * 15, seat: 's-16' }
      ]);
    }, 100); // High frequency coordinate updates for 120Hz smooth cursor following

    return () => clearInterval(interval);
  }, [setLobbyUsers]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Constrain tilt to max 6 degrees to maintain readability
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
      {/* Glossy Refraction */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Other Lobby Users Cursors (Dynamic GPU-accelerated moving cursors) */}
      {lobbyUsers.map((user) => (
        <div
          key={user.id}
          className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
          style={{
            transform: `translate3d(${user.x}px, ${user.y}px, 0)`,
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#0AEFFF] border-2 border-black animate-pulse" />
          <span className="absolute left-4 top-0 px-2 py-0.5 rounded bg-black/80 text-[8px] font-black text-cyan-400 whitespace-nowrap border border-cyan-400/20">
            {user.name}
          </span>
        </div>
      ))}

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
        
        {/* Collaborative Lobby Status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Users size={12} className="animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider">חדר פעיל: {lobbyUsers.length + 1} משתמשים</span>
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
      <div className="flex flex-col gap-6 mb-12 relative">
        {rows.map((row, rowIndex) => (
          <div key={row} className="flex items-center gap-5">
            <span className="w-4 text-[10px] font-black text-slate-600 text-center">{row}</span>
            <div className="grid grid-cols-7 gap-x-4">
              {cols.map((col) => {
                if (col === 'aisle') {
                  return <div key="aisle" className="w-6" />;
                }
                
                const colNum = Number(col);
                const seatIndex = rowIndex * 6 + (colNum - 1);
                const seatId = `s-${seatIndex}`;
                const isOccupied = occupiedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                const popularity = popularityMap[seatId] || 0.1;

                // Check if a lobby user is currently selecting this seat
                const isLobbyUserSelecting = lobbyUsers.some(u => u.seat === seatId);

                return (
                  <motion.button
                    key={seatId}
                    data-testid="seat-button"
                    disabled={isOccupied}
                    onMouseEnter={() => setHoveredSeat(seatId)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    onClick={() => toggleSeat(seatId)}
                    whileHover={{ scale: isOccupied ? 1 : 1.2, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 rounded-xl transition-all duration-500 relative group ${
                      isSelected 
                        ? 'bg-primary shadow-[0_0_20px_rgba(255,159,10,0.6)] z-10 shimmer' 
                        : isLobbyUserSelecting
                        ? 'bg-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(10,239,255,0.5)]'
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

                    {/* Glowing highlight for lobby users selecting */}
                    {isLobbyUserSelecting && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                      </span>
                    )}
                    
                    <span className="relative z-10 text-[7px] font-black opacity-0 group-hover:opacity-100 transition-opacity text-white/90">
                      {row}{col}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Spatial-POV Window Float Layer */}
        <AnimatePresence>
          {hoveredSeat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 liquid-glass rounded-2xl z-50 pointer-events-none flex flex-col items-center border border-white/20 shadow-2xl"
            >
              <div className="w-full h-24 rounded-lg overflow-hidden bg-black/60 relative mb-2 flex items-center justify-center border border-white/15">
                {/* Simulated POV perspective of screen */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-cyan-500/10 rounded-md border border-cyan-400/20 flex items-center justify-center">
                  <span className="text-[6px] text-cyan-400/80 font-black tracking-widest">THE SCREEN</span>
                </div>
                {/* Glowing light beam from screen */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-cyan-400/15 to-transparent blur-md" />
                <Monitor className="text-cyan-400/40 w-8 h-8 absolute bottom-2" />
                
                {/* Perspective seating grid lines */}
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

      {/* Legend */}
      <div className="flex justify-between w-full max-w-sm px-4 py-5 bg-white/[0.03] rounded-3xl border-[0.5px] border-white/20 backdrop-blur-[40px] text-xs">
        {[
          { color: 'bg-white/10', label: 'פנוי' },
          { color: 'bg-primary shadow-[0_0_15px_rgba(255,159,10,0.5)]', label: 'נבחר' },
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
