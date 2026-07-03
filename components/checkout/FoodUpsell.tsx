'use client';

import React from 'react';
import { ShoppingBasket, Plus, Minus, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FOOD_ITEMS } from '@/lib/constants';
import NextImage from 'next/image';
import Link from 'next/link';

interface FoodUpsellProps {
  selectedFood: { id: number; quantity: number }[];
  updateFoodQuantity: (id: number, delta: number) => void;
}

export const FoodUpsell = ({ selectedFood, updateFoodQuantity }: FoodUpsellProps) => {
  const handleAddBundle = () => {
    // Add Popcorn (ID 1) and Soda (ID 3)
    updateFoodQuantity(1, 1);
    updateFoodQuantity(3, 1);
  };

  // Slice to only the top 2 AI Pick items to keep the page completely scrollbar-free
  const upsellItems = FOOD_ITEMS.slice(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-[40px] p-6 md:p-8 border border-white/[0.06] group/upsell relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.03)'
      }}
    >
      {/* Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#E5FF00]/[0.03] rounded-full blur-[120px] mr-[-128px] mb-[-128px]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 flex-row-reverse">
        <div className="flex items-center gap-4 flex-row-reverse">
          <div className="w-10 h-10 bg-[#E5FF00]/10 rounded-2xl flex items-center justify-center border border-[#E5FF00]/20">
            <ShoppingBasket className="text-[#E5FF00]" size={18} />
          </div>
          <div className="text-right">
            <h2 className="text-lg font-black text-white font-rubik tracking-tight">תוספת לנשנוש</h2>
            <p className="text-[9px] text-white/30 font-bold mt-0.5">דלגו על התור בקולנוע!</p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddBundle}
          className="bg-[#FF1464]/[0.08] hover:bg-[#FF1464]/15 text-[#FF1464] px-4 py-2 rounded-[16px] border border-[#FF1464]/20 text-[8px] font-black tracking-[0.15em] flex items-center gap-2 transition-all font-anton"
        >
          <Flame size={12} className="animate-pulse" />
          SMART BUNDLE
        </motion.button>
      </div>
      
      {/* Food Grid - 2 columns side-by-side on all screens to eliminate vertical page scroll */}
      <div className="grid grid-cols-2 gap-4">
        {upsellItems.map((item, index) => {
          const quantity = selectedFood.find(f => f.id === item.id)?.quantity || 0;
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              className={`bg-white/[0.02] rounded-[20px] p-3 flex flex-col justify-between gap-3 border transition-all group/item ${
                quantity > 0 ? 'border-[#FF1464]/20 bg-[#FF1464]/[0.03]' : 'border-white/[0.04] hover:border-white/[0.08]'
              }`}
            >
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-12 h-12 relative rounded-[12px] overflow-hidden border border-white/[0.06] shrink-0">
                  <NextImage src={item.image} alt={item.name} fill sizes="48px" className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                  {quantity > 0 && <div className="absolute inset-0 bg-[#FF1464]/20" />}
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white leading-tight mb-0.5 truncate max-w-[80px] sm:max-w-[120px]">{item.name}</p>
                  <p className="text-xs text-[#E5FF00] font-black">₪{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-1 justify-start">
                    <Sparkles size={8} className="text-[#0AEFFF]" />
                    <span className="text-[7px] font-black text-[#0AEFFF]">AI PICK</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl rounded-[12px] p-1 border border-white/[0.06] flex-row-reverse gap-0.5 w-full">
                <button 
                  onClick={() => updateFoodQuantity(item.id, -1)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/25 hover:text-[#FF1464] transition-all"
                >
                  <Minus size={12} />
                </button>
                <span className={`px-2 font-black text-xs min-w-[20px] text-center ${quantity > 0 ? 'text-white' : 'text-white/20'}`}>{quantity}</span>
                <button 
                  onClick={() => updateFoodQuantity(item.id, 1)}
                  className="p-1.5 bg-[#FF1464] rounded-lg text-white hover:bg-[#FF2E78] transition-all shadow-lg active:scale-90"
                >
                  <Plus size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 text-right">
        <Link href="/food" className="inline-flex items-center gap-2 text-[#FF1464] hover:text-[#FF2E78] font-black text-[9px] uppercase tracking-[0.15em] flex-row-reverse group transition-colors">
          <ArrowRight size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" /> 
          <span>לצפייה בכל התפריט</span>
        </Link>
      </div>
    </motion.div>
  );
};
