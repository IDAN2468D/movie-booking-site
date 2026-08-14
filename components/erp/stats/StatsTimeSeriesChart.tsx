'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Calendar, DollarSign, Layers, Info } from 'lucide-react';
import { TimeSeriesPoint } from '@/lib/erp/stats/types';
import { cn } from '@/lib/utils';

interface Props {
  daily: TimeSeriesPoint[];
  monthly: TimeSeriesPoint[];
  currency: 'ILS' | 'USD';
}

export default function StatsTimeSeriesChart({ daily, monthly, currency }: Props) {
  const [granularity, setGranularity] = useState<'daily' | 'monthly'>('daily');
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');
  const [hoveredPoint, setHoveredPoint] = useState<TimeSeriesPoint | null>(null);

  const series = granularity === 'daily' ? daily : monthly;
  const maxVal = Math.max(...series.map((p) => (metric === 'revenue' ? p.grossRevenue : p.completedOrders)), 1);

  const formatVal = (val: number) => {
    if (metric === 'orders') return `${val} הזמנות`;
    const num = currency === 'USD' ? val / 3.7 : val;
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="p-6 md:p-8 rounded-[36px] bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6 select-none" dir="rtl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <BarChart2 size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">מגמות הכנסות והזמנות לאורך זמן</h3>
            <p className="text-xs text-slate-400">ניתוח רציף של היקף הפעילות וההכנסות</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Selector */}
          <div className="flex p-1 bg-black/50 border border-white/5 rounded-xl">
            <button
              onClick={() => setMetric('revenue')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5',
                metric === 'revenue' ? 'bg-primary text-black' : 'text-slate-400 hover:text-white'
              )}
            >
              <DollarSign size={14} />
              הכנסות
            </button>
            <button
              onClick={() => setMetric('orders')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5',
                metric === 'orders' ? 'bg-[#00F0FF] text-black' : 'text-slate-400 hover:text-white'
              )}
            >
              <Layers size={14} />
              הזמנות
            </button>
          </div>

          {/* Granularity Selector */}
          <div className="flex p-1 bg-black/50 border border-white/5 rounded-xl">
            <button
              onClick={() => setGranularity('daily')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5',
                granularity === 'daily' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              <Calendar size={14} />
              יומי
            </button>
            <button
              onClick={() => setGranularity('monthly')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5',
                granularity === 'monthly' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              חודשי
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-64 w-full flex items-end gap-1.5 md:gap-3 pt-8 pb-4 px-2 border-b border-white/10 overflow-x-auto">
        {series.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-bold">
            אין נתונים בטווח הנבחר
          </div>
        ) : (
          series.map((point) => {
            const currentVal = metric === 'revenue' ? point.grossRevenue : point.completedOrders;
            const heightPercent = Math.max(8, (currentVal / maxVal) * 100);
            const isHovered = hoveredPoint?.period === point.period;

            return (
              <div
                key={point.period}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="flex-1 min-w-[20px] max-w-[48px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
              >
                {/* Bar */}
                <motion.div
                  initial={false}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn(
                    'w-full rounded-t-xl transition-colors transition-shadow duration-150 relative',
                    metric === 'revenue'
                      ? isHovered
                        ? 'bg-primary shadow-[0_0_20px_rgba(255,184,0,0.8)]'
                        : 'bg-gradient-to-t from-primary/30 to-primary/80 group-hover:to-primary'
                      : isHovered
                      ? 'bg-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.8)]'
                      : 'bg-gradient-to-t from-cyan-500/30 to-cyan-400 group-hover:to-cyan-300'
                  )}
                />

                {/* X-Axis Label */}
                <span className="text-[10px] text-slate-500 font-mono mt-2 truncate w-full text-center group-hover:text-white transition-colors">
                  {point.displayDate}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Stable Fixed-Height Hover Details Bar (prevents layout shift / jitter) */}
      <div className="min-h-[56px] rounded-2xl bg-black/40 border border-white/5 p-4 flex items-center justify-between transition-colors">
        {hoveredPoint ? (
          <div className="flex flex-wrap items-center justify-between w-full gap-4 text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              תאריך: <strong className="text-slate-200">{hoveredPoint.period}</strong>
            </span>
            <div className="flex items-center gap-6">
              <span className="text-slate-300">הזמנות: <strong className="text-white">{hoveredPoint.completedOrders}</strong></span>
              <span className="text-slate-300">הכנסה ברוטו: <strong className="text-primary">{formatVal(hoveredPoint.grossRevenue)}</strong></span>
              <span className="text-slate-300">הכנסה נטו (18% מע״מ): <strong className="text-emerald-400">{formatVal(hoveredPoint.netRevenue)}</strong></span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full gap-2 text-xs text-slate-500 font-medium">
            <Info size={14} className="text-slate-600" />
            <span>העבר עכבר על עמודות הגרף לצפייה בפירוט מדויק לפי תאריך</span>
          </div>
        )}
      </div>
    </div>
  );
}
