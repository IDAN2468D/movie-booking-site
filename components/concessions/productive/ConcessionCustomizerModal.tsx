'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Flame } from 'lucide-react';
import {
  SpiceOption,
  DrinkOption,
  SPICE_LABELS,
  DRINK_LABELS,
} from '@/lib/types/concession-productive';
import { useProductiveConcessionStore } from '@/lib/store/productiveConcessionStore';

export const ConcessionCustomizerModal: React.FC = () => {
  const isOpen = useProductiveConcessionStore((state) => state.isCustomizerOpen);
  const item = useProductiveConcessionStore((state) => state.customizerItem);
  const closeCustomizer = useProductiveConcessionStore((state) => state.closeCustomizer);
  const addItem = useProductiveConcessionStore((state) => state.addItem);

  const [selectedSpice, setSelectedSpice] = useState<SpiceOption>('CHEDDAR');
  const [selectedDrink, setSelectedDrink] = useState<DrinkOption>('COLA_ZERO');

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    addItem(item, selectedSpice, selectedDrink);
    closeCustomizer();
  };

  const isPopcorn = item.category === 'popcorn';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCustomizer}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-neutral-950/95 border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-5 overflow-hidden text-right"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-outfit text-white">
                  התאמה אישית: {item.name}
                </h3>
                <p className="text-xs text-neutral-400 font-inter">
                  בחרו את שייקר התבלינים והעדפת המשקה ללא תוספת תשלום
                </p>
              </div>
            </div>
            <button
              onClick={closeCustomizer}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Spice Shaker Options */}
          {isPopcorn && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold font-outfit text-amber-300 flex items-center gap-1.5">
                <Flame size={14} />
                <span>בחירת תבלין שייקר לפופקורן:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(SPICE_LABELS) as SpiceOption[]).map((spiceKey) => {
                  const isSelected = selectedSpice === spiceKey;
                  const spice = SPICE_LABELS[spiceKey];
                  return (
                    <button
                      key={spiceKey}
                      type="button"
                      onClick={() => setSelectedSpice(spiceKey)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>{spice.icon}</span>
                        <span className="truncate">{spice.label}</span>
                      </span>
                      {isSelected && <Check size={14} className="text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drink Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold font-outfit text-cyan-300 flex items-center gap-1.5">
              <span>🥤</span>
              <span>בחירת משקה מלווה:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(DRINK_LABELS) as DrinkOption[]).map((drinkKey) => {
                const isSelected = selectedDrink === drinkKey;
                const drink = DRINK_LABELS[drinkKey];
                return (
                  <button
                    key={drinkKey}
                    type="button"
                    onClick={() => setSelectedDrink(drinkKey)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <span>{drink.icon}</span>
                      <span className="truncate">{drink.label}</span>
                    </span>
                    {isSelected && <Check size={14} className="text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="text-sm font-bold text-white font-outfit">
              מחיר פריט: <span className="text-amber-400">₪{item.price}</span>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold text-xs font-outfit shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all"
            >
              הוסף למגש עם ההתאמה ⚡
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
