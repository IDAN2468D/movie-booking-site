'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MovieOption } from '@/types/seatingGame';
import { useBookingStore } from '@/lib/store';
import { ShoppingBag, ArrowLeft, Ticket, Eye, Radio } from 'lucide-react';

interface CheckoutActionBarProps {
  selectedMovie: MovieOption;
  selectedShowtime: string;
  assignedSeats: Record<string, string>;
  totalScore: number;
}

export const CheckoutActionBar: React.FC<CheckoutActionBarProps> = ({
  selectedMovie,
  selectedShowtime,
  assignedSeats,
  totalScore,
}) => {
  const router = useRouter();
  const { setSelectedMovie, setSeats, setSelectedShowtime, setSelectedBranchId } = useBookingStore();
  const assignedCount = Object.keys(assignedSeats).length;
  const totalPrice = assignedCount * selectedMovie.pricePerTicket;

  const syncStore = () => {
    const seatIds = Object.keys(assignedSeats);
    setSelectedMovie({
      id: Number(selectedMovie.id) || 999101,
      title: selectedMovie.title,
      displayTitle: selectedMovie.hebrewTitle,
      poster_path: selectedMovie.poster,
      backdrop_path: selectedMovie.poster,
      overview: `כרטיסים נבחרו במשחק סידור מושבים עבור ${selectedMovie.hebrewTitle}`,
      vote_average: 9.5,
      release_date: '2026',
      genre_ids: [28, 12],
    });
    setSeats(seatIds);
    setSelectedShowtime(selectedShowtime);
    setSelectedBranchId('tlv-main');
  };

  const handleProceedToCheckout = () => {
    if (assignedCount === 0) return;
    syncStore();
    router.push('/checkout');
  };

  const handleProceedToLiveMap = () => {
    if (assignedCount === 0) return;
    syncStore();
    router.push('/booking/showtime-1');
  };

  return (
    <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Summary Info */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md">
          <Ticket className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-white text-base">{selectedMovie.hebrewTitle}</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 text-xs font-mono font-bold">
              {selectedShowtime}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            <span className="font-mono text-white font-bold me-1">{assignedCount}</span> מושבים שובצו
            ({Object.keys(assignedSeats).join(', ') || 'טרם שובצו'}) • הרמוניה:{' '}
            <span className="font-mono text-cyan-400 font-bold">{totalScore}%</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-right me-2">
          <span className="text-[11px] text-slate-400 block font-medium">סה"כ לתשלום</span>
          <span className="text-2xl font-black text-white font-mono">₪{totalPrice}</span>
        </div>

        {/* Live Seat Map Button */}
        <button
          onClick={handleProceedToLiveMap}
          disabled={assignedCount === 0}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs transition-all border ${
            assignedCount > 0
              ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-md hover:scale-105'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
          }`}
        >
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>מפת מושבים בלייב</span>
        </button>

        {/* Checkout Button */}
        <button
          onClick={handleProceedToCheckout}
          disabled={assignedCount === 0}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xl ${
            assignedCount > 0
              ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-500/30 hover:scale-105 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4 flex-shrink-0" />
          <span>מעבר לתשלום</span>
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};
