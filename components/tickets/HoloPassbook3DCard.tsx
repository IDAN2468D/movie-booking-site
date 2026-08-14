'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, QrCode, Sparkles, Smartphone, Download, CheckCircle2, Lock } from 'lucide-react';

interface HoloPassbook3DCardProps {
  ticketId: string;
  movieTitle: string;
  seats: string[];
  date: string;
  time: string;
  hall: string;
  price: number;
}

export default function HoloPassbook3DCard({
  ticketId,
  movieTitle,
  seats,
  date,
  time,
  hall,
  price,
}: HoloPassbook3DCardProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [qrSeconds, setQrSeconds] = useState(30);
  const [walletAdded, setWalletAdded] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 3D Physics tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // QR Refresh Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setQrSeconds((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startHold = () => {
    if (isUnlocked) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(30);
    let p = 0;
    holdTimerRef.current = setInterval(() => {
      p += 15;
      setHoldProgress(p);
      if (p >= 100) {
        clearInterval(holdTimerRef.current!);
        setIsUnlocked(true);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([40, 60, 100]);
      }
    }, 80);
  };

  const endHold = () => {
    if (holdTimerRef.current && !isUnlocked) {
      clearInterval(holdTimerRef.current);
      setHoldProgress(0);
    }
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(50);
    setTimeout(() => setWalletAdded(false), 3500);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-md mx-auto my-4 text-right" dir="rtl">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative rounded-3xl p-6 bg-gradient-to-br from-neutral-950/90 via-black/80 to-purple-950/40 border border-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden transition-shadow duration-300 hover:shadow-cyan-500/20"
      >
        {/* Chromatic Liquid Hologram Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-amber-500/10 pointer-events-none mix-blend-color-dodge" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
            <span className="text-xs font-black tracking-widest text-cyan-300 font-mono">CINEPULSE PASSBOOK</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/10 text-white/80 border border-white/10 font-mono">
            #{ticketId.slice(0, 8)}
          </span>
        </div>

        {/* Movie Info */}
        <div className="relative z-10 mb-5">
          <h3 className="text-2xl font-black text-white font-outfit mb-1 drop-shadow-md">{movieTitle}</h3>
          <div className="flex items-center gap-3 text-xs text-white/60 font-medium">
            <span>📅 {date}</span>
            <span>•</span>
            <span>⏰ {time}</span>
            <span>•</span>
            <span className="text-primary font-bold">{hall}</span>
          </div>
        </div>

        {/* Seats & Price Pill */}
        <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="block text-[10px] text-white/40 font-bold">מושבים שנבחרו</span>
            <span className="text-sm font-black text-amber-400 font-mono">{seats.join(', ')}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="block text-[10px] text-white/40 font-bold">מחיר כרטיס כולל</span>
            <span className="text-sm font-black text-emerald-400 font-mono">₪{price}</span>
          </div>
        </div>

        {/* Dynamic Rolling QR / Biometric Gate */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center relative z-10 mb-4">
          {isUnlocked ? (
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white rounded-2xl shadow-lg relative mb-2">
                <QrCode size={110} className="text-black" />
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-black">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-black">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>מתרענן בעוד {qrSeconds} שניות</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <motion.button
                onPointerDown={startHold}
                onPointerUp={endHold}
                onPointerLeave={endHold}
                whileTap={{ scale: 0.94 }}
                className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-lg shadow-primary/20 cursor-pointer mb-2"
              >
                <Lock size={24} />
              </motion.button>
              <div className="w-36 bg-white/10 h-1.5 rounded-full overflow-hidden mb-1">
                <div className="bg-primary h-full transition-all duration-75" style={{ width: `${holdProgress}%` }} />
              </div>
              <span className="text-[11px] text-white/60 font-bold">לחץ והחזק להפעלת כרטיס הכניסה</span>
            </div>
          )}
        </div>

        {/* Wallet Actions */}
        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={handleAddToWallet}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {walletAdded ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Smartphone size={14} className="text-cyan-400" />}
            <span>{walletAdded ? 'נוסף ל-Apple Wallet 💎' : 'הוסף ל-Apple / Google Wallet'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
