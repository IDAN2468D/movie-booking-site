'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowUpDown,
  Download,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils/index';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/erp/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/erp/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchBookings();
    } catch (error) {
      console.error("Update failed");
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.movie?.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    b._id?.includes(search)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">ניהול הזמנות</h1>
          <p className="text-slate-400 text-sm md:text-base">נהל את כל הכרטיסים וההזמנות במקום אחד.</p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all">
          <Download size={18} />
          ייצוא CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="חפש לפי סרט, מייל או מזהה הזמנה..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all text-sm md:text-base"
          />
        </div>
        <button className="px-6 h-14 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-all">
          <Filter size={20} />
          סינון מתקדם
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-md">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">מזהה</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">סרט</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">לקוח</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">תאריך</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">סכום</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">סטטוס</th>
              <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest text-left">פעולות</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking, i) => (
                <motion.tr 
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group"
                >
                  <td className="px-8 py-6 font-mono text-[10px] text-slate-500">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(booking._id);
                        alert('ID הועתק!');
                      }}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      #{booking._id.slice(-6)}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 rounded bg-primary/20 flex-shrink-0" />
                      <span className="font-bold text-white text-sm">{booking.movie?.title || booking.movie?.displayTitle}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-300 font-medium">{booking.userEmail}</p>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <p className="text-white font-bold">{new Date(booking.createdAt).toLocaleDateString('he-IL')}</p>
                    <p className="text-[10px] text-slate-500">{booking.showtime}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-white text-sm">₪{booking.total}</td>
                  <td className="px-8 py-6">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-8 py-6">
                    <ActionButtons booking={booking} updateStatus={updateStatus} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-16 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white leading-tight mb-1">{booking.movie?.title || booking.movie?.displayTitle}</h3>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">#{booking._id.slice(-6)}</p>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">לקוח</p>
                  <p className="text-xs text-white font-bold truncate">{booking.userEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">סכום</p>
                  <p className="text-xs text-primary font-black">₪{booking.total}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">תאריך</p>
                  <p className="text-xs text-white font-bold">{new Date(booking.createdAt).toLocaleDateString('he-IL')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">שעה</p>
                  <p className="text-xs text-slate-400">{booking.showtime}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <ActionButtons booking={booking} updateStatus={updateStatus} isMobile />
              </div>
            </motion.div>
          ))}
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
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
      status === 'confirmed' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
      status === 'validated' ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
      "bg-slate-500/10 text-slate-400 border border-slate-500/20"
    )}>
      {status === 'confirmed' && <Clock size={12} />}
      {status === 'validated' && <CheckCircle2 size={12} />}
      {status === 'confirmed' ? 'מאושר' : status === 'validated' ? 'מומש' : 'בוטל'}
    </div>
  );
}

function ActionButtons({ booking, updateStatus, isMobile }: { booking: any, updateStatus: any, isMobile?: boolean }) {
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
