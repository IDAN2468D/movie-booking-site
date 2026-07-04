'use client';

import React from 'react';
import { Sparkles, Flame, Play, Clock, Heart, Ghost, Rocket, Tv, Clapperboard, MonitorPlay } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { motion } from 'framer-motion';

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

  return (
    <div className="relative w-full">
      {/* Premium Horizontal Scroll Container */}
      <div className="flex items-center gap-3 py-6 overflow-x-auto no-scrollbar px-4 -mx-4 md:px-0 md:mx-0 snap-x">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="relative flex-shrink-0 snap-start outline-none group"
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
                {/* Holographic Tint Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                  isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-10'
                } bg-gradient-to-tr from-primary via-transparent to-cyan-500`} />
                
                {/* Dynamic Shine Effect */}
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

                {/* Bottom Refraction Line */}
                {isActive && (
                  <motion.div 
                    layoutId="categoryReflect"
                    className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent blur-[0.5px]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>

              {/* Active Aura (Liquid Glass 3.0) */}
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

