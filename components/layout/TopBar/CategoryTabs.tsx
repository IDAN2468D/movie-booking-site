'use client';

import React from 'react';
import { useBookingStore } from '@/lib/store';

const categories = [
  { id: 'all', name: 'סרטים' },
  { id: 'series', name: 'סדרות' },
  { id: 'drama', name: 'דרמה' },
  { id: 'animation', name: 'אנימציה' },
  { id: 'comedy', name: 'קומדיה' }
];

export default function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useBookingStore();

  return (
    <div className="hidden lg:flex gap-3">
      {categories.map((cat) => (
        <button 
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`px-7 py-2.5 rounded-2xl text-xs font-black transition-all duration-500 whitespace-nowrap uppercase tracking-widest border ${
            activeCategory === cat.id 
              ? 'bg-primary border-primary text-background shadow-[0_10px_30px_rgba(255,159,10,0.3)]' 
              : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
