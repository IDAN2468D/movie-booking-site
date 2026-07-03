'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import NextImage from 'next/image';
import { Calendar, Clock, MapPin, QrCode, Mail, Download, Loader2 } from 'lucide-react';
import { TicketCountdownView, TicketQrView, TicketMemoryView } from './TicketViews';
import TicketShard from './TicketShard';

interface TicketType {
  id: string;
  movie: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  image: string;
  active: boolean;
  points?: number;
  total?: number;
}

interface QuantumTicketProps {
  ticket: TicketType;
  state: 'countdown' | 'qr' | 'memory';
  onEmail?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  isProcessingEmail?: boolean;
  isProcessingPDF?: boolean;
}

export default function QuantumTicket({
  ticket,
  state,
  onEmail,
  onDownload,
  isProcessingEmail,
  isProcessingPDF
}: QuantumTicketProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 40 });
  const [personalNote, setPersonalNote] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isAssembled, setIsAssembled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 200, damping: 20 });
  const glintX = useSpring(useTransform(mouseX, [0, 100], [-50, 250]), { stiffness: 200, damping: 25 });
  const glintY = useSpring(useTransform(mouseY, [0, 100], [-50, 250]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev.seconds > 0 ? { ...prev, seconds: prev.seconds - 1 } : prev);
    }, 1000);
    const assemblyTimeout = setTimeout(() => setIsAssembled(true), 400);
    return () => { clearInterval(timer); clearTimeout(assemblyTimeout); };
  }, []);

  const isSciFi = ticket.movie.toLowerCase().includes('dune') || ticket.movie.toLowerCase().includes('star');
  const themeGlow = isSciFi ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 211, 238, 0.15)';

  return (
    <motion.div
      layout
      ref={cardRef}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="relative flex flex-col group w-full max-w-sm mx-auto cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={() => setShowQR(!showQR)}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <TicketShard isAssembled={isAssembled} />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isAssembled ? 1 : 0.8, scale: isAssembled ? 1 : 0.95 }}
        className="bg-black/50 backdrop-blur-[50px] border border-white/20 rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 40px ${themeGlow}` }}
      >
        <motion.div className="absolute pointer-events-none opacity-25 transition-opacity group-hover:opacity-50 z-30 mix-blend-overlay duration-500 w-[300px] h-[300px] top-[-50px] left-[-50px] blur-2xl" style={{ background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)', x: glintX, y: glintY }} />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]" />

        <div className="relative h-64 overflow-hidden border-b border-white/10">
          <NextImage src={ticket.image} alt={ticket.movie} fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 saturate-[1.2]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-8 right-6 left-6 text-right">
            <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-lg font-outfit truncate">{ticket.movie}</h3>
          </div>
        </div>

        <div className="p-6 relative text-right flex-1 min-h-[220px]">
          <AnimatePresence>
            {showQR && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 z-40 flex flex-col items-center justify-center p-6 rounded-[30px] backdrop-blur-md">
                <div className="p-4 bg-white rounded-3xl"><QrCode size={120} className="text-black" /></div>
                <p className="text-[10px] font-black text-slate-400 mt-4 tracking-[0.2em]">סרוק בכניסה לאולם</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {state === 'countdown' && <TicketCountdownView timeLeft={timeLeft} />}
            {state === 'qr' && <TicketQrView ticketId={ticket.id} />}
            {state === 'memory' && <TicketMemoryView userRating={userRating} setUserRating={setUserRating} personalNote={personalNote} setPersonalNote={setPersonalNote} />}
          </AnimatePresence>
        </div>

        <div className="h-6 bg-black/40 flex items-center justify-center overflow-hidden relative">
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#050505] rounded-full border-r border-white/10" />
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#050505] rounded-full border-l border-white/10" />
          <div className="w-[85%] h-[1px] border-t border-dashed border-white/20 opacity-30" />
        </div>

        <div className="p-6 bg-white/[0.02] relative text-right">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">תאריך</p><p className="text-sm text-white font-black">{ticket.date}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">שעה</p><p className="text-sm text-white font-black">{ticket.time}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">אולם</p><p className="text-sm text-white font-black">{ticket.hall}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">מושבים</p><p className="text-sm text-white font-black truncate">{ticket.seats.join(', ')}</p></div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 justify-center w-full px-2 mt-4 z-10">
        {onEmail && (
          <button onClick={(e) => { e.stopPropagation(); onEmail(); }} disabled={isProcessingEmail} className="flex-1 py-3 px-4 rounded-2xl bg-[#0F0F0F]/60 backdrop-blur-xl hover:bg-white/10 text-xs font-black uppercase text-slate-300 border border-white/10 flex items-center justify-center gap-2">
            {isProcessingEmail ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Mail className="w-4 h-4 text-primary" />}
            <span>שלח למייל</span>
          </button>
        )}
        {onDownload && (
          <button onClick={(e) => { e.stopPropagation(); onDownload(); }} disabled={isProcessingPDF} className="flex-1 py-3 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-xs font-black uppercase text-background flex items-center justify-center gap-2">
            {isProcessingPDF ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : <Download className="w-4 h-4 text-background" />}
            <span>PDF הורד</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
