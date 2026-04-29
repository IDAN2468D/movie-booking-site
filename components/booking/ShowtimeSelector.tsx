'use client';

import React from 'react';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';

const showtimes = [
  { time: '10:30', type: '2D', price: '₪45', hall: 'אולם 04' },
  { time: '13:15', type: '3D', price: '₪55', hall: 'אולם 04' },
  { time: '16:45', type: 'IMAX', price: '₪75', hall: 'אולם 04' },
  { time: '19:30', type: '4DX', price: '₪85', hall: 'אולם 04' },
  { time: '22:15', type: '2D', price: '₪45', hall: 'אולם 04' },
];

export default function ShowtimeSelector() {
  const { selectedShowtime, setSelectedShowtime } = useBookingStore();

  return (
    <div className="space-y-8 max-w-md mx-auto py-4">
      {/* Header Section */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-white text-lg font-black font-rubik flex items-center gap-2">
            <Calendar size={20} className="text-[#FF1464]" />
            היום, 21 באוקטובר
          </h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
            DATE SELECTION
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[#E5FF00] font-black uppercase tracking-widest">
            {showtimes.length} הקרנות
          </span>
        </div>
      </div>

      {/* Showtimes List */}
      <div className="grid grid-cols-1 gap-4">
        {showtimes.map((show, index) => {
          const isSelected = selectedShowtime === show.time;
          
          return (
            <motion.button
              key={show.time}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedShowtime(show.time)}
              className={`
                group relative flex items-center justify-between p-6 rounded-[32px] 
                transition-all duration-500 overflow-hidden
                ${isSelected 
                  ? 'bg-white/10 border-[#FF1464]/50 shadow-[0_20px_50px_rgba(255,20,100,0.2)] scale-[1.02]' 
                  : 'bg-[#0A0A0A]/40 border-white/5 hover:border-white/20 hover:bg-white/5 shadow-2xl'
                }
                border-[1.5px] backdrop-blur-2xl
              `}
            >
              {/* Selected Glow Background */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#FF1464]/20 via-transparent to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Left Side: Time & Info */}
              <div className="flex items-center gap-6 relative z-10">
                <div className={`
                  flex flex-col items-center justify-center
                  ${isSelected ? 'text-white' : 'text-slate-400'}
                `}>
                  <span className="text-4xl font-display font-black tracking-tighter leading-none mb-1">
                    {show.time}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <Monitor size={10} />
                    <span className="text-[10px] font-black font-rubik tracking-tight uppercase">
                      {show.type} • {show.hall}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Price & Action */}
              <div className="flex items-center gap-6 relative z-10">
                <div className="text-right">
                  <div className={`
                    text-xl font-display font-black tracking-tighter
                    ${isSelected ? 'text-[#E5FF00]' : 'text-white/40 group-hover:text-white/60'}
                  `}>
                    {isSelected ? (
                      <MarkerHighlight delay={0.2} color="#FF1464" strokeWidth={3}>
                        {show.price}
                      </MarkerHighlight>
                    ) : (
                      show.price
                    )}
                  </div>
                </div>

                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${isSelected 
                    ? 'bg-[#FF1464] text-white shadow-[0_0_20px_rgba(255,20,100,0.4)]' 
                    : 'bg-white/5 text-white/20 group-hover:text-white group-hover:bg-white/10'
                  }
                `}>
                  <Clock size={20} className={isSelected ? 'animate-pulse' : ''} />
                </div>
              </div>

              {/* Interaction Ring */}
              {isSelected && (
                <motion.div 
                  layoutId="selection-ring"
                  className="absolute inset-0 border-2 border-[#FF1464] rounded-[32px] pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer Hint */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]"
      >
        Select a showtime to proceed to seat selection
      </motion.p>
    </div>
  );
}
