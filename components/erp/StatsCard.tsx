'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  color?: 'primary' | 'cyan' | 'purple' | 'gold';
}

const COLORS = {
  primary: 'from-primary/20 to-primary/5 border-primary/20 text-primary',
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
  gold: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
};

export default function StatsCard({ label, value, icon: Icon, trend, className, color = 'primary' }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "relative overflow-hidden p-6 rounded-[32px] border bg-gradient-to-br backdrop-blur-xl",
        COLORS[color],
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10")}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={cn(
            "px-2 py-1 rounded-full text-[10px] font-black tracking-tighter flex items-center gap-1",
            trend.isUp ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">
          {typeof value === 'number' && label.includes('הכנסות') ? `₪${value.toLocaleString()}` : value}
        </h3>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-current opacity-10 blur-3xl rounded-full" />
    </motion.div>
  );
}
