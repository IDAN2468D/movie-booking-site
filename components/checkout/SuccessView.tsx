'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Ticket, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessViewProps {
  resetBooking: () => void;
}

export const SuccessView = ({ resetBooking }: SuccessViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center p-6 relative" dir="rtl">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00FF85]/[0.05] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#FF1464]/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Success Animation */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 0.2 }}
        className="relative mb-10"
      >
        <div className="w-28 h-28 bg-[#00FF85]/10 rounded-full flex items-center justify-center border border-[#00FF85]/20 shadow-[0_0_60px_rgba(0,255,133,0.2)]">
          <CheckCircle2 size={52} className="text-[#00FF85]" />
        </div>
        {/* Pulse Ring */}
        <motion.div 
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-[#00FF85]/30"
        />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight font-rubik"
      >
        ההזמנה <span className="text-[#00FF85]">אושרה!</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white/40 mb-12 max-w-md mx-auto text-sm leading-relaxed font-rubik"
      >
        הכרטיסים שלך נשלחו לאימייל וזמינים כעת במדור &quot;הכרטיסים שלי&quot;. תהנו מהסרט!
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 flex-row-reverse"
      >
        <Link 
          href="/tickets" 
          className="px-10 py-4 bg-[#FF1464] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-[#FF1464]/30 flex items-center gap-3 flex-row-reverse font-rubik"
          onClick={resetBooking}
        >
          <Ticket size={16} />
          צפה בכרטיסים
        </Link>
        <Link 
          href="/" 
          className="px-10 py-4 bg-white/[0.05] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/[0.08] transition-all border border-white/[0.06] font-rubik"
          onClick={resetBooking}
        >
          חזרה לבית
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-6 mt-12 flex-row-reverse"
      >
        <button className="flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors flex-row-reverse">
          <Download size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest font-rubik">הורד PDF</span>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button className="flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors flex-row-reverse">
          <Share2 size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest font-rubik">שתף</span>
        </button>
      </motion.div>
    </div>
  );
};
