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
    <div className="pt-12 pb-24 px-6 md:px-12 w-full max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-10 text-right" dir="rtl">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2 font-display uppercase">Liquid <span className="text-primary text-glow">ERP</span></h1>
          <p className="text-slate-400 font-medium text-lg">ניהול מתקדם ומערכות ליבה (מצב ניהול)</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 backdrop-blur-md">
            <Clock size={14} className="text-primary" />
            מערכת מסונכרנת
          </div>
        </div>
      </div>
      
      <ErpDashboard />
    </div>
  );
}
