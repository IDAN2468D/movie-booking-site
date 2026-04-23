'use client';

import React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { ShoppingBasket, Plus, Minus, ArrowRight } from 'lucide-react';
import { FOOD_ITEMS } from '@/lib/constants';

interface FoodUpsellProps {
  selectedFood: { id: number; quantity: number }[];
  updateFoodQuantity: (id: number, delta: number) => void;
}

export const FoodUpsell = ({ selectedFood, updateFoodQuantity }: FoodUpsellProps) => {
  return (
    <div 
      className="rounded-[40px] p-10 border border-white/5"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4 flex-row-reverse">
        <ShoppingBasket className="text-primary" /> תוספת לנשנוש
      </h2>
      <p className="text-slate-400 text-sm mb-8 font-medium">הוסיפו נשנושים ודלגו על התור בקולנוע!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-row-reverse">
        {FOOD_ITEMS.slice(0, 4).map(item => {
          const quantity = selectedFood.find(f => f.id === item.id)?.quantity || 0;
          return (
            <div key={item.id} className="bg-white/5 rounded-3xl p-4 flex items-center justify-between border border-white/5 hover:border-primary/20 transition-all group flex-row-reverse">
              <div className="flex items-center gap-4 flex-row-reverse">
                <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-lg">
                  <NextImage src={item.image} alt={item.name} fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-primary font-black">₪{item.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-background/50 backdrop-blur-md rounded-xl p-1 border border-white/5 flex-row-reverse">
                <button 
                  onClick={() => updateFoodQuantity(item.id, -1)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 font-black text-white text-xs">{quantity}</span>
                <button 
                  onClick={() => updateFoodQuantity(item.id, 1)}
                  className="p-1.5 bg-primary rounded-lg text-background hover:bg-[#FF7A00] transition-colors shadow-lg shadow-primary/20"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <Link href="/food" className="mt-8 inline-flex items-center gap-2 text-primary hover:text-[#FF7A00] font-bold text-xs uppercase tracking-widest flex-row-reverse group">
        <ArrowRight size={14} className="rotate-180 group-hover:translate-x-1 transition-transform" /> לצפייה בכל התפריט
      </Link>
    </div>
  );
};
