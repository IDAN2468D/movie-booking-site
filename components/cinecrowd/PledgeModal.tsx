'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Sparkles, Plus, Minus, CheckCircle } from 'lucide-react';
import { CampaignData } from './CrowdCampaignCard';
import { pledgeCrowdCampaignAction } from '@/app/actions/crowdScreeningActions';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface Props {
  campaign: CampaignData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PledgeModal: React.FC<Props> = ({ campaign, onClose, onSuccess }) => {
  const [seatsCount, setSeatsCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!campaign) return null;
  const totalPrice = seatsCount * campaign.ticketPrice;

  const handlePledge = async () => {
    setIsSubmitting(true);
    try {
      const res = await pledgeCrowdCampaignAction({
        campaignId: campaign._id,
        userId: "usr_active_session",
        userName: "אורח CinePulse",
        seatsCount,
        paymentIntentId: "hold_auth_mock_" + Date.now(),
      });

      if (res.success) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([40, 50, 40]);
        setIsDone(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1400);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl text-right overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5">
            <X className="w-5 h-5" />
          </button>

          {isDone ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-black text-white font-outfit">ההתחייבות נרשמה בהצלחה!</h3>
              <p className="text-xs text-zinc-400">החיוב יבוצע בפועל רק עם השגת יעד המשתתפים המלא.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  התחייבות להקרנת קהילה
                </span>
                <h2 className="text-xl font-black text-white font-outfit mt-1.5 line-clamp-1">
                  {campaign.movieTitle}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  {campaign.branchName} • יעד: {campaign.minThreshold} כרטיסים
                </p>
              </div>

              {/* Seats Stepper */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">כמות מושבים</span>
                  <span className="text-xs text-zinc-500">₪{campaign.ticketPrice} למושב</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setSeatsCount(Math.max(1, seatsCount - 1))}
                    disabled={seatsCount <= 1}
                    className="p-1 hover:text-primary disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-black text-white w-6 text-center">{seatsCount}</span>
                  <button
                    onClick={() => setSeatsCount(Math.min(10, seatsCount + 1))}
                    disabled={seatsCount >= 10}
                    className="p-1 hover:text-primary disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total & Security Note */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 font-medium">סך הכל בהתחייבות:</span>
                  <span className="text-2xl font-black text-white font-outfit">₪{totalPrice}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-cyan-950/30 border border-cyan-500/20 p-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>כרטיס האשראי ישוריין ללא חיוב. החיוב יתבצע רק כאשר הקמפיין יגיע ל-100% תומכים.</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handlePledge}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-black text-sm shadow-[0_0_20px_rgba(255,20,100,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <LoadingIndicator variant="spinner" size={18} color="#ffffff" label="מאשר התחייבות..." />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> אשר שריון מושבים
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
