'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessViewProps {
  resetBooking: () => void;
}

export const SuccessView = ({ resetBooking }: SuccessViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 text-right">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 size={48} className="text-green-500" />
      </motion.div>
      
      <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">ההזמנה <span className="text-primary">אושרה!</span></h1>
      <p className="text-slate-400 mb-12 max-w-md mx-auto">הכרטיסים שלך נשלחו לאימייל וזמינים כעת במדור &quot;הכרטיסים שלי&quot;.</p>
      
      <div className="flex gap-4 flex-row-reverse">
        <Link 
          href="/tickets" 
          className="px-8 py-4 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
          onClick={resetBooking}
        >
          צפה בכרטיסים
        </Link>
        <Link 
          href="/" 
          className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          onClick={resetBooking}
        >
          חזרה לבית
        </Link>
      </div>
    </div>
  );
};
