'use client';

import React, { useOptimistic, startTransition, useState, useRef } from 'react';
import NextImage from 'next/image';
import { motion, PanInfo } from 'framer-motion';
import { useMultisensoryFeedback } from '@/lib/hooks/useMultisensoryFeedback';

export interface KineticItem {
  id: number; name: string; category: string; price: number; image: string; tag?: string; isLargeFormat?: boolean;
}

interface KineticSnackCardProps {
  item: KineticItem; quantity: number; onUpdateQuantity: (id: number, delta: number) => void;
}

export const KineticSnackCard = ({ item, quantity, onUpdateQuantity }: KineticSnackCardProps) => {
  const [optimisticQuantity, addOptimisticUpdate] = useOptimistic(quantity, (_state: number, newQty: number) => newQty);
  const [isDragging, setIsDragging] = useState(false);
  const { initAudio, playDragPulse, playDropRealization } = useMultisensoryFeedback();
  const lastPulseTime = useRef<number>(0);

  const getHaloColor = () => {
    if (item.isLargeFormat) return 'from-amber-500/40 to-yellow-600/20';
    if (item.category.includes('משקאות') || item.category.includes('שתייה')) return 'from-cyan-500/40 to-blue-600/20';
    return 'from-red-500/40 to-orange-600/20';
  };

  const handleDrag = (_e: any, info: PanInfo) => {
    const now = Date.now();
    if (now - lastPulseTime.current > 150) {
      if (Math.abs(info.velocity.x) > 100 || Math.abs(info.velocity.y) > 100) {
        playDragPulse(); lastPulseTime.current = now;
      }
    }
    const tray = document.getElementById('cinema-tray-zone');
    if (!tray) return;
    const r = tray.getBoundingClientRect();
    const isIntersecting = info.point.x >= r.left && info.point.x <= r.right && info.point.y >= r.top && info.point.y <= r.bottom;
    if (isIntersecting) tray.classList.add('tray-active');
    else tray.classList.remove('tray-active');
  };

  const handleDragEnd = (_e: any, info: PanInfo) => {
    setIsDragging(false);
    const tray = document.getElementById('cinema-tray-zone');
    if (!tray) return;
    tray.classList.remove('tray-active');
    const r = tray.getBoundingClientRect();
    const isDropped = info.point.x >= r.left && info.point.x <= r.right && info.point.y >= r.top && info.point.y <= r.bottom;
    if (isDropped) {
      startTransition(() => { addOptimisticUpdate(optimisticQuantity + 1); });
      onUpdateQuantity(item.id, 1);
      playDropRealization();
    }
  };

  return (
    <div className={`relative h-full ${item.isLargeFormat ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <div 
        className={`absolute -inset-4 rounded-full blur-xl pointer-events-none transition-all duration-500 bg-gradient-to-tr ${getHaloColor()} ${isDragging ? 'opacity-80 scale-110' : 'opacity-0 scale-90'}`}
        style={{ willChange: 'transform, opacity' }}
      />
      <motion.div
        drag dragSnapToOrigin dragElastic={0.4} dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
        onDragStart={() => { initAudio(); setIsDragging(true); }} onDrag={handleDrag} onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.08, rotate: 3, cursor: 'grabbing', zIndex: 50 }}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 transition-colors cursor-grab h-full ${
          optimisticQuantity > 0 ? 'bg-neutral-900/80 border-[#FF1464]/40 shadow-[0_0_20px_rgba(255,20,100,0.15)]' : 'bg-neutral-950/60 hover:bg-neutral-900/60'
        }`}
        style={{ backdropFilter: 'blur(40px) saturate(200%)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.6)' }}
        dir="rtl"
      >
        <div className="relative w-full overflow-hidden shrink-0 h-28 sm:h-32">
          <NextImage src={item.image} alt={item.name} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent pointer-events-none" />
          {item.tag && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#E5FF00] text-black text-[9px] font-black uppercase tracking-wider pointer-events-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {item.tag}
            </div>
          )}
        </div>

        <div className="p-2.5 flex flex-col justify-between gap-1 pointer-events-none z-10 relative bg-neutral-950/40">
          <div>
            <h3 className="text-white font-black text-xs sm:text-sm tracking-wide truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.name}</h3>
            <p className="text-white/50 text-[10px] font-medium truncate">{item.category}</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#0AEFFF] font-black text-xs sm:text-sm tracking-tighter" style={{ fontFamily: 'Outfit, sans-serif' }}>₪{item.price.toFixed(2)}</span>
            <div className="pointer-events-auto flex items-center gap-1 z-20">
              {optimisticQuantity > 0 ? (
                <div className="flex items-center gap-1 bg-white/[0.08] border border-white/15 rounded-xl p-0.5 shadow-inner">
                  <button type="button" onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, -1); }} className="w-5 h-5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-black cursor-pointer active:scale-90">-</button>
                  <span className="text-white font-black text-xs px-1 min-w-[14px] text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>{optimisticQuantity}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, 1); }} className="w-5 h-5 rounded-lg bg-[#FF1464] hover:bg-[#ff2d75] text-white flex items-center justify-center text-xs font-black cursor-pointer active:scale-90 shadow-[0_0_8px_rgba(255,20,100,0.4)]">+</button>
                </div>
              ) : (
                <button type="button" onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, 1); }} className="px-2.5 py-1 rounded-xl bg-white/[0.08] hover:bg-[#FF1464] text-white/80 hover:text-white border border-white/10 hover:border-[#FF1464]/50 flex items-center gap-1 text-[10px] font-bold transition-all cursor-pointer active:scale-90">
                  <span>+</span><span>הוסף</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
