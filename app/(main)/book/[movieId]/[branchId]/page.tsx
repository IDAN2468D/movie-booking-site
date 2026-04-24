'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Ticket, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/store';
import { CINEMA_BRANCHES } from '@/lib/constants';
import ShowtimeSelector from '@/components/booking/ShowtimeSelector';
import SeatMap from '@/components/booking/SeatMap';
import Image from 'next/image';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedMovie, selectedSeats, selectedShowtime, selectedDate, setSelectedBranchId } = useBookingStore();
  
  const branch = CINEMA_BRANCHES.find(b => b.id === params.branchId);
  
  // Sync branchId to store if missing
  useEffect(() => {
    if (params.branchId) {
      setSelectedBranchId(params.branchId as string);
    }
  }, [params.branchId, setSelectedBranchId]);

  // Safety redirect if movie is missing
  useEffect(() => {
    if (!selectedMovie) {
      router.push('/');
    }
  }, [selectedMovie, router]);

  if (!selectedMovie || !branch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32 px-6 md:px-12" dir="rtl">
      {/* Navigation Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        <Link href="/" className="hover:text-primary transition-colors">ראשי</Link>
        <ChevronRight size={12} className="rotate-180" />
        <Link href={`/movie/${selectedMovie.id}`} className="hover:text-primary transition-colors">{selectedMovie.title}</Link>
        <ChevronRight size={12} className="rotate-180" />
        <Link href="/branches" className="hover:text-primary transition-colors">בחר סניף</Link>
        <ChevronRight size={12} className="rotate-180" />
        <span className="text-white">בחירת מושבים</span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Selection Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Movie Summary Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-8 rounded-[40px] bg-white/[0.03] border border-white/10 overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="w-24 h-36 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/10">
                <Image 
                  src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`} 
                  alt={selectedMovie.title}
                  width={96}
                  height={144}
                  className="object-cover h-full"
                />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl font-black mb-2 font-outfit">{selectedMovie.title}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    <span>{branch.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    <span>{selectedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" />
                    <span>{selectedShowtime}</span>
                  </div>
                </div>
              </div>
              <Link 
                href="/branches"
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                החלף סניף
              </Link>
            </div>
          </motion.div>

          {/* Seat Selection */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Ticket className="text-primary w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black tracking-tight font-outfit">בחר מושבים</h2>
            </div>
            <SeatMap />
          </section>
        </div>

        {/* Right Column: Showtime & Summary Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <section className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10">
             <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <Clock className="text-cyan-500 w-5 h-5" />
              </div>
              <h2 className="text-xl font-black tracking-tight font-outfit">שעות הקרנה</h2>
            </div>
            <ShowtimeSelector />
          </section>

          {/* Booking Summary Card */}
          <div className="sticky top-24">
            <motion.div 
              layout
              className="p-8 rounded-[40px] bg-gradient-to-br from-primary via-primary/90 to-[#FF7A00] text-[#050505] shadow-[0_20px_60px_rgba(255,159,10,0.3)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-lg font-black uppercase tracking-tighter mb-6">סיכום הזמנה</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-black/10 pb-4">
                  <span className="text-xs font-bold uppercase opacity-60">מושבים שנבחרו</span>
                  <span className="text-lg font-black">{selectedSeats.length > 0 ? selectedSeats.length : '0'}</span>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="flex flex-wrap gap-2 py-2">
                    {selectedSeats.map(id => (
                      <span key={id} className="px-2 py-1 bg-black/10 rounded-lg text-[10px] font-black">{id.replace('s-', '')}</span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-black/10 pb-4">
                  <span className="text-xs font-bold uppercase opacity-60">מחיר לכרטיס</span>
                  <span className="text-lg font-black">₪45</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black uppercase">סה&quot;כ</span>
                  <span className="text-3xl font-black">₪{selectedSeats.length * 45}</span>
                </div>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => router.push('/checkout')}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  selectedSeats.length > 0
                    ? 'bg-black text-white shadow-xl hover:scale-[1.02] active:scale-95'
                    : 'bg-black/20 text-black/40 cursor-not-allowed'
                }`}
              >
                המשך לתשלום
                <ArrowRight size={18} className="rotate-180" />
              </button>
            </motion.div>
            
            <p className="text-center mt-6 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              הזמנה מאובטחת • ללא עמלות נוספות
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
