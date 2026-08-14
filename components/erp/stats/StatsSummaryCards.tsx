'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Receipt, Users, AlertOctagon, Scale } from 'lucide-react';
import { ComputedSiteStats } from '@/lib/erp/stats/types';
import { cn } from '@/lib/utils';

interface Props {
  stats: ComputedSiteStats;
  currency: 'ILS' | 'USD';
}

export default function StatsSummaryCards({ stats, currency }: Props) {
  const formatMoney = (amount: number) => {
    const val = currency === 'USD' ? amount / 3.7 : amount;
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: 'סה״כ הזמנות מוצלחות',
      value: stats.totalCompletedOrders.toLocaleString(),
      subtext: `מתוך ${stats.totalTransactions.toLocaleString()} עסקאות`,
      icon: ShoppingBag,
      color: 'from-amber-500/20 to-amber-500/5 text-primary border-primary/20',
      badge: 'Completed',
    },
    {
      title: 'הכנסה ברוטו (כולל מע״מ)',
      value: formatMoney(stats.totalGrossRevenue),
      subtext: `כולל 18% מע״מ ישראלי`,
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
      badge: 'Gross',
    },
    {
      title: 'הכנסה נטו (לפני מע״מ)',
      value: formatMoney(stats.totalNetRevenue),
      subtext: `לפי שווי בסיסי ללא מע״מ`,
      icon: Scale,
      color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
      badge: 'Net (Excl. VAT)',
    },
    {
      title: 'ממוצע הזמנה (AOV)',
      value: formatMoney(stats.averageOrderValue),
      subtext: 'הכנסה ממוצעת לעסקה',
      icon: Receipt,
      color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20',
      badge: 'AOV',
    },
    {
      title: 'שיעור לקוחות חוזרים',
      value: `${stats.retention.returningCustomerRate}%`,
      subtext: `${stats.retention.customersWithMultipleOrders} מתוך ${stats.retention.totalUniqueCustomers} לקוחות`,
      icon: Users,
      color: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20',
      badge: 'Retention',
    },
    {
      title: 'שיעור ביטולים (Churn)',
      value: `${stats.cancellationRate}%`,
      subtext: `${stats.totalCancelledOrders} הזמנות שבוטלו`,
      icon: AlertOctagon,
      color: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20',
      badge: 'Cancellation',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" dir="rtl">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={cn(
              'relative p-6 rounded-[28px] border bg-gradient-to-br backdrop-blur-xl shadow-lg flex flex-col justify-between overflow-hidden',
              card.color
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <Icon size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                {card.badge}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-3xl font-black text-white font-display tracking-tight mb-1">{card.value}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{card.subtext}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
