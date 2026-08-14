'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, TrendingUp, AlertCircle, Calendar, Radar } from 'lucide-react';
import { StatsAnomaly } from '@/lib/erp/stats/types';
import { cn } from '@/lib/utils';

interface Props {
  anomalies: StatsAnomaly[];
}

export default function StatsAnomaliesRadar({ anomalies }: Props) {
  const getBadgeStyle = (severity: StatsAnomaly['severity']) => {
    switch (severity) {
      case 'alert':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'warning':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  const getIcon = (type: StatsAnomaly['type']) => {
    switch (type) {
      case 'spike':
        return <TrendingUp size={20} className="text-amber-400" />;
      case 'cancellation_spike':
        return <AlertTriangle size={20} className="text-rose-400" />;
      case 'holiday':
        return <Calendar size={20} className="text-cyan-400" />;
      default:
        return <AlertCircle size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="w-full p-6 md:p-8 rounded-[36px] bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Radar size={22} className="animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">מכ״ם אנומליות ודפוסים עונתיים</h3>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Live Anomaly Shield
              </span>
            </div>
            <p className="text-xs text-slate-400">זיהוי אוטומטי של תנודות חריגות, קפיצות מכירה והשפעת מועדי ישראל</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>סריקה אלגוריתמית רציפה</span>
        </div>
      </div>

      {/* Content Grid */}
      {!anomalies || anomalies.length === 0 ? (
        <div className="p-10 rounded-2xl bg-black/40 border border-white/5 text-center space-y-2">
          <Sparkles size={32} className="mx-auto text-primary/60" />
          <p className="text-sm font-bold text-white">פעילות סדירה ויציבה בטווח הנבחר</p>
          <p className="text-xs text-slate-500">לא זוהו אנומליות, קפיצות חריגות או כשלים בתקופה זו</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {anomalies.map((anom, idx) => (
            <motion.div
              key={anom.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {getIcon(anom.type)}
                </div>
                <span className={cn('text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border shrink-0', getBadgeStyle(anom.severity))}>
                  {anom.type}
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                <h4 className="font-bold text-white text-base leading-snug">{anom.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{anom.description}</p>
              </div>

              {anom.date && (
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>תאריך זיהוי:</span>
                  <strong className="text-slate-400">{anom.date}</strong>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
