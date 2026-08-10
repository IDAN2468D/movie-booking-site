'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

export const TicketsHeader: React.FC = () => {
  return (
    <div className="mb-12 relative text-right dir-rtl">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-4 mb-4 justify-end">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(255,159,10,0.2)]">
             <Ticket className="text-primary w-6 h-6" />
          </div>
          <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.4em]">Personal Cinema Collection</p>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 font-outfit">
           הכרטיסים <span className="text-primary drop-shadow-[0_0_20px_rgba(255,159,10,0.4)]">שלי</span>
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-medium max-w-xl mr-auto md:mr-0">
           המסעות הקולנועיים הקרובים והקודמים שלך, מעובדים ומאובטחים במנוע ה-AI של MovieBook עם אפקט גבול זוהר.
        </p>
      </motion.div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};
