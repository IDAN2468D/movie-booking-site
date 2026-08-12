'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDeviceGyroscope } from '@/hooks/useDeviceGyroscope';
import { Calendar, Clock, MapPin, QrCode, Sparkles, Compass } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

interface HolographicTicketProps {
  movieTitle: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  backdropPath?: string;
  posterUrl?: string;
}

export default function HolographicTicket({
  movieTitle,
  date,
  time,
  hall,
  seats,
  backdropPath,
  posterUrl,
}: HolographicTicketProps) {
  const getFallbackImage = (title: string, path?: string) => {
    if (path && !path.includes('null') && !path.includes('undefined')) {
      return getImageUrl(path, 'w500');
    }
    return 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg';
  };

  const [bgImage] = useState(() => getFallbackImage(movieTitle, posterUrl || backdropPath));
  const { success, data, requestPermission } = useDeviceGyroscope();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });

    cardRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const getRotations = () => {
    if (success && data && (Math.abs(data.smoothedBeta) > 0.5 || Math.abs(data.smoothedGamma) > 0.5)) {
      const rotX = Math.min(Math.max(-data.smoothedBeta, -25), 25);
      const rotY = Math.min(Math.max(data.smoothedGamma, -25), 25);
      return { rotateX: rotX, rotateY: rotY };
    }
    return {
      rotateX: isHovered ? -mousePos.y * 30 : 0,
      rotateY: isHovered ? mousePos.x * 30 : 0,
    };
  };

  const { rotateX, rotateY } = getRotations();

  return (
    <div className="relative w-full max-w-sm mx-auto my-6 select-none font-sans perspective-[1200px] preserve-3d">
      {requestPermission && (
        <button
          onClick={requestPermission}
          className="mb-4 w-full py-2 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
        >
          <Compass size={12} className="animate-spin" />
          <span>אפשר חיישן גירוסקופ לטלפון נייד</span>
        </button>
      )}

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="group relative overflow-hidden rounded-[36px] p-[2px] text-white shadow-[0_0_35px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-300"
      >
        {/* Holographic Rotating Conic Gradient - Clipped */}
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,#06b6d4_0deg,#3b82f6_120deg,#8b5cf6_240deg,#06b6d4_360deg)] animate-[spin_8s_linear_infinite] opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative w-full h-full bg-slate-950/92 backdrop-blur-2xl rounded-[34px] p-6 overflow-hidden border border-white/10">
        {/* Dynamic Cursor-Tracked Radial Gradient Mask */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
          style={{
            background: 'radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), rgba(255, 159, 10, 0.95), rgba(6, 182, 212, 0.8), transparent 70%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <img
          src={bgImage}
          alt={movieTitle}
          className="absolute inset-0 -z-30 w-full h-full object-cover opacity-35 blur-xs pointer-events-none scale-105"
        />

        <div className="relative z-10 flex flex-col justify-between h-[400px]" style={{ transform: 'translateZ(50px)' }}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Sparkles size={10} className="animate-pulse" />
                <span>כרטיס הולוגרפי מאובטח</span>
              </span>
              <h2 className="text-xl font-black tracking-tight mt-1 font-display uppercase max-w-[220px] leading-tight">
                {movieTitle}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-cyan-400">
              HD
            </div>
          </div>

          <div className="space-y-4 my-6 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <Calendar size={14} className="text-slate-400" />
              <div className="flex flex-col text-right">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">תאריך הקרנה</span>
                <span className="text-xs font-black text-white">{date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-slate-400" />
              <div className="flex flex-col text-right">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">שעה ואולם</span>
                <span className="text-xs font-black text-white">{time} • {hall}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={14} className="text-slate-400" />
              <div className="flex flex-col text-right">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">מושבים מוזמנים</span>
                <span className="text-xs font-black text-cyan-400">{seats.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-t border-white/10 pt-4 mt-auto">
            <div className="p-3 bg-white rounded-2xl shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              <QrCode size={70} className="text-black" />
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
}
