'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldAlert, Gift, ArrowLeft } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import Link from 'next/link';

export const NotificationAiDigest: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadList = notifications.filter((n) => n.unread);
  const urgentList = notifications.filter((n) => n.priority === 'urgent');
  const offersList = notifications.filter((n) => n.type === 'offer');

  if (notifications.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="max-w-4xl mx-auto mb-8 overflow-hidden"
    >
      <div className="electric-movie-card relative rounded-[32px] p-[2px] shadow-[0_15px_40px_rgba(255,69,0,0.25)]">
        <div className="electric-card-inner p-6 md:p-7 rounded-[30px] bg-[#11090d]/95 border border-white/[0.04] backdrop-blur-3xl relative z-[1]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#ff4500] text-white rounded-xl shadow-[0_0_15px_rgba(255,69,0,0.6)]">
              <Sparkles size={18} />
            </div>
          <div>
            <h3 className="text-base font-black text-white font-outfit leading-tight">
              תקציר מנהלים חכם (AI Digest)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              ניתוח בזמן אמת של ההתראות והמשימות הפעילות בחשבונך
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {/* Unread Alert Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <ShieldAlert size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">התראות להצגה</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {unreadList.length > 0
                  ? `יש לך ${unreadList.length} התראות שלא נקראו.`
                  : 'כל ההתראות סומנו כנקראו.'}
              </div>
            </div>
          </div>

          {/* Urgent Items */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
            <div className="p-2 bg-[#FF1464]/20 text-[#FF1464] rounded-lg shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">אירועים דחופים</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {urgentList.length > 0
                  ? `${urgentList.length} עדכונים בדחיפות גבוהה.`
                  : 'אין אירועים קריטיים כעת.'}
              </div>
            </div>
          </div>

          {/* Active Offers */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg shrink-0">
              <Gift size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">הטבות פעילות</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {offersList.length > 0
                  ? `${offersList.length} קופונים והטבות מוכנות למימוש.`
                  : 'אין קופונים חדשים.'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick action link */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            המערכת מסנכרנת מול מנוע ההקרנות והקופונים
          </span>
          <Link
            href="/tickets"
            className="text-xs font-black text-[#FF1464] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>לכרטיסים שלי</span>
            <ArrowLeft size={14} />
          </Link>
        </div>
        </div>
      </div>
    </motion.div>
  );
};
