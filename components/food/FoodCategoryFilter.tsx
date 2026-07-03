'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FoodCategoryFilterProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

const CATEGORIES = ['כל הפריטים', 'חטיפים', 'משקאות', 'קינוחים', 'קומבואים'];

export const FoodCategoryFilter: React.FC<FoodCategoryFilterProps> = ({ activeCategory, onSelect }) => {
  return (
    <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2 relative">
      {CATEGORIES.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="relative px-8 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-colors cursor-pointer z-10"
            style={{ contentVisibility: 'auto' }}
          >
            {isActive && (
              <motion.div
                layoutId="food-cat-slider"
                className="absolute inset-0 bg-primary rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                style={{ willChange: 'transform' }}
              />
            )}
            <span className={isActive ? 'text-background' : 'text-slate-400 hover:text-white'}>
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
};
