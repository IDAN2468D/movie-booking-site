'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { CheckCircle2, Ticket, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { FOOD_ITEMS, CINEMA_BRANCHES } from '@/lib/constants';
import CineBookReceiptPrinter, { CineBookReceiptData } from '@/components/receipt/CineBookReceiptPrinter';

interface SuccessViewProps {
  resetBooking: () => void;
  bookingCode?: string;
}

export const SuccessView = ({ resetBooking, bookingCode }: SuccessViewProps) => {
  const { 
    selectedMovie, selectedSeats, selectedFood, 
    selectedDate, selectedShowtime, selectedHall, selectedBranchId 
  } = useBookingStore();

  const branch = CINEMA_BRANCHES.find(b => b.id === selectedBranchId);

  const receiptData: CineBookReceiptData = useMemo(() => {
    const movieTitle = selectedMovie?.displayTitle || selectedMovie?.title || 'סרט קולנוע';
    const branchName = branch?.name || 'CINEPULSE VIP CINEMA';
    const seatsCount = selectedSeats.length || 1;
    const ticketUnitPrice = 55;
    const ticketTotal = seatsCount * ticketUnitPrice;

    const foodItemsList = selectedFood.map(f => {
      const itemDef = FOOD_ITEMS.find(item => item.id === f.id);
      const name = itemDef?.name || `פריט #${f.id}`;
      const price = (itemDef?.price || 0) * f.quantity;
      return { name: `${f.quantity}X ${name}`, qty: f.quantity, price };
    });

    const items = [
      { name: `${seatsCount}X כרטיס קולנוע`, qty: seatsCount, price: ticketTotal },
      ...foodItemsList,
    ];

    const total = items.reduce((acc, curr) => acc + curr.price, 0);

    return {
      cinemaName: branchName.toUpperCase(),
      tagline: 'אישור הזמנה וכרטיס קולנוע דיגיטלי',
      movieTitle,
      formatAndHall: `${selectedHall || 'אולם 1'} | IMAX 3D Laser`,
      showtime: `${selectedDate || 'היום'} | ${selectedShowtime || '20:30'}`,
      selectedSeats: selectedSeats.length > 0 ? selectedSeats : ['שורה 5 - מושב 10'],
      bookingCode: bookingCode || `CNB-${Math.floor(10000000 + Math.random() * 90000000)}`,
      items,
      subtotal: total,
      taxAmount: 0,
      total,
    };
  }, [selectedMovie, selectedSeats, selectedFood, selectedDate, selectedShowtime, selectedHall, branch, bookingCode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center p-4 relative" dir="rtl">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00FF85]/[0.05] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#FF1464]/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Success Animation Header */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 bg-[#00FF85]/10 rounded-full flex items-center justify-center border border-[#00FF85]/20 shadow-[0_0_60px_rgba(0,255,133,0.2)]">
          <CheckCircle2 size={40} className="text-[#00FF85]" />
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight font-rubik"
      >
        ההזמנה <span className="text-[#00FF85]">אושרה בהצלחה!</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 mb-6 max-w-md mx-auto text-sm leading-relaxed font-rubik"
      >
        הכרטיס הדיגיטלי נשלח למייל שלך והודפס במדפסת הטרמית למטה:
      </motion.p>

      {/* Interactive Thermal Printer Skill Feature */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xl mb-8"
      >
        <CineBookReceiptPrinter data={receiptData} />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 flex-row-reverse z-10"
      >
        <Link 
          href="/tickets" 
          className="px-8 py-3.5 bg-[#FF1464] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-[#FF1464]/30 flex items-center gap-2 flex-row-reverse font-rubik"
          onClick={resetBooking}
        >
          <Ticket size={16} />
          צפה בכרטיסים שלי
        </Link>
        <Link 
          href="/" 
          className="px-8 py-3.5 bg-white/[0.05] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/[0.08] transition-all border border-white/[0.06] font-rubik"
          onClick={resetBooking}
        >
          חזרה לבית
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-6 mt-8 flex-row-reverse z-10"
      >
        <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors flex-row-reverse">
          <Download size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest font-rubik">הורד PDF</span>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors flex-row-reverse">
          <Share2 size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest font-rubik">שתף כרטיס</span>
        </button>
      </motion.div>
    </div>
  );
};
