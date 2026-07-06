'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeviceGyroscope } from '@/hooks/useDeviceGyroscope';
import { Calendar, Clock, MapPin, QrCode, Sparkles, Compass } from 'lucide-react';

interface HolographicTicketProps {
  movieTitle: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  backdropPath?: string;
}

export default function HolographicTicket({
  movieTitle,
  date,
  time,
  hall,
  seats,
  backdropPath,
}: HolographicTicketProps) {
  const { success, data, requestPermission } = useDeviceGyroscope();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Desktop mouse movement fallback
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Compute 3D rotations (Gyroscope priority, Mouse fallback)
  const getRotations = () => {
    if (success && data && (Math.abs(data.smoothedBeta) > 0.5 || Math.abs(data.smoothedGamma) > 0.5)) {
      // Clamp rotations to prevent extreme flips
      const rotX = Math.min(Math.max(-data.smoothedBeta, -25), 25);
      const rotY = Math.min(Math.max(data.smoothedGamma, -25), 25);
      return { rotateX: rotX, rotateY: rotY };
    }
    // Mouse fallback
    return {
      rotateX: isHovered ? -mousePos.y * 30 : 0,
      rotateY: isHovered ? mousePos.x * 30 : 0,
    };
  };

  const { rotateX, rotateY } = getRotations();
  const gradientAngle = success && data ? data.gradientAngle : (135 + (mousePos.x * 90));

  return (
    <div className="relative w-full max-w-sm mx-auto my-6 select-none font-sans perspective-[1200px] preserve-3d">
      {/* iOS Gyroscope Permission activation banner */}
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
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{
          transformStyle: 'preserve-3d',
          '--glass-gradient-angle': `${gradientAngle}deg`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any}
        className="relative overflow-hidden rounded-[36px] p-6 text-white border border-white/20 shadow-2xl transition-all duration-300"
      >
        {/* Holographic shifting specular background */}
        <div
          className="absolute inset-0 -z-10 mix-blend-overlay opacity-30 transition-opacity group-hover:opacity-50 pointer-events-none"
          style={{
            background: `linear-gradient(var(--glass-gradient-angle, 135deg), rgba(255,20,100,0.8) 0%, rgba(34,211,238,0.8) 50%, rgba(249,115,22,0.8) 100%)`,
          }}
        />

        {/* Refractive blur backdrop */}
        <div
          className="absolute inset-0 -z-20 pointer-events-none"
          style={{
            background: 'rgba(15, 15, 25, 0.7)',
            backdropFilter: 'blur(30px) saturate(220%) brightness(110%)',
          }}
        />

        {/* Ambient image background */}
        {backdropPath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://image.tmdb.org/t/p/w500${backdropPath}`}
            alt=""
            className="absolute inset-0 -z-30 w-full h-full object-cover opacity-10 blur-sm pointer-events-none scale-110"
          />
        )}

        {/* Glowing holographic strips */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-400 to-amber-500 opacity-80" />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col justify-between h-[420px]" style={{ transform: 'translateZ(50px)' }}>
          {/* Header */}
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

          {/* Ticket Information */}
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
                <span className="text-xs font-black text-cyan-400">
                  {seats.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode & Security Signature */}
          <div className="flex flex-col items-center justify-center border-t border-white/10 pt-4 mt-auto">
            <div className="p-3 bg-white rounded-2xl shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              <QrCode size={70} className="text-black" />
            </div>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2">
              חתימה דיגיטלית: 8x9F2E-CYAN-CINE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
