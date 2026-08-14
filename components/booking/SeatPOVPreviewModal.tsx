'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Volume2, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useSightlineCalculations } from '@/hooks/useSightlineCalculations';

interface SeatPOVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: string;
  movieTitle: string;
  hallName?: string;
}

export default function SeatPOVPreviewModal({
  isOpen,
  onClose,
  seatId,
  movieTitle,
  hallName = 'אולם IMAX Laser 1',
}: SeatPOVPreviewModalProps) {
  const { data } = useSightlineCalculations(seatId);
  const [activeTab, setActiveTab] = useState<'visual' | 'acoustic'>('visual');

  if (!isOpen) return null;

  const perspectiveAngle = data?.perspectiveAngle || 0;
  const pitchAngle = data?.pitchAngle || 12;
  const visibilityScore = data?.visibilityScore || 92;
  const isSweetSpot = Math.abs(perspectiveAngle) <= 6 && visibilityScore >= 88;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-[#0b0c14] border border-white/20 rounded-3xl p-6 shadow-2xl z-10 text-right text-white overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h3 className="text-xl font-black font-outfit">הדמיית שדה ראייה 3D POV</h3>
                {isSweetSpot && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">
                    המושב האקוסטי המושלם 💎
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">{movieTitle} • {hallName} • מושב {seatId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3D Cinema POV Simulation Viewport */}
          <div className="relative w-full h-56 rounded-2xl bg-black border border-white/15 overflow-hidden flex items-center justify-center mb-5" style={{ perspective: 900 }}>
            {/* Screen Glow */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />
            
            {/* 3D Curved Cinema Screen */}
            <motion.div
              animate={{
                rotateY: perspectiveAngle,
                rotateX: pitchAngle - 10,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="relative w-72 h-36 rounded-xl bg-gradient-to-b from-slate-900 via-neutral-900 to-black border-2 border-cyan-400/40 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
              <Eye className="w-10 h-10 text-cyan-400/60 mb-1 animate-pulse" />
              <span className="text-[10px] font-black text-cyan-300 tracking-widest uppercase">IMAX LASER SCREEN</span>
              <span className="text-[9px] text-white/40 font-mono mt-0.5">זווית צפייה: {Math.round(perspectiveAngle)}°</span>
            </motion.div>

            {/* Floating POV Compass Indicators */}
            <div className="absolute bottom-3 left-4 text-xs text-white/60 flex items-center gap-1.5 font-mono">
              <Compass size={13} className="text-cyan-400" />
              <span>מרחק מהמסך: {data?.distance?.toFixed(1) || '12.4'}m</span>
            </div>
            <div className="absolute bottom-3 right-4 text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
              <ShieldCheck size={13} />
              <span>איכות זווית: {visibilityScore}%</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="block text-[10px] text-white/40 font-bold">שדה ראייה (FOV)</span>
              <span className="text-sm font-black text-white font-mono mt-0.5">110° Wide</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="block text-[10px] text-white/40 font-bold">איזון סטריאו / אטמוס</span>
              <span className="text-sm font-black text-primary font-mono mt-0.5">Dolby 7.1.4</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="block text-[10px] text-white/40 font-bold">דירוג נוחות ראייה</span>
              <span className="text-sm font-black text-amber-400 font-mono mt-0.5">10/10 VIP</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-all"
          >
            <span>אישור וחזרה למפת המושבים</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
