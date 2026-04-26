'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, Check, Copy, Gift } from 'lucide-react';
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
  const [isRedeeming, setIsRedeeming] = React.useState<number | null>(null);
  const [voucher, setVoucher] = React.useState<{ code: string; rewardTitle: string } | null>(null);

  const handleRedeem = async (reward: Reward) => {
    setIsRedeeming(reward.id);
    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: reward.id, points: reward.points }),
      });
      const result = await res.json();
      if (result.success) {
        setRedeemedId(reward.id);
        setVoucher({ code: result.data.code, rewardTitle: reward.title });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRedeeming(null);
    }
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {showFullHistory && (
        <ModalWrapper key="history" onClose={() => setShowFullHistory(false)} title={<>היסטוריית <span className="text-primary">נקודות</span></>}>
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
                <p className="text-lg font-black text-white">{bookings.reduce((a, b) => a + (b.points || 0), 0).toLocaleString()}</p>
             </div>
          </div>
        </ModalWrapper>
      )}

      {showAllRewards && (
        <ModalWrapper 
          key="rewards"
          onClose={() => { setShowAllRewards(false); setRedeemedId(null); setVoucher(null); }} 
          title={<>קטלוג <span className="text-primary">הטבות</span></>}
          subtitle={!voucher && <>יש לך <span className="text-primary font-black">{totalPoints.toLocaleString()}</span> נקודות זמינות</>}
        >
          {voucher ? (
            <SuccessView voucher={voucher} onClose={() => { setShowAllRewards(false); setVoucher(null); }} />
          ) : (
            <div className="space-y-4 custom-scrollbar pr-2">
              {rewards.map((reward) => {
                const canRedeem = totalPoints >= reward.points;
                const isRedeemed = redeemedId === reward.id;
                const loading = isRedeeming === reward.id;

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
                          if (canRedeem && !isRedeemed && !loading) handleRedeem(reward);
                        }}
                        disabled={!canRedeem || isRedeemed || loading}
                        className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap min-w-[100px] flex items-center justify-center ${
                          isRedeemed
                            ? 'bg-green-500/20 text-green-400 border border-green-500/20 cursor-default'
                            : canRedeem
                              ? 'bg-primary text-background hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'
                              : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        ) : isRedeemed ? (
                          'מומש ✓'
                        ) : canRedeem ? (
                          'מימוש'
                        ) : (
                          'לא מספיק'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          <h2 data-testid="modal-title" className="text-2xl font-black text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
        <button 
          data-testid="close-modal"
          onClick={onClose} 
          className="p-3 hover:bg-white/10 rounded-2xl text-slate-500 transition-all hover:text-white"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-10">
        {children}
      </div>
    </motion.div>
  </div>
);

const SuccessView = ({ voucher, onClose }: { voucher: { code: string; rewardTitle: string }; onClose: () => void }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-10"
    >
      <div className="w-24 h-24 bg-primary/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,159,10,0.2)]">
        <Gift className="text-primary" size={48} />
      </div>
      
      <h3 className="text-3xl font-black text-white mb-4">איזה כיף! ההטבה שלך מוכנה</h3>
      <p className="text-slate-400 mb-10 max-w-sm mx-auto">מימשת את ההטבה: <span className="text-white font-bold">{voucher.rewardTitle}</span>. הקוד מחכה לך כאן:</p>

      <div className="relative group max-w-sm mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center justify-between p-6 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl">
          <span className="text-2xl font-black tracking-[0.2em] text-white uppercase">{voucher.code}</span>
          <button 
            onClick={copyToClipboard}
            className="p-3 hover:bg-white/10 rounded-xl transition-all text-primary group-active:scale-95"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-12 mb-8">הקוד נשלח גם למייל שלך</p>

      <button 
        onClick={onClose}
        className="px-10 py-5 bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl text-white font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
      >
        סגור ומימוש הבא
      </button>
    </motion.div>
  );
};
