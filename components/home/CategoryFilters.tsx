'use client';

import React from 'react';
import { Sparkles, Flame, Play, Clock, Heart, Ghost, Rocket, Tv, Clapperboard, MonitorPlay } from 'lucide-react';

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

import { useBookingStore } from '@/lib/store';

export default function CategoryFilters() {
  const { activeCategory, setActiveCategory } = useBookingStore();

  return (
    <div className="flex items-center gap-4 py-6 overflow-x-auto no-scrollbar">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-500 border-[0.5px] ${
            activeCategory === category.id
              ? 'bg-primary border-primary text-background font-bold scale-105 shadow-[0_10px_30px_rgba(255,159,10,0.3)]'
              : 'bg-white/5 border-white/10 backdrop-blur-[40px] text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <category.icon size={18} />
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
