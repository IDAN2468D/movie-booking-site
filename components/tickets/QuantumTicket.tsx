'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import NextImage from 'next/image';
import { Calendar, Clock, MapPin, QrCode, Sparkles, Heart, Film, Star, MessageSquare } from 'lucide-react';

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
  onEmail?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  isProcessingEmail?: boolean;
  isProcessingPDF?: boolean;
}

type TicketState = 'countdown' | 'qr' | 'memory';

export default function QuantumTicket({
  ticket,
  onEmail,
  onDownload,
  onShare,
  isProcessingEmail,
  isProcessingPDF
}: QuantumTicketProps) {
  const [ticketState, setTicketState] = useState<TicketState>('countdown');
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 40 });
  const [personalNote, setPersonalNote] = useState('');
  const [userRating, setUserRating] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt & Holographic Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 25 });

  const glintX = useSpring(useTransform(mouseX, [0, 100], [-100, 300]), { stiffness: 300, damping: 30 });
  const glintY = useSpring(useTransform(mouseY, [0, 100], [-100, 300]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
    mouseX.set((mouseXPos / width) * 100);
    mouseY.set((mouseYPos / height) * 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Simulating live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      layout
      ref={cardRef}
      whileHover={{ y: -12, scale: 1.03 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 14,
        mass: 0.8
      }}
      className="relative flex flex-col group w-full max-w-sm mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Main Ticket Card Wrapper */}
      <motion.div
        layout
        className="bg-black/50 backdrop-blur-[50px] border border-white/20 rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic metallic reflection simulation overlay */}
        <motion.div 
          className="absolute pointer-events-none opacity-20 transition-opacity group-hover:opacity-40 z-30 mix-blend-overlay duration-500 w-[300px] h-[300px] top-[-50px] left-[-50px] blur-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.25) 0%, transparent 70%)',
            x: glintX,
            y: glintY,
          }}
        />

        {/* Top Section: Movie/Art View */}
        <motion.div layout className="relative h-64 overflow-hidden border-b border-white/10">
          <NextImage
            src={ticket.image}
            alt={ticket.movie}
            fill
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 saturate-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          {/* Morphing Header Banner - Premium Sliding Glass Pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[92%] bg-black/85 backdrop-blur-2xl border border-white/10 p-1 rounded-2xl flex gap-1 shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
            {(['countdown', 'qr', 'memory'] as TicketState[]).map((state) => {
              const isActive = ticketState === state;
              return (
                <button
                  key={state}
                  onClick={() => setTicketState(state)}
                  className={`relative flex-1 py-2 px-1.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider text-center transition-colors duration-300 whitespace-nowrap focus:outline-none ${
                    isActive ? 'text-black font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTicketTab"
                      className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_15px_rgba(255,159,10,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <span className="relative z-10">
                    {state === 'countdown' && 'קדימון וזמן'}
                    {state === 'qr' && 'כרטיס כניסה'}
                    {state === 'memory' && 'קפסולת זיכרון'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-6 right-6 left-6 text-right z-25">
            <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md font-outfit truncate">
              {ticket.movie}
            </h3>
          </div>

          {/* Holographic shimmer strip */}
          <div className="absolute top-1/2 left-0 right-0 h-4 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 animate-pulse pointer-events-none" />
        </motion.div>

        {/* Middle Section: Morphing Interactive Area */}
        <div className="p-6 relative text-right flex-1 min-h-[220px]">
          <AnimatePresence mode="wait">
            {ticketState === 'countdown' && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex flex-col items-center justify-center h-full text-center py-4"
              >
                <span className="text-[11px] font-black text-primary tracking-[0.3em] uppercase">הספירה לאחור החלה</span>
                <div className="flex gap-4 items-center justify-center">
                  {[
                    { val: timeLeft.hours, label: 'שעות' },
                    { val: timeLeft.minutes, label: 'דקות' },
                    { val: timeLeft.seconds, label: 'שניות' },
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                        <span className="text-xl font-black font-mono text-white">
                          {unit.val.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold mt-1.5">{unit.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <Film size={12} className="text-primary animate-spin" />
                  הקרנה באולם פרימיום VIP
                </p>
              </motion.div>
            )}

            {ticketState === 'qr' && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full py-4 space-y-4"
              >
                <div className="p-4 bg-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.3)] relative overflow-hidden group/qr">
                  <QrCode size={100} className="text-black relative z-10" />
                  <div className="absolute inset-0 bg-primary/5 group-hover/qr:bg-primary/10 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">אנא הצג בכניסה לאולם</p>
                  <p className="text-xs text-primary font-black tracking-widest">{ticket.id.substring(0, 16).toUpperCase()}</p>
                </div>
              </motion.div>
            )}

            {ticketState === 'memory' && (
              <motion.div
                key="memory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-right py-2 h-full"
              >
                <span className="text-[11px] font-black text-yellow-400 tracking-[0.2em] uppercase block">זיכרון קולנועי</span>
                
                {/* Rating Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500">איך היה הסרט?</label>
                  <div className="flex gap-1 justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="text-yellow-400 transition-transform hover:scale-125"
                      >
                        <Star size={16} fill={userRating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Notes */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500">יומן חוויה אישי</label>
                  <div className="relative">
                    <textarea
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="איך הייתה החוויה שלך?"
                      className="w-full h-16 p-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors custom-scrollbar"
                    />
                    <MessageSquare size={12} className="text-slate-600 absolute bottom-2 left-2" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Perforated Divider stub */}
        <div className="h-6 bg-black/40 flex items-center justify-center overflow-hidden relative">
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#050505] rounded-full border-r border-white/10" />
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#050505] rounded-full border-l border-white/10" />
          <div className="w-[85%] h-[1px] border-t border-dashed border-white/20 opacity-30" />
        </div>

        {/* Bottom Section: Stub Info Details */}
        <div className="p-6 bg-white/[0.02] relative text-right">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6 text-xs">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                תאריך <Calendar size={10} className="text-primary" />
              </p>
              <p className="text-sm text-white font-black">{ticket.date}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                שעה <Clock size={10} className="text-primary" />
              </p>
              <p className="text-sm text-white font-black">{ticket.time}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                אולם <MapPin size={10} className="text-primary" />
              </p>
              <p className="text-sm text-white font-black">{ticket.hall}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                מושבים <Sparkles size={10} className="text-primary" />
              </p>
              <p className="text-sm text-white font-black truncate">{ticket.seats.join(', ')}</p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex gap-2 justify-end border-t border-white/5 pt-4">
            {onEmail && (
              <button
                onClick={onEmail}
                disabled={isProcessingEmail}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 text-[11px] font-black uppercase text-slate-300 hover:bg-white/10 hover:text-white transition-colors border border-white/5 active:scale-95 disabled:opacity-50"
              >
                {isProcessingEmail ? 'שולח...' : 'שלח למייל'}
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                disabled={isProcessingPDF}
                className="flex-1 py-2 px-3 rounded-xl bg-primary text-[11px] font-black uppercase text-background hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessingPDF ? 'יוצר...' : 'הורד כ-PDF'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
