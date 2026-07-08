"use client";

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useTicketRotator } from '@/hooks/useTicketRotator';
import { useNetworkGuard } from '@/hooks/useNetworkGuard';
import { TicketPayload } from '@/hooks/useOfflineTicketStore';

interface LiquidGlassTicketProps {
  ticket: TicketPayload;
  secret: string; // The decrypted JWT or secret part
}

export default function LiquidGlassTicket({ ticket, secret }: LiquidGlassTicketProps) {
  const isOnline = useNetworkGuard();
  const { totpHash, timeRemaining } = useTicketRotator(ticket.ticketId, secret);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate rotation (-15 to 15 degrees)
    const rotateY = ((mouseX / width) - 0.5) * 30;
    const rotateX = ((mouseY / height) - 0.5) * -30;
    
    x.set(rotateY);
    y.set(rotateX);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glareX = useTransform(x, [-15, 15], [0, 100]);
  const glareY = useTransform(y, [-15, 15], [0, 100]);

  return (
    <div className="relative w-full max-w-sm mx-auto" style={{ perspective: 1000 }}>
      {!isOnline && (
        <div className="absolute -top-14 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-medium tracking-wide">Off-Grid Network Guard Active</span>
        </div>
      )}

      <motion.div
        style={{
          rotateX: y,
          rotateY: x,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[1/1.6] rounded-[24px] p-6 flex flex-col justify-between overflow-hidden liquid-glass-3 transition-transform duration-200 ease-out shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.15)]"
      >
        {/* Holographic Parallax Shimmer Layer */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
            ),
          }}
        />

        {/* Chromatic Sub-pixel Border */}
        <div className="absolute inset-0 rounded-[24px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)] pointer-events-none z-10" />

        <div className="relative z-20 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-3xl font-bold font-display tracking-wide text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">VIP PASS</h3>
            <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md text-white/80 border border-white/5">{ticket.ticketId.substring(0, 8)}</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Valid Until</p>
            <p className="text-white/90 font-mono text-sm">{new Date(ticket.validUntil).toLocaleString('he-IL')}</p>
          </div>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center bg-black/40 rounded-xl p-5 backdrop-blur-xl border border-white/10 shadow-[inset_0_2px_20px_rgba(255,255,255,0.05)]">
          {/* Dynamic QR Token */}
          <div className="w-48 h-48 bg-white p-2 rounded-lg flex items-center justify-center relative overflow-hidden">
            {totpHash ? (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${totpHash}`}
                alt="Secure QR"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-black/5 flex items-center justify-center flex-col gap-2">
                <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {/* Shifting scan line effect */}
            <motion.div 
              className="absolute left-0 right-0 h-[2px] bg-primary/50 shadow-[0_0_10px_rgba(255,20,100,0.8)]"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
            />
          </div>
          
          <div className="w-full mt-5 flex items-center justify-between px-2">
            <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">Sync: {timeRemaining}s</span>
            <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                animate={{ width: `${(timeRemaining / 15) * 100}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </div>
          </div>
          
          <p className="mt-3 text-[9px] text-white/30 text-center font-mono tracking-widest w-full truncate px-2">
            {totpHash ? totpHash : 'COMPUTING...'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
