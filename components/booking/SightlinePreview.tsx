'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { useSightlineCalculations } from '@/hooks/useSightlineCalculations';
import { Monitor, Eye, Compass, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SightlinePreview() {
  // Subscribe to hoveredSeat and selectedSeats via strict atomic selectors
  const hoveredSeat = useBookingStore((state) => state.hoveredSeat);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const auraColor = useBookingStore((state) => state.auraColor || '#FF1464');

  // Determine active seat (hovered takes priority, fallback to last selected)
  const activeSeatId = hoveredSeat || (selectedSeats.length > 0 ? selectedSeats[selectedSeats.length - 1] : null);
  const { success, data, error } = useSightlineCalculations(activeSeatId);

  // Backdrop glow image or color fallback
  const backdropImage = selectedMovie?.backdrop_path 
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}` 
    : null;

  return (
    <div className="relative w-full max-w-md mx-auto my-6 select-none font-sans">
      <AnimatePresence mode="wait">
        {success && data ? (
          <motion.div
            key={activeSeatId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[32px] p-5 text-white backdrop-blur-3xl saturate-[200%] brightness-110 shadow-[0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.1)] border-[0.5px] border-white/10"
            style={{
              background: 'rgba(10, 10, 15, 0.6)',
            }}
          >
            {/* Ambient Backdrop Glow Layer */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40 blur-3xl">
              {backdropImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={backdropImage} 
                  alt="" 
                  className="w-full h-full object-cover scale-150" 
                />
              ) : (
                <div 
                  className="w-full h-full transition-colors duration-500" 
                  style={{ backgroundColor: auraColor }}
                />
              )}
            </div>

            {/* Inner glow reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Title & Metadata */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xs font-black tracking-widest uppercase text-cyan-400">
                  מנוע נקודת מבט סינמטי
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  מושב {data.row}{data.col} • מדד ראות: {data.visibilityScore}%
                </p>
              </div>
              <div 
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border"
                style={{
                  borderColor: `${auraColor}40`,
                  backgroundColor: `${auraColor}10`,
                  color: auraColor
                }}
              >
                <ShieldCheck size={10} />
                <span>מדויק</span>
              </div>
            </div>

            {/* 3D Simulation Viewport */}
            <div className="relative w-full h-40 rounded-2xl bg-black/70 border border-white/10 overflow-hidden flex items-center justify-center perspective-[800px] preserve-3d">
              {/* Screen curve guide lines */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-cyan-500/5 rounded-[50%] border-t-[1.5px] border-cyan-400/20 blur-[0.5px]" />
              
              {/* Interactive screen surface */}
              <motion.div
                className="relative w-36 h-20 rounded-lg overflow-hidden bg-slate-900 border border-cyan-400/30 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  transform: `perspective(800px) rotateY(${data.perspectiveAngle}deg) rotateX(${data.pitchAngle - 10}deg)`,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              >
                {/* Simulated projection cone */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Micro Cinema Screen content */}
                <Monitor className="text-cyan-400/50 w-8 h-8 mb-1" />
                <span className="text-[7px] text-cyan-400/60 font-black tracking-widest uppercase">SCREEN</span>
                
                {/* Horizontal scanline simulation */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(10,239,255,0.05)_100%)] bg-[size:100%_4px]" />
              </motion.div>

              {/* Viewport indicators */}
              <div className="absolute bottom-2 left-3 text-[8px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Compass size={10} />
                <span>זווית: {Math.round(data.perspectiveAngle)}°</span>
              </div>
              <div className="absolute bottom-2 right-3 text-[8px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Eye size={10} />
                <span>עומק: {data.distance.toFixed(1)}m</span>
              </div>
            </div>

            {/* Bottom details section */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">עיוות אופקי</span>
                <span className="block text-[11px] font-black text-slate-200 mt-0.5">
                  {Math.abs(data.perspectiveAngle) < 5 ? 'מינימלי' : `${Math.abs(Math.round(data.perspectiveAngle))}°`}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">גובה מבט</span>
                <span className="block text-[11px] font-black text-slate-200 mt-0.5">
                  {data.pitchAngle > 18 ? 'גבוה' : data.pitchAngle > 10 ? 'אופטימלי' : 'נמוך'}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">חווית צפייה</span>
                <span className="block text-[11px] font-black text-slate-200 mt-0.5">
                  {data.visibilityScore >= 90 ? 'VIP 🌟' : data.visibilityScore >= 80 ? 'מעולה' : 'סטנדרט'}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-6 rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-3xl text-center text-slate-400 h-40"
          >
            <AlertCircle className="w-6 h-6 text-slate-500 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              רחף מעל מושב לקבלת זווית ראייה תלת-ממדית
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
