'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { IStealthOrderItem, useStealthTrayStore } from '@/lib/store/stealthTrayStore';

interface Props {
  item: IStealthOrderItem;
  tintColor: string;
}

export const StealthItemRow: React.FC<Props> = ({ item, tintColor }) => {
  const { updateStealthQuantity, addStealthItem } = useStealthTrayStore();

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-900 shadow-inner"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none">{item.icon}</span>
        <div>
          <h4 className="text-sm font-bold text-zinc-200" style={{ color: tintColor }}>
            {item.name}
          </h4>
          <span className="text-xs text-zinc-500 font-mono">₪{item.price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {item.quantity > 0 ? (
          <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-xl px-2 py-1">
            <button
              onClick={() => updateStealthQuantity(item.id, -1)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold font-mono px-1" style={{ color: tintColor }}>
              {item.quantity}
            </span>
            <button
              onClick={() => updateStealthQuantity(item.id, 1)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addStealthItem(item)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1"
            style={{ color: tintColor }}
          >
            <Plus className="w-3.5 h-3.5" /> הוסף
          </button>
        )}
      </div>
    </motion.div>
  );
};
