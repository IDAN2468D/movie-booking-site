'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, Flame, Play, Clock, Heart, Ghost, Rocket, Tv, Clapperboard, MonitorPlay,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceAiCommandShell } from '@/components/ai/VoiceAiCommandShell';

const categories = [
  { id: 'all', name: 'כל הסרטים', icon: Sparkles },
  { id: 'trending', name: 'במגמה', icon: Flame },
  { id: 'series', name: 'סדרות', icon: Tv },
  { id: 'drama', name: 'דרמה', icon: Clapperboard },
  { id: 'animation', name: 'אנימציה', icon: MonitorPlay },
  { id: 'action', name: 'פעולה', icon: Play },
  { id: 'comedy', name: 'קומדיה', icon: Heart },
  { id: 'horror', name: 'אימה', icon: Ghost },
  { id: 'scifi', name: 'מדע בדיוני', icon: Rocket },
  { id: 'recent', name: 'חדשים', icon: Clock },
];

export default function CategoryFilters() {
  const { activeCategory, setActiveCategory } = useBookingStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    // In RTL, scrollLeft can be negative or positive depending on browser engine
    const absScroll = Math.abs(scrollLeft);
    setCanScrollLeft(absScroll < maxScroll - 4);
    setCanScrollRight(absScroll > 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  // Smooth mouse wheel conversion (vertical wheel -> horizontal scroll)
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollContainerRef.current.scrollBy({
        left: -e.deltaY * 1.5,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const scrollByAmount = (amount: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full group/filter">
      {/* Hebrew Voice AI Search Dock */}
      <div className="mb-4">
        <VoiceAiCommandShell />
      </div>

      {/* Navigation Arrows for Mouse Users */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollByAmount(260)}
            aria-label="גלול קטגוריות ימינה"
            title="גלול ימינה"
            className="absolute -right-3 top-1/2 mt-3 -translate-y-1/2 z-30 w-10 h-10 rounded-2xl bg-neutral-950/90 border border-white/20 text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl hover:scale-110 hover:border-cyan-400/60 hover:text-cyan-300 transition-all hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollByAmount(-260)}
            aria-label="גלול קטגוריות שמאלה"
            title="גלול שמאלה"
            className="absolute -left-3 top-1/2 mt-3 -translate-y-1/2 z-30 w-10 h-10 rounded-2xl bg-neutral-950/90 border border-white/20 text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl hover:scale-110 hover:border-cyan-400/60 hover:text-cyan-300 transition-all hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hidden Scrollbar Container with Mouse Navigation & Drag */}
      <div 
        ref={scrollContainerRef}
        role="tablist"
        aria-label="סינון קטגוריות סרטים"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex items-center gap-3 py-4 overflow-x-auto px-4 -mx-4 md:px-0 md:mx-0 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab md:cursor-pointer'
        }`}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`קטגוריית ${category.name}`}
              onClick={() => setActiveCategory(category.id)}
              className="relative flex-shrink-0 outline-none group"
            >
              <motion.div
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-500 border relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-cyan-500/10 border-primary shadow-[0_0_40px_rgba(255,20,100,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25)] backdrop-blur-3xl saturate-[220%] brightness-110'
                    : 'bg-[#05070B]/50 border-white/5 hover:border-white/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]'
                }`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                  isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-10'
                } bg-gradient-to-tr from-primary via-transparent to-cyan-500`} />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                <Icon 
                  size={18} 
                  className={`relative z-10 transition-colors duration-500 ${
                    isActive ? 'text-white drop-shadow-[0_0_12px_rgba(255,20,100,0.9)]' : 'text-primary'
                  }`} 
                />

                <span className={`relative z-10 text-sm font-black tracking-tight whitespace-nowrap transition-colors duration-500 font-display ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}>
                  {category.name}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="categoryReflect"
                    className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent blur-[0.5px]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>

              {isActive && (
                <motion.div 
                  layoutId="activeAura"
                  className="absolute inset-0 bg-gradient-to-r from-primary/25 to-cyan-500/20 blur-3xl rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
