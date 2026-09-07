'use client';

import React, { useEffect, useState } from 'react';
import { useERPStore } from '@/lib/store/useERPStore';
import ErpDashboard from '@/components/admin/ErpDashboard';
import { Clock } from 'lucide-react';

export default function ERPPage() {
  const [loading, setLoading] = useState(true);
  const { updateStats } = useERPStore();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/erp/stats');
        if (res.ok) {
          const stats = await res.json();
          updateStats(stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [updateStats]);

  if (loading) return null;

  return (
    <div className="pt-8 pb-24 px-4 sm:px-8 md:px-12 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8 text-right" dir="rtl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-mono font-black px-2.5 py-0.5 rounded-full bg-[#8A5CFF]/20 text-purple-300 border border-[#8A5CFF]/40">
              QUANTUM COCKPIT 5.0
            </span>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              LIVE TELEMETRY
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter font-['Outfit'] uppercase">
            LIQUID <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">ERP COCKPIT</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base mt-1">ניהול קופות חכם, אופטימיזציית תפוסה ופיקוד AI מרכזי</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-300 flex items-center gap-2 backdrop-blur-md">
            <Clock size={14} className="text-amber-400 animate-pulse" />
            <span>סנכרון ליבה 100%</span>
          </div>
        </div>
      </div>
      
      <ErpDashboard />
    </div>
  );
}
