'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import NextImage from 'next/image';
import { QrCode, Mail, Download } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
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
  const getInitialImage = (img: string, title: string) => {
    if (!img || img.includes('null') || img.includes('undefined')) {
      if (title.includes('גלדיאטור') || title.toLowerCase().includes('gladiator')) return 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg';
      if (title.includes('דיונה') || title.toLowerCase().includes('dune')) return 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg';
      if (title.includes('אווטאר') || title.toLowerCase().includes('avatar')) return 'https://image.tmdb.org/t/p/w500/t6HIrqRAclMCA60NsSmeqe9RmNV.jpg';
      return 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg';
    }
    return img;
  };

  const [currentImg, setCurrentImg] = useState(() => getInitialImage(ticket.image, ticket.movie));
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 40 });
  const [personalNote, setPersonalNote] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isAssembled, setIsAssembled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentImg(getInitialImage(ticket.image, ticket.movie));
  }, [ticket.image, ticket.movie]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    x.set(mouseXPos / rect.width - 0.5);
    y.set(mouseYPos / rect.height - 0.5);
    cardRef.current.style.setProperty('--x', `${mouseXPos}px`);
    cardRef.current.style.setProperty('--y', `${mouseYPos}px`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev.seconds > 0 ? { ...prev, seconds: prev.seconds - 1 } : prev);
    }, 1000);
    const assemblyTimeout = setTimeout(() => setIsAssembled(true), 400);
    return () => { clearInterval(timer); clearTimeout(assemblyTimeout); };
  }, []);

  return (
    <motion.div
      layout
      ref={cardRef}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="gradient-border-card group relative flex flex-col w-full max-w-sm mx-auto cursor-pointer"
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
        className="relative rounded-[40px] p-[2px] overflow-hidden shadow-[0_0_35px_rgba(59,130,246,0.35)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-shadow duration-500"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Rotating Conic Gradient - Perfectly Clipped */}
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,#3b82f6_0deg,#a855f7_120deg,#06b6d4_240deg,#3b82f6_360deg)] animate-[spin_7s_linear_infinite] opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Inner Card Glass Mask */}
        <div className="relative w-full h-full bg-slate-950/92 backdrop-blur-[50px] rounded-[38px] overflow-hidden flex flex-col z-10 border border-white/10">
        {/* Dynamic Cursor-Tracked Gradient Border Effect */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
          style={{
            background: 'radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), rgba(59, 130, 246, 0.95), rgba(168, 85, 247, 0.8), transparent 70%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="relative h-64 overflow-hidden border-b border-white/10">
          <NextImage src={currentImg} alt={ticket.movie} fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
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
            {state === 'countdown' ? (
              <TicketCountdownView key="countdown" timeLeft={timeLeft} />
            ) : state === 'qr' ? (
              <TicketQrView key="qr" ticketId={ticket.id} />
            ) : state === 'memory' ? (
              <TicketMemoryView key="memory" userRating={userRating} setUserRating={setUserRating} personalNote={personalNote} setPersonalNote={setPersonalNote} />
            ) : null}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-white/[0.02] relative text-right">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">תאריך</p><p className="text-sm text-white font-black">{ticket.date}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">שעה</p><p className="text-sm text-white font-black">{ticket.time}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">אולם</p><p className="text-sm text-white font-black">{ticket.hall}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">מושבים</p><p className="text-sm text-white font-black truncate">{ticket.seats.join(', ')}</p></div>
          </div>
        </div>
        </div>
      </motion.div>

      <div className="flex gap-3 justify-center w-full px-2 mt-4 z-10">
        {onEmail && (
          <button onClick={(e) => { e.stopPropagation(); onEmail(); }} disabled={isProcessingEmail} className="flex-1 py-3 px-4 rounded-2xl bg-[#0F0F0F]/60 backdrop-blur-xl hover:bg-white/10 text-xs font-black uppercase text-slate-300 border border-white/10 flex items-center justify-center gap-2">
            {isProcessingEmail ? <LoadingIndicator variant="spinner" size={16} color="#ff4500" label="שולח..." /> : <Mail className="w-4 h-4 text-primary" />}
            <span>שלח למייל</span>
          </button>
        )}
        {onDownload && (
          <button onClick={(e) => { e.stopPropagation(); onDownload(); }} disabled={isProcessingPDF} className="flex-1 py-3 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-xs font-black uppercase text-background flex items-center justify-center gap-2">
            {isProcessingPDF ? <LoadingIndicator variant="spinner" size={16} color="#000000" label="מוריד..." /> : <Download className="w-4 h-4 text-background" />}
            <span>PDF הורד</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
