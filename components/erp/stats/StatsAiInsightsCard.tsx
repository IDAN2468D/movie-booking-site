'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, RefreshCw, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { AiSiteInsight, ComputedSiteStats } from '@/lib/erp/stats/types';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface Props {
  stats: ComputedSiteStats;
  insight: AiSiteInsight | null;
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export default function StatsAiInsightsCard({ stats, insight, onRefresh, loading }: Props) {
  const [activeTab, setActiveTab] = useState<'summary' | 'actions'>('summary');

  return (
    <div className="p-6 md:p-8 rounded-[36px] bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-black/80 border border-primary/20 backdrop-blur-2xl shadow-2xl space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary">
            <Bot size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">Gemini 3.5 AI Executive Advisor</h3>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                Live AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">ניתוח אסטרטגי ותובנות מנהלים בזמן-אמת</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-primary/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-primary' : ''} />
          {loading ? 'מייצר תובנות...' : 'רענן תובנות AI'}
        </button>
      </div>

      {loading && !insight ? (
        <div className="py-12 text-center space-y-3">
          <LoadingIndicator variant="orbit" size="md" label="מעבד נתונים ב-Gemini..." />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Generating Strategic Intelligence...</p>
        </div>
      ) : insight ? (
        <div className="space-y-6">
          {/* Headline & Summary */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-black text-primary text-base flex items-center gap-2">
              <Sparkles size={16} />
              {insight.headline}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{insight.executiveSummary}</p>
          </div>

          {/* Strengths & Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
              <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                נקודות חוזק מרכזיות
              </h5>
              <ul className="space-y-2">
                {insight.keyStrengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Immediate Actions */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
              <h5 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Lightbulb size={14} />
                המלצות מיידיות לפעולה
              </h5>
              <ul className="space-y-2">
                {insight.immediateActions.map((a, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
