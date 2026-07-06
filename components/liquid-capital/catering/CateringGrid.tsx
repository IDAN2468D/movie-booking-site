'use client';

import React from 'react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Sparkles, Plus, Check } from 'lucide-react';
import { CateringCartItem } from '@/lib/store/catering-store';

export interface CateringMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  allergens: string[];
}

interface CateringGridProps {
  items: CateringMenuItem[];
  cart: CateringCartItem[];
  onAdd: (item: CateringMenuItem) => void;
}

export const CateringGrid: React.FC<CateringGridProps> = ({ items, cart, onAdd }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const inCart = cart.some((c) => c.id === item.id);
        return (
          <motion.div
            key={item.id}
            layout // hardware-accelerated GPU layout mapping
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="group relative backdrop-blur-3xl saturate-[200%] brightness-110 bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-[#00f2fe]/40 transition-all duration-300 flex flex-col justify-between min-h-[180px]"
            style={{
              boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
              contentVisibility: 'auto'
            }}
          >
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <span className="text-[10px] font-black tracking-widest text-[#00f2fe] uppercase bg-[#00f2fe]/10 px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
                <span className="text-sm font-bold text-white/50">{item.allergens.length > 0 ? `אלרגנים: ${item.allergens.join(', ')}` : 'נטול אלרגנים'}</span>
              </div>
              <h4 className="text-xl font-bold font-outfit text-white mb-2 group-hover:text-[#00f2fe] transition-colors text-right">
                {item.name}
              </h4>
              <p className="text-xs text-white/60 line-clamp-2 mb-6 text-right leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-auto flex-row-reverse">
              <span className="text-2xl font-black font-outfit text-white">₪{item.price}</span>
              <button
                onClick={() => onAdd(item)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  inCart 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-[#00f2fe] text-black hover:bg-[#4facfe] shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:scale-105'
                }`}
              >
                <span>{inCart ? 'נוסף לסל' : 'הוסף לתפריט'}</span>
                {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Ambient highlight effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
};
