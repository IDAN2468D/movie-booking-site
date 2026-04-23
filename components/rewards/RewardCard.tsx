'use client';

import React from 'react';
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
  return (
    <motion.div 
      whileHover={{ scale: 1.02, translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[32px] p-8 cursor-pointer transition-all duration-500"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(25px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Holographic Light Leak */}
      <div className="absolute -inset-full bg-gradient-to-tr from-primary/5 via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700 pointer-events-none" />
      
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

      {/* Glass Reflection Effect */}
      <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-[-25deg] translate-x-32 group-hover:translate-x-[-300px] transition-transform duration-1000 ease-out pointer-events-none" />
    </motion.div>
  );
};
