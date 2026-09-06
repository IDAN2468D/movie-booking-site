'use client';

import React, { useEffect, useMemo } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Ticket, Star, Sparkles } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { useUIStore } from '@/lib/store/ui-store';
import { getImageUrl } from '@/lib/tmdb';
import { SHOWTIMES } from '@/lib/constants';
import SeatMap from './SeatMap';

export default function MobileLiveBookingSheet() {
  const router = useRouter();
  const { selectedMovie, selectedSeats, selectedShowtime, setSelectedShowtime, location } = useBookingStore();
  const { isMobileBookingOpen, setMobileBookingOpen } = useUIStore();

  useEffect(() => {
    const handleOpen = () => setMobileBookingOpen(true);
    window.addEventListener('open-mobile-booking', handleOpen);
    return () => window.removeEventListener('open-mobile-booking', handleOpen);
  }, [setMobileBookingOpen]);

  const activeShowtime = useMemo(() => {
    return SHOWTIMES.find(s => s.time === selectedShowtime) || SHOWTIMES[0];
  }, [selectedShowtime]);

  const seatCount = selectedSeats.length;
  const totalPrice = seatCount * (activeShowtime?.price || 45);

  const handleCheckout = () => {
    if (seatCount === 0) return;
    setMobileBookingOpen(false);
    router.push('/checkout');
  };

  const close = () => setMobileBookingOpen(false);

  return (
    <AnimatePresence>
      {isMobileBookingOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Sheet Body */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{ transform: 'translate3d(0, 0, 0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            className="relative z-10 w-full max-h-[92dvh] bg-[#0A0D14] border-t border-white/15 rounded-t-[36px] shadow-[0_-25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden transform-gpu"
          >
            {/* Grab Bar & Top Controls */}
            <div className="pt-3 pb-2 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 text-primary text-xs font-black">
                <Sparkles size={16} />
                <span>הזמנה חיה מהירה</span>
              </div>
              <div className="w-10 h-1 rounded-full bg-white/20 -ms-4" />
              <button
                onClick={close}
                aria-label="סגור חלון הזמנה"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Booking Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5 pb-36">
              {/* Selected Movie Capsule */}
              {selectedMovie ? (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 relative overflow-hidden">
                  <div className="w-14 h-20 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
                    <NextImage
                      src={getImageUrl(selectedMovie.poster_path || selectedMovie.backdrop_path, 'w500')}
                      alt={selectedMovie.displayTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 text-amber-400">
                      <Star size={13} className="fill-amber-400" />
                      <span className="text-xs font-black">{selectedMovie.vote_average?.toFixed(1) || '8.5'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">| {location || 'תל אביב'}</span>
                    </div>
                    <h4 className="text-sm font-black text-white truncate">{selectedMovie.displayTitle}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{selectedMovie.overview || 'חווית הקרנה קולנועית פרמיום'}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                  <p className="text-xs font-bold text-white">בחר סרט מהלוח כדי להמשיך לבחירת מושבים</p>
                </div>
              )}

              {/* Showtimes Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    מועדי הקרנה להיום
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{activeShowtime.hall}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {SHOWTIMES.map((show) => {
                    const isSelected = (selectedShowtime || SHOWTIMES[0].time) === show.time;
                    return (
                      <button
                        key={show.time}
                        onClick={() => setSelectedShowtime(show.time)}
                        className={`px-3.5 py-2 rounded-xl flex flex-col items-center shrink-0 border transition-all ${
                          isSelected
                            ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(255,20,100,0.4)]'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-black">{show.time}</span>
                        <span className={`text-[9px] font-bold ${isSelected ? 'text-black/80' : 'text-slate-400'}`}>
                          {show.type} • ₪{show.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Touch SeatMap */}
              <div className="rounded-2xl bg-black/40 border border-white/10 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-slate-300">בחר מושב במפה (לחיצה לבחירה)</span>
                  <span className="text-[10px] text-primary font-bold">{seatCount} מושבים נבחרו</span>
                </div>
                <div className="overflow-x-auto custom-scrollbar max-w-full pb-2">
                  <div className="min-w-[320px]">
                    <SeatMap
                      showtimeId={activeShowtime.time}
                      userId="mobile-user"
                      occupiedSeats={[]}
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Checkout Footer */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-[#07090E]/95 backdrop-blur-2xl border-t border-white/15 flex items-center justify-between gap-4 z-20">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase">סה״כ לתשלום</p>
                <p className="text-lg font-black text-white">₪{totalPrice}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={seatCount === 0}
                className={`flex-1 h-13 py-3 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  seatCount > 0
                    ? 'bg-gradient-to-r from-primary via-[#FF1464] to-amber-400 text-white shadow-primary/30 active:scale-95'
                    : 'bg-white/10 text-white/40 pointer-events-none'
                }`}
              >
                <Ticket size={18} />
                <span>{seatCount > 0 ? `המשך לתשלום (${seatCount} כרטיסים)` : 'בחר מושבים להמשך'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
