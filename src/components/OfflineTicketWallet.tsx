"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateTicketHash, isNetworkOnline } from '../lib/cryptoWallet';

interface TicketData {
  userId: string;
  orderId: string;
  seatIds: string[];
  movieTitle: string;
  showtime: string;
}

export default function OfflineTicketWallet({ ticket }: { ticket: TicketData }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [ticketHash, setTicketHash] = useState<string>('Generating Secure Hash...');

  useEffect(() => {
    // Initial network boundaries check
    setIsOnline(isNetworkOnline());

    // Listeners for real-time off-grid status transitions
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cryptographic Secure Hash Generation
    generateTicketHash(ticket.userId, ticket.orderId, ticket.seatIds)
      .then((hash) => setTicketHash(hash))
      .catch((err) => {
        console.error('Crypto validation generation error:', err);
        setTicketHash('HASH_GENERATION_FAILED');
      });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [ticket]);

  return (
    <div className="w-full max-w-md mx-auto p-2">
      {/* Off-Grid Network Guard Banner */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center justify-center p-3 mb-6 rounded-xl backdrop-blur-md bg-amber-500/20 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <span className="font-outfit font-semibold text-amber-200 drop-shadow-md text-sm">
            ⚠️ Offline Secure View Mode Active
          </span>
        </motion.div>
      )}

      {/* Liquid Glass 3.0 Secure Ticket Voucher Component */}
      <div className="relative w-full rounded-3xl p-8 backdrop-blur-[24px] saturate-[180%] bg-white/5 border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_0_0_1px_rgba(255,255,255,0.15)] overflow-hidden">
        {/* Background Ambient Fusion Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/30 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl font-outfit font-bold text-white mb-2 drop-shadow-lg text-center">
            {ticket.movieTitle}
          </h2>
          <p className="font-inter text-gray-300 text-sm mb-6 bg-white/10 px-4 py-1 rounded-full border border-white/5 shadow-inner">
            {ticket.showtime}
          </p>

          {/* Seat Array Display */}
          <div className="flex gap-3 mb-8 flex-wrap justify-center">
            {ticket.seatIds.map((seat) => (
              <span key={seat} className="font-inter text-white font-bold bg-white/10 border border-white/20 px-4 py-2 rounded-lg shadow-md">
                {seat}
              </span>
            ))}
          </div>

          {/* Mock Vector Validation QR Code (Scannable Validation Element) */}
          <div className="relative w-48 h-48 bg-black/20 border border-white/10 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md mb-8 group hover:bg-black/30 transition-colors duration-300">
            <div className="w-32 h-32 border-4 border-dashed border-white/30 rounded-lg flex items-center justify-center relative overflow-hidden">
               {/* Kinetic Scanner Laser Effect */}
               <motion.div 
                 animate={{ y: [-60, 60, -60] }}
                 transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                 className="absolute left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_12px_rgba(74,222,128,1)] z-10"
               />
               <span className="text-white/40 font-inter text-[10px] font-bold uppercase tracking-widest text-center mt-4">
                 Valid<br/>Scan Entry
               </span>
            </div>
            
            {/* Liquid Glass Corner Cross-hairs */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/40 rounded-tl-sm" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/40 rounded-tr-sm" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/40 rounded-bl-sm" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/40 rounded-br-sm" />
          </div>

          {/* Cryptographic Ledger Hash Verification String */}
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest font-inter text-gray-400 mb-2">
              Secure Ledger Hash
            </span>
            <div className="w-full px-3 py-2 bg-black/40 border border-white/5 rounded-xl text-center overflow-hidden shadow-inner">
              <span className="font-mono text-[10px] md:text-[11px] text-green-400/90 break-all opacity-80 select-all">
                {ticketHash}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-inter mt-4 tracking-wider">
              ORDER ID: {ticket.orderId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
