'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight, Sparkles } from 'lucide-react';
import { createSeatExchangeRequestAction } from '@/app/actions/seatExchangeActions';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  showtimeId: string;
  onSuccess: () => void;
}

export const SeatSwapRequestModal: React.FC<Props> = ({ isOpen, onClose, showtimeId, onSuccess }) => {
  const [currentSeat, setCurrentSeat] = useState('שורה 5, מושב 8');
  const [desiredRow, setDesiredRow] = useState('שורה 7-9 (מרכז האולם)');
  const [bidDiffPrice, setBidDiffPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createSeatExchangeRequestAction({
        showtimeId,
        movieId: 'dune-2',
        movieTitle: 'חולית: חלק 2',
        ticketId: 'tkt_mock_' + Date.now(),
        requesterUserId: 'usr_me',
        requesterName: 'צופה CinePulse',
        currentSeatId: currentSeat,
        desiredTiers: ['VIP', 'PRIME'],
        desiredRow,
        bidDiffPrice: Number(bidDiffPrice),
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
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
          className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl text-right"
        >
          <button onClick={onClose} className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-black text-white font-outfit mb-4 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-primary" /> פרסום הצעת החלפת מושב
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">המושב הקיים שלך</label>
              <input
                type="text"
                required
                value={currentSeat}
                onChange={(e) => setCurrentSeat(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">העדפת מיקום / שורות מבוקשות</label>
              <input
                type="text"
                required
                placeholder="למשל: שורות מרכזיות 7-9, מושבי אמצע..."
                value={desiredRow}
                onChange={(e) => setDesiredRow(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">תוספת מחיר מוצעת לשדרוג (₪)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={bidDiffPrice}
                onChange={(e) => setBidDiffPrice(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                הוספת תמריץ כספי מעלה את סיכויי ההחלפה עם צופים אחרים.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-black text-sm shadow-[0_0_20px_rgba(255,20,100,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <LoadingIndicator variant="spinner" size={18} color="#ffffff" label="מפרסם הצעה..." />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> פרסם הצעת החלפה ללוח
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
