'use client';

import React, { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import { Clock, BarChart3, RotateCcw, Sparkles, Plus, Search } from 'lucide-react';
import { ChronoSlide } from '@/components/tickets/ChronoSlide';
import { NeuralFlashbackModal } from '@/components/tickets/NeuralFlashbackModal';
import { CreateMemoryModal } from '@/components/tickets/CreateMemoryModal';
import { useMemoryCapsules } from '@/hooks/useMemoryCapsules';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export function ChronoRefractiveReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  const {
    capsules,
    isLoading,
    searchQuery,
    setSearchQuery,
    isReversed,
    setIsReversed,
    selectedCapsule,
    setSelectedCapsule,
    isCreateOpen,
    setIsCreateOpen,
    handleSaveReflection,
    handleCreateCapsule,
    stats,
  } = useMemoryCapsules();

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[820px] bg-neutral-950/80 backdrop-blur-[50px] saturate-[220%] brightness-105 contrast-110 border border-white/[0.16] rounded-[40px] overflow-hidden shadow-[0_35px_80px_-15px_rgba(0,0,0,0.9),0_0_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex flex-col" dir="rtl">
      
      {/* Volumetric Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-25 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="reelNoiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#reelNoiseFilter)" />
        </svg>
      </div>

      {/* Top Header & Glowing Archival Dashboard */}
      <div className="absolute top-0 w-full z-30 pointer-events-none p-6 md:p-8 bg-gradient-to-b from-black via-black/90 to-transparent">
        <div className="flex justify-between items-start">
          <div className="relative">
            <div className="absolute -inset-6 bg-rose-600/30 blur-[45px] rounded-full pointer-events-none" />
            <h2 className="font-outfit text-3xl md:text-4xl text-white font-black tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center gap-3 relative z-10">
              <Clock className="w-8 h-8 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)] animate-pulse" />
              Archival Reel
            </h2>
            <p className="font-inter text-cyan-200/70 text-xs md:text-sm mt-1 uppercase tracking-[0.25em] font-bold relative z-10">
              Traverse temporal viewing history • שחזור רסיסי זמן
            </p>
          </div>
          
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-black text-xs font-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,159,10,0.4)] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>הוסף זיכרון</span>
            </button>

            <button 
              onClick={() => setIsReversed(!isReversed)}
              className="group relative w-12 h-12 rounded-2xl bg-white/5 border border-white/12 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90 overflow-hidden shadow-lg"
              title="היפוך סדר כרונולוגי"
            >
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,159,10,0.8)_360deg)] animate-[spin_2s_linear_infinite]" />
              <div className="absolute inset-[1px] rounded-2xl bg-neutral-900 z-0" />
              <RotateCcw className={`w-5 h-5 relative z-10 transition-transform duration-700 ease-in-out ${isReversed ? '-rotate-180 text-primary drop-shadow-[0_0_10px_rgba(255,159,10,0.8)]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Floating Temporal Stats & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="relative overflow-hidden bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 rounded-2xl px-5 py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <p className="text-[10px] text-rose-200/60 uppercase tracking-[0.2em] font-black">Top Genre</p>
              <p className="text-sm font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                {stats.topGenre}
              </p>
            </div>

            <div className="relative overflow-hidden bg-cyan-950/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl px-5 py-2.5 flex items-center gap-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <BarChart3 className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <div>
                <p className="text-[10px] text-cyan-200/60 uppercase tracking-[0.2em] font-black">Total Hours</p>
                <p className="text-sm text-white font-black font-mono tracking-wider">{stats.totalHours}<span className="text-cyan-400">h</span></p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-amber-950/40 backdrop-blur-xl border border-amber-500/30 rounded-2xl px-5 py-2.5 flex items-center gap-2 shadow-[0_10px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] text-amber-200/60 uppercase tracking-[0.2em] font-black">Shards</p>
                <p className="text-sm text-white font-black font-mono">{stats.totalCapsules}</p>
              </div>
            </div>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש סרט או ציטוט..."
              className="w-full bg-white/5 border border-white/12 rounded-2xl pr-10 pl-4 py-2 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-rose-500/60"
            />
          </div>
        </div>
      </div>

      {/* Hardware accelerated scroll container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 pt-48 pb-36 overflow-y-auto hide-scrollbar touch-pan-y z-10"
      >
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <LoadingIndicator variant="orbit" size="lg" label="טוען סליל ארכיון..." />
            <p className="text-xs text-white/50 animate-pulse font-mono">מפענח רסיסי זמן קולנועיים...</p>
          </div>
        ) : (
          <motion.div 
            className="flex flex-col items-center space-y-8 px-8 md:px-12 relative max-w-3xl mx-auto"
            style={{ y: yParallax }}
          >
            {/* Filmstrip Spine Lines */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />
            <div className="absolute right-6 md:right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />

            {capsules.map((item, index) => (
              <ChronoSlide 
                key={item.id} 
                item={item} 
                index={index} 
                scrollYProgress={scrollYProgress} 
                onRecall={(c) => setSelectedCapsule(c)}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Overlay fade masks */}
      <div className="absolute top-0 w-full h-44 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent pointer-events-none z-20" />
      
      <NeuralFlashbackModal 
        isOpen={Boolean(selectedCapsule)} 
        onClose={() => setSelectedCapsule(null)} 
        capsule={selectedCapsule}
        onSaveReflection={handleSaveReflection}
      />

      <CreateMemoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateCapsule}
      />
    </div>
  );
}
