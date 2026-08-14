'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Repeat, ArrowUpRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { RetentionMetrics } from '@/lib/erp/stats/types';
import { cn } from '@/lib/utils';

interface Props {
  retention: RetentionMetrics;
}

export default function StatsRetentionCard({ retention }: Props) {
  const returningShare = retention.returningCustomerRate;
  const singleShare = Math.max(0, Math.round((100 - returningShare) * 10) / 10);

  const items = [
    {
      label: 'סה״כ לקוחות ייחודיים',
      value: retention.totalUniqueCustomers.toLocaleString(),
      subtext: 'משתמשים פעילים במערכת',
      icon: Users,
      color: 'text-primary border-primary/30 bg-primary/10',
    },
    {
      label: 'לקוחות חוזרים (מרובי הזמנות)',
      value: retention.customersWithMultipleOrders.toLocaleString(),
      subtext: `${returningShare}% מכלל הקהל`,
      icon: UserCheck,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      label: 'לקוחות בהזמנה בודדת',
      value: retention.singleOrderCustomers.toLocaleString(),
      subtext: `${singleShare}% פוטנציאל להחזרה`,
      icon: Users,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      label: 'תדירות ממוצעת ללקוח',
      value: `${retention.averageOrdersPerCustomer}`,
      subtext: 'הזמנות ממוצעות לרוכש',
      icon: Repeat,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
  ];

  return (
    <div className="w-full p-6 md:p-8 rounded-[36px] bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-xl space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <HeartHandshake size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">שימור ונאמנות לקוחות (Retention & LTV)</h3>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Cohorts
              </span>
            </div>
            <p className="text-xs text-slate-400">ניתוח דפוסי רכישה חוזרת, נאמנות קהל ותדירות הזמנות</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-300 font-black text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <ShieldCheck size={16} />
            <span>{retention.returningCustomerRate}% שיעור שימור כללי</span>
          </div>
        </div>
      </div>

      {/* Full-Width Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 flex flex-col justify-between hover:border-white/15 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{item.label}</span>
                <div className={cn('p-2 rounded-xl border', item.color)}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white font-display tracking-tight mb-1">{item.value}</p>
                <p className="text-[11px] text-slate-500 font-medium">{item.subtext}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full-Width Visual Cohort Bar */}
      <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            לקוחות חוזרים ({returningShare}%) - {retention.customersWithMultipleOrders} משתמשים
          </span>
          <span className="text-cyan-400 flex items-center gap-2">
            לקוחות בהזמנה ראשונה ({singleShare}%) - {retention.singleOrderCustomers} משתמשים
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </span>
        </div>

        <div className="w-full h-3.5 bg-white/5 rounded-full overflow-hidden flex p-0.5 border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${returningShare}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${singleShare}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-70"
          />
        </div>
      </div>
    </div>
  );
}
