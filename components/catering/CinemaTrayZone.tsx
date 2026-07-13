'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket } from 'lucide-react';
import { FOOD_ITEMS } from '@/lib/constants';

interface CinemaTrayZoneProps {
  selectedFood: { id: number; quantity: number }[];
}

export const CinemaTrayZone = ({ selectedFood }: CinemaTrayZoneProps) => {
  const totalItems = selectedFood.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = selectedFood.reduce((acc, item) => {
    const foodDef = FOOD_ITEMS.find(f => f.id === item.id);
    return acc + (foodDef ? foodDef.price * item.quantity : 0);
  }, 0);

  return (
    <div className="sticky bottom-6 mt-8 z-50 flex justify-center px-4 pointer-events-none" dir="rtl">
      <motion.div
        id="cinema-tray-zone"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="pointer-events-auto flex items-center justify-between gap-6 px-6 py-4 rounded-full min-w-[320px] transition-all duration-300"
        style={{
          backdropFilter: 'blur(40px) saturate(250%)',
          backgroundColor: 'rgba(10, 10, 10, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
              <ShoppingBasket className="text-white" size={20} />
            </div>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#0AEFFF] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(10,239,255,0.5)]"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {totalItems}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
              מגש סינמטי
            </h3>
            <p className="text-white/40 text-[10px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              גרור לכאן כדי להוסיף
            </p>
          </div>
        </div>

        <div className="text-left">
          <p className="text-white/50 text-[10px] font-medium uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>סך הכל</p>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={totalPrice}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#E5FF00] font-black text-xl tracking-tighter"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              ₪{totalPrice.toFixed(2)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Global styles for dynamic tray-active class applied by KineticSnackCard during drag */}
      <style dangerouslySetInnerHTML={{ __html: `
        #cinema-tray-zone.tray-active {
          border-color: rgba(245, 158, 11, 0.4) !important;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 0 30px rgba(245, 158, 11, 0.2) !important;
          transform: scale(1.02) !important;
        }
      `}} />
    </div>
  );
};
