'use client';

import React from 'react';
import { Sparkles, Flame, Play, Clock, Heart, Ghost, Rocket, Tv, Clapperboard, MonitorPlay } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="flex items-center gap-4 py-8 overflow-x-auto no-scrollbar px-4 -mx-4 md:px-0 md:mx-0 snap-x">
        {categories.map((category, i) => {
          const isActive = activeCategory === category.id;
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="relative flex-shrink-0 snap-start outline-none group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 px-8 py-4 rounded-full transition-all duration-500 border-[1px] relative overflow-hidden ${
                  isActive
                    ? 'bg-primary border-primary shadow-[0_15px_35px_rgba(255,20,100,0.3)]'
                    : 'bg-white/5 border-white/10 backdrop-blur-3xl hover:bg-white/10 hover:border-white/20'
                }`}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Holographic Tint Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                  isActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-10'
                } bg-gradient-to-tr from-primary via-transparent to-yellow/50`} />
                
                {/* Dynamic Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                <Icon 
                  size={20} 
                  className={`relative z-10 transition-colors duration-500 ${
                    isActive ? 'text-off-white' : 'text-primary'
                  }`} 
                />
                
                <span className={`relative z-10 text-xs font-display tracking-widest whitespace-nowrap transition-colors duration-500 uppercase ${
                  isActive ? 'text-off-white' : 'text-off-white/40 group-hover:text-off-white'
                }`}>
                  {category.name}
                </span>

                {/* Bottom Reflection Line */}
                {isActive && (
                  <motion.div 
                    layoutId="categoryReflect"
                    className="absolute bottom-0 inset-x-0 h-[3px] bg-white/40 blur-[1px]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>

              {/* Active Aura (YUV-DESIGN Pink) */}
              {isActive && (
                <motion.div 
                  layoutId="activeAura"
                  className="absolute inset-0 bg-primary/30 blur-3xl rounded-full -z-10"
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
