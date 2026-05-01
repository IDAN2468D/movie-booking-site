'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Film, 
  CreditCard,
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import StatsCard from '@/components/erp/StatsCard';
import { useERPStore } from '@/lib/store/useERPStore';

import { useRouter } from 'next/navigation';

export default function ERPDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { updateStats } = useERPStore();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/erp/stats');
        const stats = await res.json();
        setData(stats);
        updateStats(stats);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">סקירה ניהולית</h1>
          <p className="text-slate-400 font-medium">ברוך הבא למרכז הבקרה של Liquid Cinema.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            עדכון אחרון: לפני דקה
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="סה״כ הכנסות" 
          value={data?.totalRevenue || 0} 
          icon={CreditCard} 
          color="primary"
          trend={{ value: 12, isUp: true }}
        />
        <StatsCard 
          label="כרטיסים שנמכרו" 
          value={data?.ticketsSold || 0} 
          icon={Users} 
          color="cyan"
          trend={{ value: 8, isUp: true }}
        />
        <StatsCard 
          label="סרטים פעילים" 
          value={data?.activeMovies || 0} 
          icon={Film} 
          color="purple"
        />
        <StatsCard 
          label="אחוז תפוסה" 
          value={`${data?.occupancyRate || 0}%`} 
          icon={TrendingUp} 
          color="gold"
          trend={{ value: 3, isUp: false }}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[40px] p-8 backdrop-blur-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-white">פעילות אחרונה</h2>
            <button 
              onClick={() => router.push('/erp/bookings')}
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
            >
              צפה בהכל
            </button>
          </div>

          <div className="space-y-4">
            {data?.recentBookings?.map((booking: any) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {booking.movie[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{booking.movie}</h4>
                    <p className="text-xs text-slate-500">{booking.user}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-black text-white text-sm">₪{booking.total}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{new Date(booking.time).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-[40px] p-8">
            <h3 className="text-lg font-black text-white mb-6">פעולות מהירות</h3>
            <div className="space-y-3">
              {[
                { label: 'הוסף סרט חדש', icon: Film },
                { label: 'ייצא דוח חודשי', icon: ArrowUpRight },
                { label: 'ניהול אולמות', icon: ExternalLink },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <span className="font-bold text-sm text-slate-200">{action.label}</span>
                  <action.icon size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">סטטוס מערכת</h3>
            <div className="flex items-center gap-3 text-xs font-bold text-green-400 bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              כל המערכות פועלות כשורה
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
