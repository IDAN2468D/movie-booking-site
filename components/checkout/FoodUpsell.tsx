'use client';

import React from 'react';
import { ShoppingBasket, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FOOD_ITEMS } from '@/lib/constants';

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-[40px] p-8 md:p-10 border border-white/[0.06] group/upsell relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.03)'
      }}
    >
      {/* Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#E5FF00]/[0.03] rounded-full blur-[120px] mr-[-128px] mb-[-128px]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-row-reverse">
        <div className="flex items-center gap-4 flex-row-reverse">
          <div className="w-11 h-11 bg-[#E5FF00]/10 rounded-2xl flex items-center justify-center border border-[#E5FF00]/20">
            <ShoppingBasket className="text-[#E5FF00]" size={20} />
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-white font-rubik tracking-tight">תוספת לנשנוש</h2>
            <p className="text-[10px] text-white/30 font-bold font-rubik mt-0.5">דלגו על התור בקולנוע!</p>
          </div>
        </div>
        
        {/* Smart Bundle Badge */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddBundle}
          className="bg-[#FF1464]/[0.08] hover:bg-[#FF1464]/15 text-[#FF1464] px-5 py-2.5 rounded-[20px] border border-[#FF1464]/20 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 transition-all font-anton"
        >
          <Flame size={13} className="animate-pulse" />
          SMART BUNDLE
        </motion.button>
      </div>
      
      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FOOD_ITEMS.slice(0, 4).map((item, index) => {
          const quantity = selectedFood.find(f => f.id === item.id)?.quantity || 0;
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              className={`bg-white/[0.02] rounded-[24px] p-4 flex items-center justify-between border transition-all group/item flex-row-reverse ${
                quantity > 0 ? 'border-[#FF1464]/20 bg-[#FF1464]/[0.03]' : 'border-white/[0.04] hover:border-white/[0.08]'
              }`}
            >
              <div className="flex items-center gap-4 flex-row-reverse">
                <div className="w-16 h-16 relative rounded-[16px] overflow-hidden shadow-xl border border-white/[0.06] shrink-0">
                  <NextImage src={item.image} alt={item.name} fill sizes="64px" className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                  {quantity > 0 && (
                    <div className="absolute inset-0 bg-[#FF1464]/20" />
                  )}
                </div>
                <div className="text-right relative">
                  <p className="text-sm font-black text-white font-rubik leading-tight mb-1">{item.name}</p>
                  <p className="text-sm text-[#E5FF00] font-black font-anton tracking-wider">₪{item.price.toFixed(2)}</p>
                  {(item.id === 1 || item.id === 3) && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Sparkles size={9} className="text-[#0AEFFF]" />
                      <span className="text-[8px] font-black text-[#0AEFFF] uppercase tracking-widest font-anton">AI PICK</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center bg-black/40 backdrop-blur-xl rounded-[14px] p-1 border border-white/[0.06] flex-row-reverse gap-0.5">
                <button 
                  onClick={() => updateFoodQuantity(item.id, -1)}
                  className="p-2 hover:bg-white/10 rounded-xl text-white/25 hover:text-[#FF1464] transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className={`px-3 font-black text-sm font-anton min-w-[28px] text-center ${quantity > 0 ? 'text-white' : 'text-white/20'}`}>{quantity}</span>
                <button 
                  onClick={() => updateFoodQuantity(item.id, 1)}
                  className="p-2 bg-[#FF1464] rounded-xl text-white hover:bg-[#FF2E78] transition-all shadow-lg shadow-[#FF1464]/20 active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <Link href="/food" className="mt-8 inline-flex items-center gap-3 text-[#FF1464] hover:text-[#FF2E78] font-black text-[10px] uppercase tracking-[0.2em] flex-row-reverse group font-rubik transition-colors">
        <ArrowRight size={14} className="rotate-180 group-hover:translate-x-1 transition-transform" /> 
        <span>לצפייה בכל התפריט</span>
      </Link>
    </motion.div>
  );
};
