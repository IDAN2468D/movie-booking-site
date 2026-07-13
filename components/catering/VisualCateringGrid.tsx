'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FOOD_ITEMS } from '@/lib/constants';
import { KineticItem, KineticSnackCard } from './KineticSnackCard';
import { CinemaTrayZone } from './CinemaTrayZone';

interface VisualCateringGridProps {
  selectedFood: { id: number; quantity: number }[];
  updateFoodQuantity: (id: number, delta: number) => void;
}

export const VisualCateringGrid = ({ selectedFood, updateFoodQuantity }: VisualCateringGridProps) => {
  const pathname = usePathname();
  const isFoodPage = pathname === '/food';
  const router = useRouter();

  // Map the FOOD_ITEMS to mark specific items as large format for the Bento layout
  const enrichedCatalog: KineticItem[] = FOOD_ITEMS.map((item, index) => ({
    ...item,
    // Make specific items large format for a cool asymmetric bento look
    isLargeFormat: index === 0 || index === 3,
  }));

  return (
    <div className="relative pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-[40px] p-6 md:p-8 border border-white/[0.06] relative"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.03)'
        }}
        dir="rtl"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#E5FF00]/[0.04] rounded-full blur-[120px] ml-[-128px] mt-[-128px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF1464]/10 rounded-[18px] flex items-center justify-center border border-[#FF1464]/20 shadow-[0_0_30px_rgba(255,20,100,0.15)]">
              <ShoppingBasket className="text-[#FF1464]" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                חוויה קולינרית פיזיקלית
              </h2>
              <p className="text-[11px] text-white/40 font-medium mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                גררו את המוצרים המבוקשים ישירות למגש
              </p>
            </div>
          </div>
        </div>
        
        {/* Asymmetric Bento Grid - z-10 is needed so dragging isn't clipped by sibling boundaries improperly */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {enrichedCatalog.map((item) => {
            const quantity = selectedFood.find((f) => f.id === item.id)?.quantity || 0;
            return (
              <KineticSnackCard
                key={item.id}
                item={item}
                quantity={quantity}
                onUpdateQuantity={updateFoodQuantity}
              />
            );
          })}
        </div>
        
        {/* Footer link to full menu if necessary */}
        <div className="mt-8 text-center sm:text-left border-t border-white/5 pt-6 relative z-10">
          <button 
            onClick={() => {
              if (isFoodPage) {
                router.push('/checkout');
              } else {
                router.push('/food');
              }
            }}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] font-black uppercase tracking-[0.15em] group transition-colors cursor-pointer" 
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <ArrowRight size={14} className={isFoodPage ? "group-hover:translate-x-[-4px] transition-transform" : "rotate-180 group-hover:translate-x-[-4px] transition-transform"} /> 
            <span>{isFoodPage ? 'חזרה לתשלום' : 'לצפייה בתפריט המלא'}</span>
          </button>
        </div>
      </motion.div>

      {/* The drop zone tray */}
      <CinemaTrayZone selectedFood={selectedFood} />
    </div>
  );
};
