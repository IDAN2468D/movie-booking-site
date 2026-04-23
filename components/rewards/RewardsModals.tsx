'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reward {
  id: number;
  title: string;
  desc: string;
  points: number;
  icon: React.ElementType;
  color: string;
}

interface Activity {
  movie: string;
  date: string;
  points: number;
}

interface RewardsModalsProps {
  showFullHistory: boolean;
  setShowFullHistory: (val: boolean) => void;
  showAllRewards: boolean;
  setShowAllRewards: (val: boolean) => void;
  bookings: Activity[];
  rewards: Reward[];
  totalPoints: number;
  redeemedId: number | null;
  setRedeemedId: (id: number | null) => void;
  mounted: boolean;
}

export const RewardsModals = ({
  showFullHistory, setShowFullHistory,
  showAllRewards, setShowAllRewards,
  bookings, rewards, totalPoints,
  redeemedId, setRedeemedId, mounted
}: RewardsModalsProps) => {
  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {showFullHistory && (
        <ModalWrapper onClose={() => setShowFullHistory(false)} title={<>היסטוריית <span className="text-primary">נקודות</span></>}>
          <div className="space-y-4 custom-scrollbar pr-2">
            {bookings.length === 0 ? (
              <div className="text-center py-20">
                 <p className="text-slate-500 font-bold">לא נמצאה היסטוריית פעילות</p>
              </div>
            ) : (
              bookings.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 border border-white/5 flex-row hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-6 flex-row">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                        <Zap size={24} />
                      </div>
                      <div className="text-right">
                        <p className="text-base text-white font-black">הזמנת סרט</p>
                        <p className="text-xs text-slate-500 font-bold">{activity.movie} • {activity.date}</p>
                      </div>
                  </div>
                  <div className="text-left">
                    <span className="text-xl font-black text-primary tracking-tighter">+{activity.points}</span>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">נקודות</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 p-8 border-t border-white/5 bg-white/5 rounded-b-[48px]">
             <div className="flex items-center justify-between flex-row">
                <p className="text-sm font-bold text-slate-400">סה&quot;כ נקודות מהזמנות</p>
                <p className="text-lg font-black text-white">{bookings.reduce((a, b) => a + b.points, 0).toLocaleString()}</p>
             </div>
          </div>
        </ModalWrapper>
      )}

      {showAllRewards && (
        <ModalWrapper 
          onClose={() => { setShowAllRewards(false); setRedeemedId(null); }} 
          title={<>קטלוג <span className="text-primary">הטבות</span></>}
          subtitle={<>יש לך <span className="text-primary font-black">{totalPoints.toLocaleString()}</span> נקודות זמינות</>}
        >
          <div className="space-y-4 custom-scrollbar pr-2">
            {rewards.map((reward) => {
              const canRedeem = totalPoints >= reward.points;
              const isRedeemed = redeemedId === reward.id;
              return (
                <div key={reward.id} className={`flex items-center justify-between p-6 rounded-[32px] border transition-all group ${
                  isRedeemed ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-primary/20'
                }`}>
                  <div className="flex items-center gap-6 flex-row">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
                      isRedeemed ? 'bg-green-500/20 text-green-400' : `bg-white/5 ${reward.color}`
                    }`}>
                      {isRedeemed ? <Check size={24} /> : <reward.icon size={24} />}
                    </div>
                    <div className="text-right">
                      <p className="text-base text-white font-black">{reward.title}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{reward.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <span className={`text-lg font-black tracking-tighter ${canRedeem ? 'text-primary' : 'text-slate-600'}`}>{reward.points.toLocaleString()}</span>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5">נקודות</p>
                    </div>
                    <button
                      onClick={() => {
                        if (canRedeem && !isRedeemed) setRedeemedId(reward.id);
                      }}
                      disabled={!canRedeem || isRedeemed}
                      className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        isRedeemed
                          ? 'bg-green-500/20 text-green-400 border border-green-500/20 cursor-default'
                          : canRedeem
                            ? 'bg-primary text-background hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'
                            : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {isRedeemed ? 'מומש ✓' : canRedeem ? 'מימוש' : 'לא מספיק'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </ModalWrapper>
      )}
    </AnimatePresence>,
    document.body
  );
};

const ModalWrapper = ({ children, onClose, title, subtitle }: { children: React.ReactNode, onClose: () => void, title: React.ReactNode, subtitle?: React.ReactNode }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 sm:p-12" dir="rtl">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/90 backdrop-blur-3xl" 
      onClick={onClose} 
    />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="relative w-full max-w-3xl bg-[#0D0D0D]/80 backdrop-blur-2xl rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(255,159,10,0.1)] overflow-hidden flex flex-col max-h-[85vh]"
    >
      <div className="p-10 border-b border-white/5 flex items-center justify-between flex-row">
        <div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-slate-500 transition-all hover:text-white">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-10">
        {children}
      </div>
    </motion.div>
  </div>
);
