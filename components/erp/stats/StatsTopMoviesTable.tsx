'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Award, TrendingUp, ShoppingBag } from 'lucide-react';
import { MoviePerformance } from '@/lib/erp/stats/types';
import { cn } from '@/lib/utils';

interface Props {
  topByOrders: MoviePerformance[];
  topByRevenue: MoviePerformance[];
  currency: 'ILS' | 'USD';
}

export default function StatsTopMoviesTable({ topByOrders, topByRevenue, currency }: Props) {
  const [tab, setTab] = useState<'revenue' | 'orders'>('revenue');

  const list = tab === 'revenue' ? topByRevenue : topByOrders;

  const formatMoney = (amount: number) => {
    const val = currency === 'USD' ? amount / 3.7 : amount;
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 md:p-8 rounded-[36px] bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6" dir="rtl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Film size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">דירוג שוברי הקופות (Top 10)</h3>
            <p className="text-xs text-slate-400">פילוח ביצועי סרטים לפי הכנסות וכמות כרטיסים</p>
          </div>
        </div>

        <div className="flex p-1 bg-black/50 border border-white/5 rounded-xl">
          <button
            onClick={() => setTab('revenue')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2',
              tab === 'revenue' ? 'bg-primary text-black shadow-md' : 'text-slate-400 hover:text-white'
            )}
          >
            <TrendingUp size={14} />
            לפי הכנסות (₪)
          </button>
          <button
            onClick={() => setTab('orders')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2',
              tab === 'orders' ? 'bg-[#00F0FF] text-black shadow-md' : 'text-slate-400 hover:text-white'
            )}
          >
            <ShoppingBag size={14} />
            לפי כמות הזמנות
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-black uppercase text-slate-400 tracking-wider">
              <th className="pb-3 pr-2">#</th>
              <th className="pb-3">שם הסרט</th>
              <th className="pb-3 text-center">הזמנות</th>
              <th className="pb-3 text-center">הכנסה ברוטו</th>
              <th className="pb-3 text-center">הכנסה נטו (מע״מ 18%)</th>
              <th className="pb-3 pl-2 text-left">נתח מסך הכל</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                    אין נתוני סרטים זמינים
                  </td>
                </tr>
              ) : (
                list.map((movie, idx) => {
                  const share = tab === 'revenue' ? movie.percentageOfRevenue : movie.percentageOfOrders;
                  return (
                    <motion.tr
                      key={movie.movieTitle}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-4 pr-2 font-mono text-xs text-slate-500 font-black">
                        {idx === 0 ? (
                          <Award size={18} className="text-amber-400" />
                        ) : (
                          `#${idx + 1}`
                        )}
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-white text-sm block">{movie.movieTitle}</span>
                      </td>
                      <td className="py-4 text-center font-bold text-slate-300 text-sm">
                        {movie.orderCount.toLocaleString()}
                      </td>
                      <td className="py-4 text-center font-black text-primary text-sm font-display">
                        {formatMoney(movie.grossRevenue)}
                      </td>
                      <td className="py-4 text-center font-medium text-emerald-400 text-xs font-mono">
                        {formatMoney(movie.netRevenue)}
                      </td>
                      <td className="py-4 pl-2 text-left">
                        <div className="flex items-center justify-end gap-3 min-w-[120px]">
                          <span className="text-xs font-black text-slate-300">{share}%</span>
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                tab === 'revenue' ? 'bg-primary' : 'bg-[#00F0FF]'
                              )}
                              style={{ width: `${Math.min(100, share)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
