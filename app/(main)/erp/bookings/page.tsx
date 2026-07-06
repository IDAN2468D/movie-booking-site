'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Download,
  RotateCcw,
  Film
} from 'lucide-react';
import { cn } from '@/lib/utils/index';
import NextImage from 'next/image';
import { getImageUrl } from '@/lib/tmdb';

interface BookingData {
  _id: string;
  userEmail: string;
  createdAt: string | Date;
  showtime: string;
  total: number;
  status: string;
  movie?: {
    id?: string | number;
    title?: string;
    displayTitle?: string;
    poster_path?: string;
    posterPath?: string;
  };
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc'>('dateDesc');

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/erp/bookings');
      const data = await res.json();
      setBookings(data);
    } catch {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchBookings();
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/erp/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchBookings();
    } catch {
      console.error("Update failed");
    }
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ['מזהה', 'סרט', 'לקוח', 'תאריך', 'שעה', 'סכום', 'סטטוס'];
    const rows = bookings.map(b => [
      b._id,
      b.movie?.title || b.movie?.displayTitle || '',
      b.userEmail,
      new Date(b.createdAt).toLocaleDateString('he-IL'),
      b.showtime,
      b.total.toString(),
      b.status === 'confirmed' ? 'מאושר' : b.status === 'validated' ? 'מומש' : 'בוטל'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings
    .filter(b => 
      (b.movie?.title?.toLowerCase().includes(search.toLowerCase()) ||
       b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
       b._id?.includes(search)) &&
      (filterStatus === 'all' || b.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === 'dateDesc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'dateAsc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'amountDesc') return b.total - a.total;
      if (sortBy === 'amountAsc') return a.total - b.total;
      return 0;
    });

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-10" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-l from-slate-900/50 to-transparent p-8 rounded-[40px] border border-white/5 backdrop-blur-md">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3 uppercase font-display">ניהול <span className="text-primary text-glow">הזמנות</span></h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">ניהול כרטיסים, מעקב רכישות ושליטה על תזרים ההזמנות במערכת.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 rounded-2xl text-primary font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,159,10,0.15)] group"
        >
          <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
          ייצוא דוח CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 bg-black/40 p-4 rounded-[32px] border border-white/10 backdrop-blur-xl">
          <div className="flex-1 relative group">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text"
              placeholder="חפש לפי שם סרט, מייל לקוח או מזהה הזמנה..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 bg-white/[0.03] border border-transparent rounded-2xl pr-14 pl-6 text-white text-lg outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-8 h-16 border rounded-2xl font-bold flex items-center justify-center gap-3 transition-all tracking-wide",
              showFilters 
                ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(255,159,10,0.2)]" 
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Filter size={20} />
            סינון מתקדם
          </button>
        </div>

        {/* Advanced Filters Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-black/60 border border-white/10 rounded-[32px] p-6 backdrop-blur-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Filter */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">סנן לפי סטטוס</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'הכל' },
                      { id: 'confirmed', label: 'מאושרים' },
                      { id: 'validated', label: 'מומשו' },
                      { id: 'cancelled', label: 'מבוטלים' }
                    ].map(status => (
                      <button
                        key={status.id}
                        onClick={() => setFilterStatus(status.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                          filterStatus === status.id 
                            ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(255,159,10,0.4)]" 
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Order */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">מיין לפי</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'dateDesc', label: 'תאריך: חדש לישן' },
                      { id: 'dateAsc', label: 'תאריך: ישן לחדש' },
                      { id: 'amountDesc', label: 'סכום: מהגבוה לנמוך' },
                      { id: 'amountAsc', label: 'סכום: מהנמוך לגבוה' }
                    ].map(sort => (
                      <button
                        key={sort.id}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => setSortBy(sort.id as any)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                          sortBy === sort.id 
                            ? "bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.4)]" 
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                        )}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-gradient-to-b from-slate-900/60 to-black/60 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/40">
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">מזהה</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">סרט</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">לקוח</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">מועד</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">סכום</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">סטטוס</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-left">פעולות</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking, i) => {
                const poster = booking.movie?.posterPath || booking.movie?.poster_path;
                return (
                  <motion.tr 
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group"
                  >
                    <td className="px-8 py-6 font-mono text-xs text-slate-500">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(booking._id);
                          alert('מזהה הועתק בהצלחה!');
                        }}
                        className="hover:text-primary transition-colors cursor-pointer bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner"
                      >
                        #{booking._id.slice(-6)}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-xl bg-slate-800 flex-shrink-0 relative overflow-hidden border border-white/10 shadow-lg">
                          {poster ? (
                            <NextImage 
                              src={getImageUrl(poster, 'w500')} 
                              alt={booking.movie?.title || 'Movie'} 
                              fill 
                              className="object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film size={16} className="text-slate-600" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-white text-base max-w-[200px] truncate">{booking.movie?.title || booking.movie?.displayTitle}</span>
                      </div>
                    </td>
                  <td className="px-8 py-6">
                    <p className="text-base text-slate-300 font-medium">{booking.userEmail}</p>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <p className="text-white font-bold mb-0.5">{new Date(booking.createdAt).toLocaleDateString('he-IL')}</p>
                    <div className="inline-flex items-center px-2 py-0.5 bg-white/5 rounded-md text-[11px] text-slate-400 font-black">
                      {booking.showtime}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-display font-black text-white text-xl">₪{booking.total}</td>
                  <td className="px-8 py-6">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-8 py-6">
                    <ActionButtons booking={booking} updateStatus={updateStatus} />
                  </td>
                </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking, i) => {
            const poster = booking.movie?.posterPath || booking.movie?.poster_path;
            return (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-slate-900/60 to-black/60 border border-white/10 rounded-[40px] p-8 space-y-6 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-5 flex-1 min-w-0">
                  <div className="w-20 h-28 rounded-2xl bg-slate-800 border border-white/10 flex-shrink-0 relative overflow-hidden shadow-xl">
                    {poster ? (
                      <NextImage 
                        src={getImageUrl(poster, 'w500')} 
                        alt={booking.movie?.title || 'Movie'} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film size={24} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-white text-lg leading-tight mb-2 truncate">{booking.movie?.title || booking.movie?.displayTitle}</h3>
                    <div className="inline-block px-3 py-1 bg-black/40 border border-white/5 rounded-lg mb-2">
                      <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">#{booking._id.slice(-6)}</p>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 pt-1">
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              <div className="bg-black/30 rounded-3xl p-5 border border-white/5">
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">לקוח</p>
                    <p className="text-sm text-white font-bold truncate">{booking.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">סכום</p>
                    <p className="text-base text-primary font-black font-display">₪{booking.total}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">תאריך ושעה</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-bold">{new Date(booking.createdAt).toLocaleDateString('he-IL')}</p>
                      <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{booking.showtime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <ActionButtons booking={booking} updateStatus={updateStatus} isMobile />
              </div>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
      
      {filteredBookings.length === 0 && !loading && (
        <div className="py-20 text-center">
          <XCircle size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 font-bold">לא נמצאו הזמנות התואמות את החיפוש</p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-inner",
      status === 'confirmed' ? "bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]" :
      status === 'validated' ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]" :
      "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
    )}>
      {status === 'confirmed' && <Clock size={14} className="animate-pulse" />}
      {status === 'validated' && <CheckCircle2 size={14} />}
      {status === 'cancelled' && <XCircle size={14} />}
      {status === 'confirmed' ? 'מאושר' : status === 'validated' ? 'מומש' : 'בוטל'}
    </div>
  );
}

function ActionButtons({ booking, updateStatus, isMobile }: { booking: BookingData, updateStatus: (id: string, status: string) => Promise<void>, isMobile?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2",
      !isMobile && "opacity-0 group-hover:opacity-100 transition-opacity justify-end w-full"
    )}>
      {booking.status === 'confirmed' && (
        <button 
          onClick={() => updateStatus(booking._id, 'validated')}
          className={cn(
            "p-2 rounded-lg transition-all",
            isMobile ? "flex-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 py-3 font-bold text-xs" : "hover:bg-cyan-500/20 text-cyan-400"
          )}
        >
          {isMobile ? 'סמן כמימוש' : <CheckCircle2 size={18} />}
        </button>
      )}
      {booking.status === 'validated' && (
        <button 
          onClick={() => updateStatus(booking._id, 'confirmed')}
          className={cn(
            "p-2 rounded-lg transition-all",
            isMobile ? "flex-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 py-3 font-bold text-xs" : "hover:bg-amber-500/20 text-amber-400"
          )}
        >
          {isMobile ? 'אפס אימות' : <RotateCcw size={18} />}
        </button>
      )}
      <button 
        onClick={() => updateStatus(booking._id, 'cancelled')}
        className={cn(
          "p-2 rounded-lg transition-all",
          isMobile ? "flex-1 bg-red-500/10 text-red-400 border border-red-500/20 py-3 font-bold text-xs" : "hover:bg-red-500/20 text-red-400"
        )}
      >
        {isMobile ? 'בטל הזמנה' : <XCircle size={18} />}
      </button>
    </div>
  );
}
