'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Activity, TrendingUp, ShoppingBag, Sparkles } from 'lucide-react';
import { playCockpitTick } from './LiquidCockpitAudio';

interface ERPLiquidityStreamProps {
  grossRevenue: number;
  taxRate: number;
  currency: 'ILS' | 'USD';
  activeCartsCount?: number;
  pendingCartsValue?: number;
}

export const ERPLiquidityStream: React.FC<ERPLiquidityStreamProps> = ({
  grossRevenue,
  taxRate,
  currency,
  activeCartsCount = 68,
  pendingCartsValue = 18450,
}) => {
  const netRevenue = grossRevenue * (1 - taxRate / 100);

  const formatMoney = (amount: number) => {
    const value = currency === 'USD' ? amount / 3.7 : amount;
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[36px] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group"
      dir="rtl"
    >
      {/* Specular highlight edge and ambient orb */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="absolute top-0 end-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-700" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400/10 rounded-2xl border border-amber-400/20 text-amber-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight font-['Outfit']">זרימת נזילות בזמן אמת</h3>
            <p className="text-slate-400 text-xs font-medium">Bento Block לנתוני הכנסות, מס ומסחר פעיל</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
        {/* Net Revenue Card */}
        <div
          onClick={() => playCockpitTick(860)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 shadow-inner transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">הכנסות נטו (לאחר מס {taxRate}%)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
            {formatMoney(netRevenue)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">ברוטו: {formatMoney(grossRevenue)}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14.8%</span>
            </span>
          </div>
        </div>

        {/* Active Pending Carts */}
        <div
          onClick={() => playCockpitTick(860)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 shadow-inner transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">עגלות בהליך רכישה</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
            {formatMoney(pendingCartsValue)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{activeCartsCount} לקוחות פעילים בקופות</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20 text-[10px]">
              חי
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
