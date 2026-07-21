'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Ticket, Calendar, Clock } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { getImageUrl } from '@/lib/tmdb';
import { SHOWTIMES } from '@/lib/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SightlinePreview from './SightlinePreview';
import AcousticSpatializer from './AcousticSpatializer';
import { CryptoTicketPricer } from '@/components/booking/CryptoTicketPricer';
import { BiometricAuth } from '@/components/checkout/BiometricAuth';
import { useWalletStore } from '@/lib/store/walletStore';
import { PaymentSingularityMatrix } from '@/components/checkout/PaymentSingularityMatrix';

gsap.registerPlugin(ScrollTrigger);

interface BookingSummarySidebarProps {
  onCheckout: () => void;
}

export default function BookingSummarySidebar({ onCheckout }: BookingSummarySidebarProps) {
  // Zustand State - Strict Selectors
  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedHall = useBookingStore((state) => state.selectedHall);
  const { balances } = useWalletStore();

  const appliedFlashOffer = useBookingStore((state) => state.appliedFlashOffer);
  
  const showtimeData = SHOWTIMES.find(s => s.time === selectedShowtime) || SHOWTIMES[0];
  const ticketPrice = showtimeData.price;

  let totalPrice = selectedSeats.length * ticketPrice;
  if (appliedFlashOffer) {
    const hasAllOfferSeats = appliedFlashOffer.seats.every(seat => selectedSeats.includes(seat));
    if (hasAllOfferSeats) {
      const normalPriceForOfferSeats = appliedFlashOffer.seats.length * ticketPrice;
      // Convert applied flash offer to tax exclusive to match ticketPrice which is tax exclusive
      const taxExclusiveOfferPrice = appliedFlashOffer.price; 
      const discount = normalPriceForOfferSeats - taxExclusiveOfferPrice;
      totalPrice -= discount;
    }
  }

  useEffect(() => {
    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    // ScrollTrigger to fade/scale in the summary poster as user scrolls down from hero
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-poster-target',
        { opacity: 0, scale: 0.7, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#hero-trigger',
            scroller: scrollerEl,
            start: 'bottom 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  if (!selectedMovie) return null;

  return (
    <div className="sticky top-28 w-full" dir="rtl">
      <div className="relative p-6 rounded-[36px] bg-white/[0.02] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden group">
        {/* Optical Depth Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-colors duration-500" />
        
        {/* Header with target morphed poster */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-5 mb-5">
          <div className="hero-poster-target w-[64px] h-[96px] rounded-xl overflow-hidden border border-white/15 relative shrink-0 shadow-lg bg-white/5">
            <Image
              src={getImageUrl(selectedMovie.poster_path, 'w500')}
              alt={selectedMovie.displayTitle}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-primary font-black uppercase tracking-wider block mb-1">סיכום הזמנה</span>
            <h3 className="text-lg font-black text-white leading-tight font-display uppercase">{selectedMovie.displayTitle}</h3>
          </div>
        </div>

        {/* Selection Details */}
        <div className="space-y-4 text-xs font-bold text-slate-400 mb-6">
          <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
            <Calendar size={14} className="text-slate-500 shrink-0" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">תאריך הקרנה</span>
              <span className="text-white font-black">{selectedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
            <Clock size={14} className="text-slate-500 shrink-0" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">שעה ואולם</span>
              <span className="text-white font-black">{selectedShowtime} • {selectedHall || 'Standard'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <Ticket size={14} className="text-slate-500 shrink-0" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">מושבים שנבחרו</span>
                <span className="text-white font-black">
                  {selectedSeats.length > 0 ? `${selectedSeats.length} כרטיסים` : 'טרם נבחרו מושבים'}
                </span>
              </div>
            </div>
            
            {selectedSeats.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5 mt-1.5">
                {selectedSeats.map((id) => (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-white shrink-0"
                  >
                    {id.replace('s-', '')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-white/5 pt-4 mb-6 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-400">
            <span>מחיר לכרטיס</span>
            <span className="font-bold text-white">₪{ticketPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-black text-white pt-1">
            <span>סה&quot;כ</span>
            <span className="text-2xl font-black text-primary text-glow">₪{totalPrice}</span>
          </div>
        </div>

        {/* Wallet Balance Display */}
        {balances.BTC > 0 && (
          <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex justify-between items-center text-right">
            <span className="text-[10px] text-amber-500/80 uppercase tracking-widest font-bold">יתרת ארנק קריפטו (Cashback)</span>
            <span className="text-amber-400 font-mono font-bold">{balances.BTC.toFixed(6)} BTC</span>
          </div>
        )}

        {/* Crypto Payment Checkout Widget */}
        <div className="w-full relative z-20 mb-4">
          <CryptoTicketPricer 
            basePriceUSD={totalPrice} 
            onPaymentSuccess={onCheckout} 
          />
        </div>

        {/* Multi-Currency Matrix */}
        <div className="w-full relative z-20 mb-4">
          <PaymentSingularityMatrix />
        </div>

        {/* Biometric Touch-Hold Auth */}
        <div className="w-full relative z-20">
          <BiometricAuth amount={totalPrice} onSuccess={onCheckout} />
        </div>

        <p className="text-center mt-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest block">
          הזמנה מאובטחת באמצעות בלוקצ'יין וביומטריה • Cashback 5%
        </p>
      </div>

      {/* Next-Gen Immersive Experience Modules */}
      <div className="space-y-6 mt-6">
        <SightlinePreview />
        <AcousticSpatializer />
      </div>
    </div>
  );
}
