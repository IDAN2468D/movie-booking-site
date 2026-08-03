'use client';

import React, { useState } from 'react';
import { Crown, Sparkles, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const HolographicVIPPass: React.FC<{ tier?: 'silver' | 'gold' | 'platinum' | 'quantum_vip' }> = ({
  tier = 'quantum_vip'
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({ x: -y / 8, y: x / 8 });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  const tierGradients = {
    silver: 'from-slate-400 via-gray-200 to-slate-500 border-slate-300',
    gold: 'from-amber-300 via-yellow-500 to-amber-600 border-amber-400',
    platinum: 'from-cyan-300 via-teal-400 to-blue-600 border-cyan-300',
    quantum_vip: 'from-purple-500 via-pink-500 to-cyan-400 border-pink-400',
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-black/80 border border-purple-500/30 backdrop-blur-2xl text-white" dir="rtl">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-6 h-6 text-purple-400 animate-bounce" />
        <div>
          <h3 className="font-['Outfit'] text-lg font-bold text-purple-300">כרטיס VIP הולוגרפי דינמי</h3>
          <p className="text-xs text-gray-400">דרגת חברות המתפתחת לפי פעילות בקולנוע</p>
        </div>
      </div>

      <div className="perspective-1000">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX: rotate.x, rotateY: rotate.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`relative w-full h-56 rounded-3xl p-6 bg-gradient-to-tr ${tierGradients[tier]} border-2 shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col justify-between overflow-hidden transform-gpu cursor-pointer`}
        >
          {/* Shimmer Hologram Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 mix-blend-overlay pointer-events-none transform -skew-x-12 animate-pulse" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <span className="font-['Outfit'] font-black tracking-widest text-white text-sm">CINEPULSE PASS</span>
            </div>
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-purple-200 border border-white/20">
              QUANTUM VIP
            </span>
          </div>

          <div className="relative z-10 space-y-1">
            <p className="text-[10px] text-white/80 uppercase tracking-wider">מחזיק הכרטיס</p>
            <h4 className="font-bold text-white text-lg tracking-wide">ישראל ישראלי</h4>
            <p className="text-[11px] text-purple-100 font-mono">ID: #CP-8849-2026</p>
          </div>

          <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-3 text-[11px] text-white/90">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>מנוי VIP פעיל</span>
            </div>
            <span className="font-mono">EXP: 12/28</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
