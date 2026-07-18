'use client';

import { useState, useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import { Clock, BarChart3, RotateCcw } from 'lucide-react';
import { ChronoSlide } from '@/components/tickets/ChronoSlide';
import { NeuralFlashbackModal } from '@/components/tickets/NeuralFlashbackModal';
import { ChronoHistory } from '@/lib/validations/liquidGlass';

const MOCK_HISTORY: ChronoHistory[] = [
  { orderId: 'LG4-100', movieId: 'Inception', date: '10/05/2026', timestamp: 1778371200000, decayLevel: 0, glassOpacity: 1 },
  { orderId: 'LG4-099', movieId: 'Interstellar', date: '01/03/2026', timestamp: 1772496000000, decayLevel: 0.2, glassOpacity: 0.8 },
  { orderId: 'LG4-098', movieId: 'Dune', date: '15/12/2025', timestamp: 1765756800000, decayLevel: 0.5, glassOpacity: 0.5 },
  { orderId: 'LG4-097', movieId: 'The Matrix', date: '01/08/2025', timestamp: 1754006400000, decayLevel: 0.8, glassOpacity: 0.2 },
  { orderId: 'LG4-096', movieId: 'Blade Runner', date: '10/02/2025', timestamp: 1739145600000, decayLevel: 0.95, glassOpacity: 0.1 },
];

export function ChronoRefractiveReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  const [isReversed, setIsReversed] = useState(false);
  const [modalData, setModalData] = useState<{ isOpen: boolean; movieId: string | null; date: string | null }>({
    isOpen: false,
    movieId: null,
    date: null
  });

  // Entire reel translates dynamically to enhance 3D parallax without triggering layout reflows
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const historyItems = isReversed ? [...MOCK_HISTORY].reverse() : MOCK_HISTORY;

  const handleRecall = (movieId: string, date: string) => {
    setModalData({ isOpen: true, movieId, date });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto h-[600px] bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-[32px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.4)]">
      
      {/* Volumetric Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Top Header & Stats Dashboard */}
      <div className="absolute top-0 w-full z-20 pointer-events-none p-6 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex justify-between items-start">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-[30px] rounded-full pointer-events-none" />
            <h2 className="font-outfit text-3xl text-white font-black tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center gap-3 relative z-10">
              <Clock className="w-6 h-6 text-primary drop-shadow-[0_0_10px_rgba(255,159,10,0.8)]" />
              Archival Reel
            </h2>
            <p className="font-inter text-cyan-100/60 text-xs mt-1 uppercase tracking-[0.2em] relative z-10">Traverse temporal viewing history</p>
          </div>
          
          <div className="pointer-events-auto">
            <button 
              onClick={() => setIsReversed(!isReversed)}
              className="group relative w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary transition-all active:scale-90 overflow-hidden"
              title="Reverse Flow of Time"
            >
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,159,10,0.8)_360deg)] animate-[spin_2s_linear_infinite]" />
              <div className="absolute inset-[1px] rounded-full bg-neutral-900 z-0" />
              <RotateCcw className={`w-5 h-5 relative z-10 transition-transform duration-700 ease-in-out ${isReversed ? '-rotate-180 text-primary drop-shadow-[0_0_10px_rgba(255,159,10,0.8)]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Temporal Stats */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/[0.15] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-cyan-400/20 blur-xl rounded-full" />
            <BarChart3 className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] relative z-10" />
            <div className="relative z-10">
              <p className="text-[10px] text-cyan-100/40 uppercase tracking-[0.2em] font-black">Total Hours</p>
              <p className="text-sm text-white font-black font-mono tracking-wider drop-shadow-md">142<span className="text-cyan-400">h</span></p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/[0.15] rounded-2xl px-4 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-primary/20 blur-xl rounded-full" />
            <div className="relative z-10">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Top Genre</p>
              <p className="text-sm font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 drop-shadow-[0_0_10px_rgba(255,159,10,0.4)] tracking-wide">
                Sci-Fi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware accelerated scroll container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 pt-32 pb-32 overflow-y-auto hide-scrollbar touch-pan-y z-10"
      >
        <motion.div 
          className="flex flex-col items-center space-y-12 px-8 relative"
          style={{ y: yParallax }}
        >
          {/* Filmstrip Spine Lines */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

          {historyItems.map((item, index) => (
            <ChronoSlide 
              key={item.orderId} 
              item={item} 
              index={index} 
              scrollYProgress={scrollYProgress} 
              onRecall={handleRecall}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Overlay fade masks */}
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none z-10" />
      
      <NeuralFlashbackModal 
        isOpen={modalData.isOpen} 
        onClose={() => setModalData({ ...modalData, isOpen: false })} 
        movieId={modalData.movieId}
        date={modalData.date}
      />
    </div>
  );
}
