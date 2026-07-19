'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FOOD_ITEMS } from '@/lib/constants';
import { KineticItem, KineticSnackCard } from './KineticSnackCard';
import { CinemaTrayZone } from './CinemaTrayZone';
import { useBookingStore } from '@/lib/store';
import { SmartTray } from './SmartTray';

interface VisualCateringGridProps {
  selectedFood: { id: number; quantity: number }[];
  updateFoodQuantity: (id: number, delta: number) => void;
}

export const VisualCateringGrid = ({ selectedFood, updateFoodQuantity }: VisualCateringGridProps) => {
  const pathname = usePathname();
  const isFoodPage = pathname === '/food';
  const router = useRouter();
  const selectedMovie = useBookingStore(state => state.selectedMovie);

  // Map the FOOD_ITEMS
  const enrichedCatalog: KineticItem[] = FOOD_ITEMS.map((item) => ({
    ...item,
    // Disabled large format to guarantee all items and images fit cleanly on one screen
    isLargeFormat: false,
  }));

  return (
    <div className="relative flex-1 flex flex-col min-h-0 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-[30px] p-4 md:p-6 border border-white/[0.06] relative flex-1 flex flex-col min-h-0 w-full"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 relative z-10 shrink-0">
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
        
        
        {/* Scrollable Container for Grid AND Tray so cards don't clip when dragged */}
        <div className="flex-1 min-h-0 overflow-y-auto relative w-full scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {selectedMovie && (
            <div className="px-2 pt-2">
              <SmartTray 
                movieTitle={(selectedMovie as any).displayTitle || (selectedMovie as any).title} 
                movieGenre={(selectedMovie as any).genres?.map((g: any) => g.name).join(', ') || 'General'} 
              />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 relative z-10 w-full pt-2 px-2 pb-8">
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
          <div className="mt-4 text-center sm:text-left border-t border-white/5 pt-4 relative z-10 shrink-0 pb-32">
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
          
          {/* Sticky Tray INSIDE the scroll container as a direct child */}
          <div className="sticky bottom-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none pb-2">
            <div className="pointer-events-auto w-full">
              <CinemaTrayZone selectedFood={selectedFood} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
