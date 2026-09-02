'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, X, Check, ShoppingBag, ShieldAlert, Moon } from 'lucide-react';
import { useStealthTrayStore, IStealthOrderItem } from '@/lib/store/stealthTrayStore';
import { StealthItemRow } from './StealthItemRow';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

const MENU_ITEMS: Omit<IStealthOrderItem, 'quantity'>[] = [
  { id: 'st-pop-lg', name: 'פופקורן ענק חם', category: 'popcorn', price: 34, icon: '🍿' },
  { id: 'st-coke-lg', name: 'קולה זירו קר 0.5L', category: 'drink', price: 18, icon: '🥤' },
  { id: 'st-nachos', name: 'נאצ׳וס עם גבינה חמה', category: 'snack', price: 38, icon: '🧀' },
  { id: 'st-mms', name: 'M&M בוטנים קולנוע', category: 'snack', price: 22, icon: '🍫' },
  { id: 'st-water', name: 'מים מינרליים קרים', category: 'drink', price: 12, icon: '💧' },
];

export const StealthTrayOverlay: React.FC = () => {
  const {
    isStealthActive,
    toggleStealthMode,
    nightVisionTint,
    setNightVisionTint,
    stealthItems,
    isSubmitting,
    orderCompleted,
    submitStealthOrder,
    clearStealthOrder
  } = useStealthTrayStore();

  if (!isStealthActive) return null;

  const tintColor = nightVisionTint === 'amber' ? '#f59e0b' : nightVisionTint === 'red' ? '#ef4444' : '#e4e4e7';
  const totalQty = stealthItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = stealthItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-[#050505] text-zinc-300 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto"
        dir="rtl"
      >
        {/* Stealth Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" style={{ color: tintColor }} />
            <div>
              <span className="text-xs font-black uppercase tracking-wider block" style={{ color: tintColor }}>
                Stealth Tray Mode • מצב אולם חשוך
              </span>
              <span className="text-[10px] text-zinc-600">עוצמת הארה מינימלית למניעת הפרעה לסובבים</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tint Switcher */}
            <div className="flex items-center bg-black border border-zinc-900 rounded-lg p-0.5">
              {(['amber', 'red', 'monochrome'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setNightVisionTint(t)}
                  className={`w-4 h-4 rounded-full m-0.5 border ${
                    t === 'amber' ? 'bg-amber-500 border-amber-600' :
                    t === 'red' ? 'bg-red-500 border-red-600' : 'bg-zinc-300 border-zinc-400'
                  } ${nightVisionTint === t ? 'ring-2 ring-white/50' : 'opacity-40'}`}
                />
              ))}
            </div>

            <button
              onClick={() => toggleStealthMode(false)}
              className="p-2 bg-zinc-900/60 rounded-xl text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="my-auto py-4 space-y-4 max-w-md mx-auto w-full">
          {orderCompleted ? (
            <div className="text-center py-10 space-y-3">
              <Check className="w-12 h-12 mx-auto" style={{ color: tintColor }} />
              <h3 className="text-base font-black" style={{ color: tintColor }}>
                ההזמנה נשלחה בשקט לשליח האולם!
              </h3>
              <p className="text-xs text-zinc-500">
                המגש יוגש ישירות למושבך תוך דקות ספורות ללא הפרעה לצפייה.
              </p>
              <button
                onClick={clearStealthOrder}
                className="mt-4 px-4 py-2 rounded-xl text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                בצע הזמנה נוספת
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <span className="text-[11px] text-zinc-500 font-bold block">תפריט מהיר בלחיצה:</span>
                {MENU_ITEMS.map((item) => {
                  const existing = stealthItems.find((i) => i.id === item.id);
                  return (
                    <StealthItemRow
                      key={item.id}
                      item={{ ...item, quantity: existing?.quantity || 0 }}
                      tintColor={tintColor}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Order Dispatch */}
        {!orderCompleted && (
          <div className="pt-3 border-t border-zinc-900 max-w-md mx-auto w-full">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-zinc-500">פריטים: {totalQty}</span>
              <span className="text-sm font-black font-mono" style={{ color: tintColor }}>
                סה״כ: ₪{totalPrice}
              </span>
            </div>

            <button
              onClick={submitStealthOrder}
              disabled={isSubmitting || totalQty === 0}
              className="w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 border disabled:opacity-30"
              style={{
                backgroundColor: totalQty > 0 ? '#111' : '#0a0a0a',
                borderColor: tintColor,
                color: tintColor
              }}
            >
              {isSubmitting ? (
                <LoadingIndicator variant="spinner" size={16} color={tintColor} label="שולח בשקט..." />
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> שגר הזמנה שקטה למושב
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
