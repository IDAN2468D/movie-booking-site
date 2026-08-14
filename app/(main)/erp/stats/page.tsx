'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Database, UploadCloud, RotateCcw, Calendar } from 'lucide-react';
import StatsSummaryCards from '@/components/erp/stats/StatsSummaryCards';
import StatsTimeSeriesChart from '@/components/erp/stats/StatsTimeSeriesChart';
import StatsTopMoviesTable from '@/components/erp/stats/StatsTopMoviesTable';
import StatsAnomaliesRadar from '@/components/erp/stats/StatsAnomaliesRadar';
import StatsRetentionCard from '@/components/erp/stats/StatsRetentionCard';
import StatsAiInsightsCard from '@/components/erp/stats/StatsAiInsightsCard';
import StatsExportMenu from '@/components/erp/stats/StatsExportMenu';
import StatsDataImportModal from '@/components/erp/stats/StatsDataImportModal';
import { AiSiteInsight, ComputedSiteStats } from '@/lib/erp/stats/types';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { cn } from '@/lib/utils';

export default function MovieSiteStatsPage() {
  const [stats, setStats] = useState<ComputedSiteStats | null>(null);
  const [insight, setInsight] = useState<AiSiteInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [currency, setCurrency] = useState<'ILS' | 'USD'>('ILS');
  const [sourceName, setSourceName] = useState<string>('MongoDB Live DB');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'all' | '7d' | '30d' | 'month'>('all');

  const fetchLiveStats = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/erp/stats/advanced';
      const now = new Date();
      if (timeRange === '7d') {
        const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        url += `?startDate=${past.toISOString().split('T')[0]}&endDate=${now.toISOString().split('T')[0]}`;
      } else if (timeRange === '30d') {
        const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        url += `?startDate=${past.toISOString().split('T')[0]}&endDate=${now.toISOString().split('T')[0]}`;
      } else if (timeRange === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        url += `?startDate=${startOfMonth.toISOString().split('T')[0]}&endDate=${now.toISOString().split('T')[0]}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data: ComputedSiteStats = await res.json();
        setStats(data);
        setSourceName('MongoDB Live DB');
        fetchAiInsight(data);
      }
    } catch (e) {
      console.error('Failed to fetch stats', e);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const fetchAiInsight = async (computedStats: ComputedSiteStats) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/erp/stats/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(computedStats),
      });
      if (res.ok) {
        const aiData = await res.json();
        setInsight(aiData);
      }
    } catch (e) {
      console.error('Failed to fetch AI insights', e);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, [fetchLiveStats]);

  const handleImportSuccess = (importedStats: ComputedSiteStats, name: string) => {
    setStats(importedStats);
    setSourceName(`קובץ/טבלה: ${name}`);
    fetchAiInsight(importedStats);
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <LoadingIndicator variant="orbit" size="lg" label="מחשב סטטיסטיקות אתר..." />
        <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Aggregating CinePulse Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 pb-20" dir="rtl">
      {/* Header & Global Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[40px] border border-white/5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <BarChart3 size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Analytics Engine 4.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            ניתוח ביצועים וסטטיסטיקות <span className="text-primary text-glow">ERP</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            מקור נתונים נוכחי: <strong className="text-white">{sourceName}</strong> | טווח: {stats?.dateRange.startDate} עד {stats?.dateRange.endDate}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter */}
          <div className="flex p-1 bg-black/50 border border-white/5 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: 'כל הזמנים' },
              { id: '30d', label: '30 יום' },
              { id: '7d', label: '7 ימים' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as typeof timeRange)}
                className={cn('px-3 py-1.5 rounded-lg transition-all', timeRange === t.id ? 'bg-primary text-black' : 'text-slate-400 hover:text-white')}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Import Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-primary/40 rounded-xl text-xs font-bold text-white transition-all"
          >
            <UploadCloud size={16} className="text-primary" />
            ייבוא CSV / טבלה
          </button>

          {stats && <StatsExportMenu stats={stats} />}
        </div>
      </div>

      {stats && (
        <div className="space-y-8">
          <StatsSummaryCards stats={stats} currency={currency} />
          <StatsAiInsightsCard stats={stats} insight={insight} onRefresh={() => fetchAiInsight(stats)} loading={aiLoading} />
          <StatsTimeSeriesChart daily={stats.timeSeriesDaily} monthly={stats.timeSeriesMonthly} currency={currency} />
          <StatsTopMoviesTable topByOrders={stats.topMoviesByOrders} topByRevenue={stats.topMoviesByRevenue} currency={currency} />
          <StatsRetentionCard retention={stats.retention} />
          <StatsAnomaliesRadar anomalies={stats.anomalies} />
        </div>
      )}

      <StatsDataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
