'use client';

import React, { useState } from 'react';
import { TrendingUp, Percent, AlertTriangle, Zap, DollarSign } from 'lucide-react';
import { calculateYieldOptimization, YieldRecommendation } from '@/lib/erp/yieldOptimizer';

export const YieldOptimizationDashboard: React.FC = () => {
  const [occupancy, setOccupancy] = useState<number>(28);
  const [hoursLeft, setHoursLeft] = useState<number>(2.5);
  const basePrice = 48;

  const yieldRec = calculateYieldOptimization(occupancy, hoursLeft, basePrice);

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-slate-950/90 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-emerald-300">AI Dynamic Pricing & Yield Optimization</h3>
            <p className="text-xs text-gray-400">ניתוח ביקוש ואופטימיזציית תפוסה בזמן אמת</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Controls for Simulation */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/50 border border-white/10">
          <div>
            <label className="text-[11px] text-gray-400 font-bold block mb-1">תפוסת אולם נוכחית: {occupancy}%</label>
            <input
              type="range"
              min="5"
              max="100"
              value={occupancy}
              onChange={(e) => setOccupancy(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-bold block mb-1">שעות עד להקרנה: {hoursLeft} ש׳</label>
            <input
              type="range"
              min="0.5"
              max="24"
              step="0.5"
              value={hoursLeft}
              onChange={(e) => setHoursLeft(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* AI Yield Recommendation Result */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>המלצת AI למסע פרסום:</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {yieldRec.actionType}
            </span>
          </div>

          <p className="text-sm font-bold text-white">{yieldRec.promoActionHe}</p>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-500/20 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 block text-[10px]">מחיר בסיס:</span>
              <span className="font-bold text-white text-base">₪{basePrice}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 block text-[10px]">מחיר מוצע דינמי:</span>
              <span className="font-bold text-emerald-400 text-base">₪{yieldRec.recommendedPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
