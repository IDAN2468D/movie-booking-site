'use client';

import React, { useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface RewardCardProps {
  title: string;
  desc: string;
  points: number;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export const RewardCard = ({ title, desc, points, icon: Icon, color, onClick }: RewardCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="gradient-border-card group relative overflow-hidden rounded-[32px] p-8 cursor-pointer transition-all duration-500 bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl"
    >
      {/* Gradient Border Overlay */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: 'radial-gradient(380px circle at var(--x, 50%) var(--y, 50%), rgba(168, 85, 247, 0.95), rgba(59, 130, 246, 0.8), transparent 70%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8 flex-row">
          <div className={`p-4 rounded-2xl bg-white/5 ${color} shadow-inner`}>
            <Icon size={24} />
          </div>
          <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary tracking-tighter">
            {points} נקודות
          </div>
        </div>
        
        <h3 className="text-lg font-black text-white mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-[-25deg] translate-x-32 group-hover:translate-x-[-300px] transition-transform duration-1000 ease-out pointer-events-none" />
    </motion.div>
  );
};
