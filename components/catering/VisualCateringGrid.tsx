'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Sparkles, Popcorn, Flame, Utensils } from 'lucide-react';
import { FOOD_ITEMS } from '@/lib/constants';
import { KineticItem, KineticSnackCard } from './KineticSnackCard';
import { CinemaTrayZone } from './CinemaTrayZone';
import { useBookingStore } from '@/lib/store';
import { SmartTray } from './SmartTray';
import { DynamicComboRoulette } from './DynamicComboRoulette';

interface VisualCateringGridProps {
  selectedFood: { id: number; quantity: number }[];
  updateFoodQuantity: (id: number, delta: number) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'הכל 🍿', icon: Popcorn },
  { id: 'חטיפים', label: 'פופקורן ונשנושים', icon: Flame },
  { id: 'משקאות', label: 'משקאות קרים', icon: Sparkles },
  { id: 'קינוחים', label: 'קינוחים וממתקים', icon: Utensils },
];

export const VisualCateringGrid = ({ selectedFood, updateFoodQuantity }: VisualCateringGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const selectedMovie = useBookingStore(state => state.selectedMovie);

  const filteredItems: KineticItem[] = FOOD_ITEMS
    .filter(item => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'קינוחים') return item.category === 'קינוחים' || item.category === 'ממתקים';
      return item.category === activeCategory;
    })
    .map(item => ({ ...item, isLargeFormat: false }));

  const totalFoodItemsCount = selectedFood.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="relative w-full" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-[32px] p-5 md:p-8 border border-white/10 relative w-full overflow-hidden bg-gradient-to-b from-[#0e0e14]/90 via-[#0a0a0f]/95 to-[#060608]/95 shadow-[0_25px_80px_rgba(0,0,0,0.6)] backdrop-blur-[50px] saturate-[200%]"
      >
        {/* Ambient Glow Refractions */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF1464]/[0.06] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0AEFFF]/[0.05] rounded-full blur-[140px] pointer-events-none" />

        {/* Wide Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF1464] to-[#FF7B00] flex items-center justify-center shadow-[0_0_35px_rgba(255,20,100,0.35)] p-0.5">
              <div className="w-full h-full bg-black/40 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
                <ShoppingBasket className="text-white" size={26} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF1464]/20 border border-[#FF1464]/40 text-[#FF1464] text-[10px] font-black uppercase tracking-widest font-mono">
                  VIP KINETIC CATERING
                </span>
                <span className="text-white/40 text-xs font-mono">• 120Hz פיזיקה</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                חוויה קולינרית פיזיקלית
              </h2>
              <p className="text-xs text-white/50 font-medium mt-0.5">
                גררו מוצרים ישירות למגש הסינמטי או הוסיפו בלחיצה מהירה
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white/[0.04] p-1.5 rounded-2xl border border-white/10">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF1464] to-[#FF7B00] text-white shadow-[0_0_20px_rgba(255,20,100,0.4)] scale-105'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Smart Deals & Combo (Wide 2-Column or Stack) */}
        {selectedMovie && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 my-6 relative z-10 items-stretch">
            <DynamicComboRoulette movieTitle={(selectedMovie as any).displayTitle || (selectedMovie as any).title} />
            <SmartTray 
              movieTitle={(selectedMovie as any).displayTitle || (selectedMovie as any).title} 
              movieGenre={(selectedMovie as any).genres?.map((g: any) => g.name).join(', ') || 'Action'} 
            />
          </div>
        )}

        {/* Wide Responsive Snacks Grid (6 Columns on Large Screens) */}
        <div className="relative z-10 w-full pt-2 pb-6">
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const quantity = selectedFood.find((f) => f.id === item.id)?.quantity || 0;
                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <KineticSnackCard item={item} quantity={quantity} onUpdateQuantity={updateFoodQuantity} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Floating Cinematic Tray */}
        <div className="relative z-20 w-full pt-4 border-t border-white/5">
          <CinemaTrayZone selectedFood={selectedFood} />
        </div>
      </motion.div>
    </div>
  );
};
