"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export interface DigitalTicketProps {
  movieTitle: string;
  showtime: string;
  seats: string[];
  qrPayload: string;
}

export default function DigitalTicket({ movieTitle, showtime, seats, qrPayload }: DigitalTicketProps) {
  return (
    <div className="relative flex items-center justify-center min-h-[600px] w-full p-4 perspective-[1000px]" dir="rtl">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-fuchsia-900/10 to-transparent blur-[120px] pointer-events-none" />

      {/* The Kinetic Fusion Container */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: 45 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
        className="relative w-full max-w-md rounded-[2.5rem] p-1 overflow-hidden"
      >
        {/* Animated Refraction Border */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-white/10 rounded-[2.5rem] opacity-50" />
        
        {/* Core Glass Panel */}
        <div className="relative w-full h-full rounded-[2.4rem] bg-black/40 backdrop-blur-2xl border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(139,92,246,0.15)] flex flex-col p-8 z-10 overflow-hidden">
          
          {/* Subtle Light Refraction Overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-30 skew-y-12 transform origin-top-left pointer-events-none" />

          {/* Ticket Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10 relative z-20">
            <div>
              <h2 className="text-3xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 drop-shadow-lg">
                כרטיס כניסה
              </h2>
              <p className="text-sm font-['Inter'] text-violet-300 mt-1 uppercase tracking-widest">
                Premium Cinema
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
              <span className="text-xl">🎬</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8 relative z-20">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-['Inter'] text-white/40 uppercase tracking-widest">סרט</span>
              <span className="text-lg font-['Outfit'] font-bold text-white drop-shadow-md">{movieTitle}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-['Inter'] text-white/40 uppercase tracking-widest">תאריך ושעה</span>
              <span className="text-lg font-['Outfit'] font-bold text-white drop-shadow-md">{showtime}</span>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-xs font-['Inter'] text-white/40 uppercase tracking-widest">מושבים</span>
              <div className="flex gap-2 flex-wrap mt-1">
                {seats.map((seat) => (
                  <span key={seat} className="px-3 py-1 rounded-lg bg-violet-500/20 border border-violet-400/30 text-violet-200 font-['Outfit'] font-bold text-sm shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Secure QR Display Area */}
          <div className="relative mt-auto pt-6 flex flex-col items-center z-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
              className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] relative overflow-hidden"
            >
              <QRCodeSVG 
                value={qrPayload} 
                size={160} 
                level="Q"
                includeMargin={false}
                fgColor="#000000"
                bgColor="#ffffff"
              />
              {/* Scan Line Animation */}
              <motion.div 
                animate={{ y: [0, 160, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1 bg-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
              />
            </motion.div>
            
            <p className="mt-4 text-[10px] font-['Inter'] text-white/30 tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cryptographically Secured Payload
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
