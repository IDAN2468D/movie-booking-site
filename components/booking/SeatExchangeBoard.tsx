'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeftRight, Check, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { getShowtimeSeatExchangesAction, acceptSeatExchangeAction } from '@/app/actions/seatExchangeActions';
import { SeatSwapRequestModal } from './SeatSwapRequestModal';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export interface SeatExchangeItem {
  _id: string;
  showtimeId: string;
  movieId: string;
  movieTitle: string;
  ticketId: string;
  requesterName: string;
  requesterAvatar?: string;
  currentSeatId: string;
  desiredTiers: string[];
  desiredRow?: string;
  bidDiffPrice: number;
  status: string;
}

export const SeatExchangeBoard: React.FC<{ showtimeId?: string; userTicketId?: string }> = ({
  showtimeId = 'showtime-101',
  userTicketId = 'user_tkt_active',
}) => {
  const [requests, setRequests] = useState<SeatExchangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fetchExchanges = async () => {
    setLoading(true);
    try {
      const res = await getShowtimeSeatExchangesAction(showtimeId);
      if (res.success && res.requests) {
        setRequests(res.requests as unknown as SeatExchangeItem[]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, [showtimeId]);

  const handleAccept = async (req: SeatExchangeItem) => {
    try {
      const res = await acceptSeatExchangeAction({
        requestId: req._id,
        acceptorUserId: 'usr_current',
        acceptorName: 'משתמש נוכחי',
        acceptorTicketId: userTicketId,
        acceptorSeatId: 'שורה 6, מושב 10',
      });

      if (res.success) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([30, 40, 30]);
        setSuccessNotice(res.message || 'החלפת המושבים בוצעה בהצלחה!');
        fetchExchanges();
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-6 shadow-2xl space-y-6 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit mb-2">
            <ArrowLeftRight className="w-3.5 h-3.5" /> לוח החלפת מושבים חכמה (P2P Seat Swap)
          </div>
          <h3 className="text-xl font-black text-white font-outfit">
            מעוניינים לשדרג או לשבת קרוב יותר?
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-inter">
            החליפו מושבים ישירות עם צופים אחרים באותו האולם בצורה מאובטחת ומסונכרנת לכרטיס.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> פרסם בקשת החלפה
        </button>
      </div>

      {successNotice && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> {successNotice}
        </motion.div>
      )}

      {loading ? (
        <div className="py-8 flex justify-center">
          <LoadingIndicator variant="spinner" size={24} color="#ff1464" label="טוען הצעות החלפה..." />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-xs">
          אין כרגע בקשות החלפה פתוחות להקרנה זו. היו הראשונים לפרסם הצעה!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req._id} className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white font-outfit">{req.requesterName}</h4>
                  <span className="text-[11px] text-zinc-400">מושב קיים: {req.currentSeatId}</span>
                </div>
                {req.bidDiffPrice > 0 && (
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                    תוספת: +₪{req.bidDiffPrice}
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-400 bg-white/5 p-2.5 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 block">מחפש מושב:</span>
                <p className="text-zinc-300 font-medium">
                  {req.desiredRow || req.desiredTiers.join(', ')}
                </p>
              </div>

              <button
                onClick={() => handleAccept(req)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-primary" /> אשר החלפה עם מושבי
              </button>
            </div>
          ))}
        </div>
      )}

      <SeatSwapRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showtimeId={showtimeId}
        onSuccess={fetchExchanges}
      />
    </div>
  );
};
