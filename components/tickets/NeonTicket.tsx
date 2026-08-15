'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { QrCode, Mail, Download, Sparkles, Calendar, Clock, MapPin } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { TicketType } from '@/lib/constants/fallbackTickets';

interface NeonTicketProps {
  ticket: TicketType;
  onEmail?: () => void;
  onDownload?: () => void;
  isProcessingEmail?: boolean;
  isProcessingPDF?: boolean;
}

export default function NeonTicket({
  ticket,
  onEmail,
  onDownload,
  isProcessingEmail,
  isProcessingPDF,
}: NeonTicketProps) {
  const [showQR, setShowQR] = useState(false);

  const getPoster = (img: string, title: string) => {
    if (!img || img.includes('null') || img.includes('undefined')) {
      if (title.includes('גלדיאטור') || title.toLowerCase().includes('gladiator')) return 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg';
      if (title.includes('דיונה') || title.toLowerCase().includes('dune')) return 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg';
      return 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg';
    }
    return img;
  };

  const posterSrc = getPoster(ticket.image, ticket.movie);

  return (
    <motion.div
      whileHover={{ scale: 1.025, y: -6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="relative w-full max-w-sm h-[480px] rounded-3xl p-[2px] overflow-hidden group shadow-[0_0_35px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-shadow duration-500"
      dir="rtl"
    >
      {/* Rotating Conic Gradient - Clipped Perfectly */}
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,#ec4899_0deg,#8b5cf6_120deg,#06b6d4_240deg,#ec4899_360deg)] animate-[spin_8s_linear_infinite] opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Dark Inner Glass Container */}
      <div className="relative w-full h-full bg-slate-950/92 backdrop-blur-2xl rounded-[22px] z-10 flex flex-col overflow-hidden border border-white/10">
        
        {/* Top Poster Banner */}
        <div className="relative h-44 w-full overflow-hidden">
          <NextImage
            src={posterSrc}
            alt={ticket.movie}
            fill
            className="object-cover object-top opacity-60 group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-3 right-3 bg-pink-500/20 backdrop-blur-md border border-pink-500/40 text-pink-300 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
            <span>VIP NEON PASS</span>
          </div>

          <button
            onClick={() => setShowQR(!showQR)}
            className="absolute top-3 left-3 bg-black/60 hover:bg-cyan-500/30 backdrop-blur-md border border-white/20 hover:border-cyan-400 text-white text-xs p-2 rounded-xl transition-all duration-300 shadow-lg flex items-center gap-1.5"
            title="הצג קוד QR"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between text-right z-20">
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-wide mb-3 line-clamp-1 group-hover:text-cyan-300 transition-colors">
              {ticket.movie}
            </h3>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-3">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 p-2 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>{ticket.date}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 p-2 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{ticket.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-500/20 p-2.5 rounded-xl mb-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold text-slate-200">{ticket.hall}</span>
              </div>
              <span className="font-extrabold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
                מושבים: {ticket.seats.join(', ')}
              </span>
            </div>
          </div>

          {/* QR Code Overlay Flip */}
          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-x-4 top-16 bottom-16 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl z-30 flex flex-col items-center justify-center p-4 shadow-2xl"
              >
                <div className="p-3 bg-white rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-2">
                  <div className="w-28 h-28 bg-slate-900 rounded flex items-center justify-center border-2 border-dashed border-cyan-500">
                    <QrCode className="w-20 h-20 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <p className="text-xs font-bold text-cyan-300 mb-1">סרוק בכניסה לאולם</p>
                <p className="text-[10px] text-slate-400">קוד כרטיס: {ticket.id}</p>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-3 text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-xl border border-white/10"
                >
                  סגור
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <button
              onClick={onEmail}
              disabled={isProcessingEmail}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isProcessingEmail ? (
                <LoadingIndicator variant="spinner" size="sm" label="שולח..." />
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>דוא"ל</span>
                </>
              )}
            </button>

            <button
              onClick={onDownload}
              disabled={isProcessingPDF}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isProcessingPDF ? (
                <LoadingIndicator variant="spinner" size="sm" label="מוריד..." />
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
