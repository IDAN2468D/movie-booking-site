'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoyaltyBadgeProps {
  points: number;
  tier: string;
}

export default function LoyaltyBadge({ points, tier }: LoyaltyBadgeProps) {
  const isGoldOrElite = tier === 'Gold' || tier === 'Liquid Elite';

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md transition-colors duration-500 ${
        isGoldOrElite 
          ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] text-amber-300'
          : tier === 'Silver'
          ? 'bg-slate-300/20 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.2)] text-slate-200'
          : 'bg-white/10 border-white/20 text-white/80'
      }`}
    >
      <Sparkles className="w-3 h-3" />
      <span className="text-[10px] uppercase font-bold tracking-widest">{tier} • {points} PT</span>
    </motion.div>
  );
}
