'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ParticipantInput } from '@/lib/validations/group-sync';

interface ResonanceSphereViewProps {
  participants: ParticipantInput[];
  resonanceScore: number;
  mergedGlowColor: string;
  onToggleParticipantSync: (id: string) => void;
}

export const ResonanceSphereView: React.FC<ResonanceSphereViewProps> = ({
  participants,
  resonanceScore,
  mergedGlowColor,
  onToggleParticipantSync,
}) => {
  const isFullyMerged = resonanceScore >= 100;

  return (
    <div className="relative w-full h-80 rounded-3xl overflow-hidden flex items-center justify-center border border-white/10 bg-neutral-950/60 backdrop-blur-2xl shadow-2xl p-4 text-right" dir="rtl">
      {/* Specular Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at center, ${mergedGlowColor} 0%, transparent 75%)`,
          opacity: 0.3 + (resonanceScore / 100) * 0.5,
        }}
      />

      {/* Orbital Stage Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Outer Orbit Glass Rings */}
        <motion.div
          className="absolute w-64 h-64 rounded-full border border-white/10 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Central Merged Specular Core */}
        <motion.div
          className="relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center border border-white/30 backdrop-blur-xl bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          animate={{
            scale: isFullyMerged ? [1, 1.15, 1] : 1,
            boxShadow: isFullyMerged
              ? '0 0 60px rgba(168, 85, 247, 0.9)'
              : '0 0 30px rgba(56, 189, 248, 0.4)',
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="font-outfit text-3xl font-bold text-white tracking-widest">
            {resonanceScore}%
          </span>
          <span className="text-[11px] text-cyan-300 font-sans font-bold">
            {isFullyMerged ? 'סנכרון מלא' : 'מסתנכרן'}
          </span>
        </motion.div>

        {/* Floating Participant Aura Spheres */}
        {participants.map((p, idx) => {
          const angle = (idx / participants.length) * 2 * Math.PI;
          const distance = isFullyMerged ? 20 : 100;
          const xPos = Math.cos(angle) * distance;
          const yPos = Math.sin(angle) * distance;

          return (
            <motion.button
              key={p.id}
              onClick={() => onToggleParticipantSync(p.id)}
              className={`absolute z-20 w-14 h-14 rounded-full flex flex-col items-center justify-center border backdrop-blur-lg transition-colors cursor-pointer shadow-lg ${
                p.isSynced
                  ? 'border-purple-400 bg-purple-500/30 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                  : 'border-white/20 bg-white/5 text-neutral-400 hover:text-white'
              }`}
              animate={{
                x: xPos,
                y: yPos,
                scale: p.isSynced ? 1.1 : 0.95,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 14,
              }}
            >
              <span className="text-[11px] font-sans font-bold truncate max-w-[48px]">
                {p.nameHebrew}
              </span>
              <span className="text-[9px] font-mono opacity-80">
                {p.isSynced ? 'מחובר' : 'לחץ'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
