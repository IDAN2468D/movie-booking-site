'use client';

import React from 'react';
import NextImage from 'next/image';
import { Plus, Minus, Star, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export interface FoodItem {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  tag?: string;
}

interface FoodItemCardProps {
  item: FoodItem;
  quantity: number;
  onUpdate: (id: number, delta: number) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, quantity, onUpdate }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
        willChange: 'transform',
        contentVisibility: 'auto'
      }}
      className="group relative backdrop-blur-3xl saturate-[200%] brightness-110 bg-white/5 rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/45 transition-all duration-300 text-right cursor-pointer"
      onClick={() => onUpdate(item.id, 1)}
    >
      {item.tag && (
        <div className="absolute top-4 right-4 z-10 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5 flex-row-reverse">
          <Flame size={12} className="text-primary" />
          <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{item.tag}</span>
        </div>
      )}
      
      <div className="h-48 relative overflow-hidden">
        <NextImage 
          src={item.image} 
          alt={item.name} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2 flex-row-reverse">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.category}</span>
          <div className="flex items-center gap-1 flex-row-reverse">
            <Star size={12} className="text-primary fill-primary" />
            <span className="text-xs font-bold text-white">{item.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-black text-white mb-6 group-hover:text-primary transition-colors font-outfit">{item.name}</h3>
        
        <div className="flex items-center justify-between flex-row-reverse">
          <p className="text-xl font-black text-white">₪{item.price.toFixed(2)}</p>
          <div className="flex items-center bg-background rounded-2xl p-1 border border-white/5 flex-row-reverse">
             <button 
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(item.id, -1);
              }}
              className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors cursor-pointer"
             >
                <Minus size={16} />
             </button>
             <span className="px-4 font-black text-white text-sm">{quantity}</span>
             <button 
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(item.id, 1);
              }}
              className="p-2 bg-primary rounded-xl text-background hover:bg-[#FF7A00] transition-colors shadow-lg shadow-primary/20 cursor-pointer"
             >
                <Plus size={16} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
