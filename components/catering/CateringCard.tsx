'use client';

import React, { useOptimistic, startTransition } from 'react';
import NextImage from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CateringItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tag?: string;
  isLargeFormat?: boolean;
}

interface CateringCardProps {
  item: CateringItem;
  quantity: number;
  onUpdateQuantity: (id: number, delta: number) => void;
}

export const CateringCard = ({ item, quantity, onUpdateQuantity }: CateringCardProps) => {
  // Local optimistic state for instant UI response without waiting for global store propagation
  const [optimisticQuantity, addOptimisticUpdate] = useOptimistic(
    quantity,
    (state: number, newQuantity: number) => newQuantity
  );

  const handleUpdate = (delta: number) => {
    const newQuantity = Math.max(0, optimisticQuantity + delta);
    startTransition(() => {
      addOptimisticUpdate(newQuantity);
    });
    // Trigger the actual global store update asynchronously
    onUpdateQuantity(item.id, delta);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 transition-colors ${
        optimisticQuantity > 0 ? 'bg-neutral-900/60' : 'bg-neutral-950/40 hover:bg-neutral-900/50'
      } ${item.isLargeFormat ? 'md:col-span-2 md:row-span-2' : ''}`}
      style={{
        backdropFilter: 'blur(40px) saturate(250%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.6)',
      }}
      dir="rtl"
    >
      {/* 0 CLS Strict Aspect Ratio Image Mask */}
      <div className={`relative w-full overflow-hidden ${item.isLargeFormat ? 'aspect-video' : 'aspect-[4/3]'}`}>
        <NextImage
          src={item.image}
          alt={item.name}
          fill
          sizes={item.isLargeFormat ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
          className="object-cover transform-gpu scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent pointer-events-none" />
        
        {/* Dynamic Tag Badge */}
        {item.tag && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#E5FF00]/90 text-black text-[10px] font-black uppercase tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {item.tag}
          </div>
        )}
      </div>

      {/* Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="text-white font-black text-base md:text-lg mb-1 tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {item.name}
          </h3>
          <p className="text-white/50 text-[11px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            {item.category} • מאושר קולנועית
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[#0AEFFF] font-black text-lg tracking-tighter" style={{ fontFamily: 'Outfit, sans-serif' }}>
            ₪{item.price.toFixed(2)}
          </span>

          {/* Liquid Glass Counter Controller */}
          <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-[14px] p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <button
              onClick={() => handleUpdate(-1)}
              disabled={optimisticQuantity === 0}
              className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              aria-label="הסר פריט"
            >
              <Minus size={14} />
            </button>
            
            <span className="w-6 text-center text-white font-black text-xs" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {optimisticQuantity}
            </span>
            
            <button
              onClick={() => handleUpdate(1)}
              className="p-1.5 text-white hover:text-[#0AEFFF] transition-colors"
              aria-label="הוסף פריט"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
