'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SeatAcousticProfile } from '@/lib/schemas/acousticSweetspot.schema';
import { Volume2, Activity, ShieldCheck, Waves } from 'lucide-react';

interface SpeakerImmersionGaugeProps {
  profile: SeatAcousticProfile | null;
}

export function SpeakerImmersionGauge({ profile }: SpeakerImmersionGaugeProps) {
  if (!profile) {
    return (
      <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 text-center">
        <p className="text-sm text-off-white/40">בחר מושב לצפייה במדדי סאונד והיקפיות</p>
      </div>
    );
  }

  const isSweetSpot = profile.sweetSpotRating === 'EXCELLENT' || profile.sweetSpotRating === 'OPTIMAL';
  const badgeColor = isSweetSpot ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' : 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';

  return (
    <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-3xl border border-white/15 shadow-2xl space-y-5 text-right" dir="rtl">
      {/* Header with Rating Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Volume2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white font-rubik">מושב {profile.seatId}</h3>
            <p className="text-[11px] text-off-white/60">שורה {profile.row}, מספר {profile.number}</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black border ${badgeColor}`}>
          {profile.sweetSpotRating === 'EXCELLENT' ? '🏆 נקודת הזהב' : profile.sweetSpotRating === 'OPTIMAL' ? '✨ סאונד אופטימלי' : 'שמע היקפי'}
        </span>
      </div>

      {/* Immersion Score Radial / Progress */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-off-white/70 flex items-center gap-1.5">
            <Activity size={14} className="text-primary" />
            מדד שיקוע מרחבי (Immersion Score)
          </span>
          <span className="text-xl font-black text-primary font-rubik">{profile.immersionScore}%</span>
        </div>
        <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profile.immersionScore}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-gradient-to-r from-cyan-500 via-primary to-amber-400 rounded-full"
          />
        </div>
      </div>

      {/* Acoustic Parameters Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-off-white/40 flex items-center gap-1">
            <Waves size={12} className="text-cyan-400" />
            זמן הדהוד (RT60)
          </span>
          <p className="text-sm font-black text-white">{profile.reverbTimeSec} שניות</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-off-white/40 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" />
            בהירות דיאלוג
          </span>
          <p className="text-sm font-black text-white">{profile.dialogueIntelligibility}%</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-off-white/40">סאב-באס 35Hz</span>
          <p className="text-sm font-black text-white">{profile.bassClarityIndex}% עוצמה</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-off-white/40">מרחק לסאבוופר</span>
          <p className="text-sm font-black text-white">{profile.speakerDistances.subwoofer} מ׳</p>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
        💡 {profile.recommendedPerk}
      </div>
    </div>
  );
}
