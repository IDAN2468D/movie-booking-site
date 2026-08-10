'use client';

import React from 'react';
import { useBookingStore } from '@/lib/store';

export const RightPanelSnackGrid: React.FC = () => {
  const { selectedFood, updateFoodQuantity } = useBookingStore();

  const snacks = [
    { id: 1, name: 'פופקורן VIP', price: '₪25', icon: '🍿' },
    { id: 2, name: 'שתייה קרה', price: '₪15', icon: '🥤' },
    { id: 3, name: 'נאצ׳וס חם', price: '₪30', icon: '🌮' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-primary font-black bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-tighter animate-pulse">
          הטבת שידור חי
        </span>
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-60">תוספות לנשנוש בלייב</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {snacks.map((snack) => {
          const quantity = selectedFood.find(f => f.id === snack.id)?.quantity || 0;
          return (
            <button
              key={snack.id}
              onClick={() => updateFoodQuantity(snack.id, 1)}
              className={`gradient-border-card group relative bg-white/[0.03] border p-3 rounded-2xl transition-all duration-300 text-center cursor-pointer overflow-hidden ${
                quantity > 0
                  ? 'border-primary/50 bg-primary/10 shadow-lg'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                style={{
                  background: 'radial-gradient(150px circle at var(--x, 50%) var(--y, 50%), rgba(255, 159, 10, 0.9), rgba(6, 182, 212, 0.75), transparent 70%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              {quantity > 0 && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-primary text-background rounded-lg text-[10px] font-black flex items-center justify-center z-10 shadow-md">
                  {quantity}
                </div>
              )}
              <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-300 relative z-10">{snack.icon}</div>
              <p className="text-[11px] text-white font-black tracking-tight mb-0.5 relative z-10">{snack.name}</p>
              <p className="text-[10px] text-primary font-black opacity-90 relative z-10">{snack.price}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
