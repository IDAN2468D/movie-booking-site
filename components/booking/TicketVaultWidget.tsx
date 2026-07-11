'use client';

import React from 'react';
import { QrCode, Ticket as TicketIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TicketVaultWidget() {
  // Mock data for the vault (in reality, fetched via context or Server Action)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mt-4 w-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <TicketIcon className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-display font-bold">Ticket Vault</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {/* Mock active ticket */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-950/40 to-black/40 border border-emerald-500/20 p-4">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full blur-xl pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-emerald-400/70 font-mono tracking-widest uppercase mb-1">Active Pass</p>
              <h4 className="text-white font-bold font-display leading-tight">Neon Dreams (IMAX)</h4>
              <p className="text-white/60 text-xs mt-1">Seats: F12, F13</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md">
              <QrCode className="w-8 h-8 text-white/80" />
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] uppercase font-mono">
            <span className="text-white/50">REF: TX-84920</span>
            <span className="text-emerald-400 font-bold">+50 Pulse PT</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
