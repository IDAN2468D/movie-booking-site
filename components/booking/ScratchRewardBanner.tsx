'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ScratchRewardBannerProps {
  type: 'discount_percentage' | 'fixed_discount' | 'free_ticket';
  value: number;
  discountAmount: number;
}

export const ScratchRewardBanner = ({ type, value, discountAmount }: ScratchRewardBannerProps) => {
  let title = '';
  let description = '';

  if (type === 'discount_percentage') {
    title = `הנחת כרטיס גירוד (${value}%)`;
    description = 'הטבת כרטיס גירוד הוחלה אוטומטית!';
  } else if (type === 'fixed_discount') {
    title = `הטבת כרטיס גירוד (₪${value})`;
    description = 'הטבת כרטיס גירוד הוחלה אוטומטית!';
  } else if (type === 'free_ticket') {
    title = 'כרטיס חינם!';
    description = 'זכית בכרטיס אחד חינם דרך כרטיס הגירוד!';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-6 rounded-[24px] relative overflow-hidden group transform-gpu"
      style={{
        background: 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(40px) saturate(250%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.6)',
      }}
      dir="rtl"
    >
      <div className="absolute inset-0 border border-white/10 rounded-[24px] pointer-events-none" />
      
      {/* Neon Radial Gradient Mask */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1464]/[0.15] rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0AEFFF]/[0.1] rounded-full blur-[40px] -ml-8 -mb-8 pointer-events-none" />

      <div className="p-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF1464] to-[#FF5E95] flex items-center justify-center shadow-[0_0_20px_rgba(255,20,100,0.4)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h4 className="text-white font-black text-lg tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {title}
            </h4>
            <p className="text-white/60 text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              {description}
            </p>
          </div>
        </div>
        
        <div className="text-left">
          <div className="text-[#0AEFFF] font-black text-xl tracking-tighter" style={{ fontFamily: 'Outfit, sans-serif' }}>
            -₪{discountAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
