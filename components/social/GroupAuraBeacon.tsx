'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { CoWatchingMember } from '@/app/actions/coWatchingActions';

interface GroupAuraBeaconProps {
  member: CoWatchingMember;
  onPing?: () => void;
}

const MOOD_COLORS: { [key: string]: { border: string; glow: string; text: string; label: string } } = {
  hyped: { border: 'border-amber-400', glow: 'rgba(251,191,36,0.4)', text: 'text-amber-300', label: 'בהתרגשות שיא 🔥' },
  chill: { border: 'border-cyan-400', glow: 'rgba(34,211,238,0.4)', text: 'text-cyan-300', label: 'ציל & רגוע 🌊' },
  scared: { border: 'border-purple-400', glow: 'rgba(192,132,252,0.4)', text: 'text-purple-300', label: 'במתח גבוה ⚡' },
  emotional: { border: 'border-rose-400', glow: 'rgba(251,113,133,0.4)', text: 'text-rose-300', label: 'נסחף רגשית 🎭' },
  popcorn_ready: { border: 'border-emerald-400', glow: 'rgba(52,211,153,0.4)', text: 'text-emerald-300', label: 'מוכן עם פופקורן 🍿' },
};

export const GroupAuraBeacon: React.FC<GroupAuraBeaconProps> = ({ member, onPing }) => {
  const moodCfg = MOOD_COLORS[member.mood] || MOOD_COLORS.chill;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onPing}
      className="relative flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl p-3 backdrop-blur-xl cursor-pointer transition-all hover:border-white/20 shadow-lg"
    >
      <div className="relative mb-2">
        <div
          className={`w-14 h-14 rounded-full overflow-hidden border-2 ${moodCfg.border} p-0.5`}
          style={{ boxShadow: `0 0 20px ${moodCfg.glow}` }}
        >
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="absolute -bottom-1 -right-1">
          {member.isReady ? (
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black border border-white/20 shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-amber-500/80 flex items-center justify-center text-black border border-white/20 shadow">
              <Clock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      <span className="text-xs font-bold text-white truncate max-w-[90px]">{member.name}</span>
      <span className={`text-[10px] font-medium ${moodCfg.text} mt-0.5`}>{moodCfg.label}</span>
      {member.seatNumber && (
        <span className="mt-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-gray-300">
          {member.seatNumber}
        </span>
      )}
    </motion.div>
  );
};
