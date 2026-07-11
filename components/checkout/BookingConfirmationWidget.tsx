'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Ticket } from 'lucide-react';

interface BookingConfirmationWidgetProps {
  onDismiss: () => void;
}

export default function BookingConfirmationWidget({ onDismiss }: BookingConfirmationWidgetProps) {
  useEffect(() => {
    // Haptic pulse for success
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="relative overflow-hidden w-full p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] my-4"
    >
      {/* Particle Effect BG */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" 
      />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </motion.div>
        
        <div>
          <h3 className="text-xl font-bold text-white font-display tracking-wide">Booking Confirmed</h3>
          <p className="text-emerald-100/70 text-sm mt-1">Your seats are locked and tickets are ready.</p>
        </div>

        <button 
          onClick={onDismiss}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 text-emerald-950 font-bold hover:bg-emerald-400 transition-colors"
        >
          <Ticket className="w-4 h-4" />
          <span>View Kinetic Ticket</span>
        </button>
      </div>
    </motion.div>
  );
}
