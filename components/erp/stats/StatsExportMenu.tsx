'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Check, ChevronDown } from 'lucide-react';
import { ComputedSiteStats } from '@/lib/erp/stats/types';
import {
  generateHebrewMarkdownReport,
  generateEnglishMarkdownReport,
} from '@/lib/erp/stats/markdownReportGenerator';

interface Props {
  stats: ComputedSiteStats;
}

export default function StatsExportMenu({ stats }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHebrewMd = () => {
    const md = generateHebrewMarkdownReport(stats);
    downloadFile(md, `cinepulse_stats_report_${stats.dateRange.startDate}_${stats.dateRange.endDate}.md`, 'text/markdown;charset=utf-8');
    setOpen(false);
  };

  const handleExportEnglishMd = () => {
    const md = generateEnglishMarkdownReport(stats);
    downloadFile(md, `cinepulse_stats_en_${stats.dateRange.startDate}_${stats.dateRange.endDate}.md`, 'text/markdown;charset=utf-8');
    setOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['סרט', 'הזמנות', 'הכנסה ברוטו (₪)', 'הכנסה נטו (₪)', 'נתח הכנסה (%)'];
    const rows = stats.topMoviesByRevenue.map((m) => [
      `"${m.movieTitle.replace(/"/g, '""')}"`,
      m.orderCount,
      m.grossRevenue,
      m.netRevenue,
      `${m.percentageOfRevenue}%`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csvContent, `cinepulse_top_movies_${stats.dateRange.startDate}.csv`, 'text/csv;charset=utf-8');
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-right" dir="rtl">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-3 bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 rounded-2xl text-primary font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,184,0,0.15)]"
      >
        <Download size={16} />
        <span>ייצוא דוחות וקובצי נתונים</span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-black/90 border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl space-y-1">
          <button
            onClick={handleExportHebrewMd}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-white font-bold transition-all text-right"
          >
            <FileText size={16} className="text-primary shrink-0" />
            <span>דוח Markdown תקני (עברית)</span>
          </button>

          <button
            onClick={handleExportEnglishMd}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-white font-bold transition-all text-right"
          >
            <FileText size={16} className="text-cyan-400 shrink-0" />
            <span>דוח Markdown (English)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-white font-bold transition-all text-right border-t border-white/5 mt-1 pt-2"
          >
            <FileSpreadsheet size={16} className="text-emerald-400 shrink-0" />
            <span>ייצוא טבלת שוברי קופות (CSV)</span>
          </button>
        </div>
      )}
    </div>
  );
}
