'use client';

import React, { useOptimistic, startTransition, useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { motion, PanInfo } from 'framer-motion';
import { useMultisensoryFeedback } from '@/lib/hooks/useMultisensoryFeedback';

export interface KineticItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tag?: string;
  isLargeFormat?: boolean;
}

interface KineticSnackCardProps {
  item: KineticItem;
  quantity: number;
  onUpdateQuantity: (id: number, delta: number) => void;
}

export const KineticSnackCard = ({ item, quantity, onUpdateQuantity }: KineticSnackCardProps) => {
  const [optimisticQuantity, addOptimisticUpdate] = useOptimistic(
    quantity,
    (state: number, newQuantity: number) => newQuantity
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const { initAudio, playDragPulse, playDropRealization } = useMultisensoryFeedback();
  const lastPulseTime = useRef<number>(0);

  // Determine dynamic halo colors
  const getHaloColor = () => {
    if (item.isLargeFormat) return 'from-amber-500/40 to-yellow-600/20';
    if (item.category.includes('משקאות') || item.category.includes('שתייה')) return 'from-cyan-500/40 to-blue-600/20';
    return 'from-red-500/40 to-orange-600/20';
  };

  const handleDragStart = () => {
    initAudio(); // Lazily initialize AudioContext securely
    setIsDragging(true);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Throttle drag tactile pulses to max 1 per 150ms to prevent browser warning spam
    const now = Date.now();
    if (now - lastPulseTime.current > 150) {
      // Simulate "grid line" threshold crossing by checking velocity or raw distance
      if (Math.abs(info.velocity.x) > 100 || Math.abs(info.velocity.y) > 100) {
        playDragPulse();
        lastPulseTime.current = now;
      }
    }

    const tray = document.getElementById('cinema-tray-zone');
    if (!tray) return;
    
    const trayRect = tray.getBoundingClientRect();
    const isIntersecting = 
      info.point.x >= trayRect.left &&
      info.point.x <= trayRect.right &&
      info.point.y >= trayRect.top &&
      info.point.y <= trayRect.bottom;

    if (isIntersecting) {
      tray.classList.add('tray-active');
    } else {
      tray.classList.remove('tray-active');
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const tray = document.getElementById('cinema-tray-zone');
    if (!tray) return;

    tray.classList.remove('tray-active');

    const trayRect = tray.getBoundingClientRect();
    const isDropped = 
      info.point.x >= trayRect.left &&
      info.point.x <= trayRect.right &&
      info.point.y >= trayRect.top &&
      info.point.y <= trayRect.bottom;

    if (isDropped) {
      const newQuantity = optimisticQuantity + 1;
      startTransition(() => {
        addOptimisticUpdate(newQuantity);
      });
      onUpdateQuantity(item.id, 1);
      
      // Fire procedural drop audio and haptic sequence
      playDropRealization();
    }
  };

  return (
    <div className={`relative ${item.isLargeFormat ? 'md:col-span-2 md:row-span-2' : ''}`}>
      {/* Absolute Chromatic Specular Backglow Halo */}
      <div 
        className={`absolute -inset-4 rounded-full blur-xl pointer-events-none transition-all duration-500 ease-out bg-gradient-to-tr ${getHaloColor()} ${isDragging ? 'opacity-80 scale-110' : 'opacity-0 scale-90'}`}
        style={{ willChange: 'transform, opacity' }}
      />
      
      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.08, rotate: 3, cursor: "grabbing", zIndex: 50 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 transition-colors cursor-grab h-full ${
          optimisticQuantity > 0 ? 'bg-neutral-900/60' : 'bg-neutral-950/40 hover:bg-neutral-900/50'
        }`}
        style={{
          backdropFilter: 'blur(40px) saturate(250%)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.6)',
        }}
        dir="rtl"
      >
        {/* Fixed large height since we now allow internal scrolling */}
        <div className={`relative w-full overflow-hidden shrink-0 h-32 sm:h-36 md:h-40`}>
          <NextImage
            src={item.image}
            alt={item.name}
            fill
            sizes={item.isLargeFormat ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
            className="object-cover transform-gpu scale-100 group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
            draggable={false}
          />
          
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent pointer-events-none" />
          
          {/* Dynamic Tag Badge */}
          {item.tag && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#E5FF00]/90 text-black text-[10px] font-black uppercase tracking-widest pointer-events-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {item.tag}
            </div>
          )}
        </div>

        {/* Content & Metadata */}
        <div className="p-2.5 md:p-3 flex flex-col justify-between gap-1 pointer-events-none z-10 relative bg-neutral-950/20 shrink-0">
          <div>
            <h3 className="text-white font-black text-sm md:text-base mb-0.5 tracking-wide leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {item.name}
            </h3>
            <p className="text-white/50 text-[10px] md:text-[11px] font-medium hidden sm:block truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
              {item.category} • מאושר קולנועית
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="text-[#0AEFFF] font-black text-sm md:text-base tracking-tighter" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ₪{item.price.toFixed(2)}
            </span>

            {/* Quantity display */}
            {optimisticQuantity > 0 && (
              <div className="flex items-center justify-center bg-white/[0.05] border border-white/10 rounded-[10px] px-3 py-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <span className="text-white font-black text-xs" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  נבחרו {optimisticQuantity}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
