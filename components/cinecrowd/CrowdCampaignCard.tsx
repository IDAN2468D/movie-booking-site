'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import Image from 'next/image';

export interface CampaignData {
  _id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  genre: string;
  branchName: string;
  targetDate: string;
  minThreshold: number;
  currentBackers: number;
  totalSeatsPledged: number;
  ticketPrice: number;
  status: 'funding' | 'confirmed' | 'cancelled';
  creatorName: string;
  expiresAt: string;
}

interface Props {
  campaign: CampaignData;
  onPledgeClick: (campaign: CampaignData) => void;
}

export const CrowdCampaignCard: React.FC<Props> = ({ campaign, onPledgeClick }) => {
  const percent = Math.min(100, Math.round((campaign.currentBackers / campaign.minThreshold) * 100));
  const isConfirmed = campaign.status === 'confirmed' || percent >= 100;
  const formattedDate = new Date(campaign.targetDate).toLocaleDateString('he-IL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/70 backdrop-blur-xl shadow-2xl p-5 flex flex-col justify-between"
      dir="rtl"
    >
      <div className="relative h-56 rounded-2xl overflow-hidden mb-4 border border-white/5">
        <Image
          src={campaign.moviePoster}
          alt={campaign.movieTitle}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg">
          {isConfirmed ? (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> ההקרנה אושרה!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5 animate-pulse" /> בגיוס המונים
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 left-3 flex justify-between items-end">
          <div>
            <span className="text-[11px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              {campaign.genre}
            </span>
            <h3 className="text-lg font-black text-white font-outfit mt-1 line-clamp-1 drop-shadow-md">
              {campaign.movieTitle}
            </h3>
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="space-y-3 mb-4 text-xs text-zinc-300">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" /> {campaign.branchName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {formattedDate}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-zinc-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" /> {campaign.currentBackers} מתוך {campaign.minThreshold} תומכים
            </span>
            <span className={isConfirmed ? "text-emerald-400 font-extrabold" : "text-primary font-extrabold"}>
              {percent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${isConfirmed ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-primary to-orange-500 shadow-[0_0_12px_rgba(255,20,100,0.5)]'}`}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div>
          <span className="text-[10px] text-zinc-400 block">מחיר מושב בהתחייבות</span>
          <span className="text-base font-black text-white font-outfit">₪{campaign.ticketPrice}</span>
        </div>

        <button
          onClick={() => onPledgeClick(campaign)}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            isConfirmed
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white shadow-[0_0_15px_rgba(255,20,100,0.3)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isConfirmed ? 'הצטרף להקרנה המאושרת' : 'תמוך בקמפיין (Pledge)'}
        </button>
      </div>
    </motion.div>
  );
};
