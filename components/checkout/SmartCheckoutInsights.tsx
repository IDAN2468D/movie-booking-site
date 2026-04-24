'use client';

import React from 'react';
import { Sparkles, TrendingDown, Users, Zap, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartCheckoutInsightsProps {
  movieTitle: string;
  totalAmount: number;
}

export default function SmartCheckoutInsights({ movieTitle, totalAmount }: SmartCheckoutInsightsProps) {
  const pointsEarned = Math.floor(totalAmount * 1.5);

  return (
    <div className="space-y-4" dir="rtl">
      {/* AI Suggestion Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[32px] p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -ml-12 -mt-12" />
        <div className="flex items-center gap-3 mb-4 flex-row-reverse">
          <Sparkles size={16} className="text-primary" />
          <h4 className="text-xs font-black text-white uppercase tracking-widest">תובנת AI להזמנה</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed text-right">
          ניתוח חכם של ההזמנה שלך עבור <span className="text-white font-bold">{movieTitle}</span> מצביע על כך שבחרת את המועד הכי משתלם. הוספנו לך הנחה אוטומטית של <span className="text-primary font-black">₪18.00</span> על חבילת הנשנושים.
        </p>
      </motion.div>

      {/* Social Proof & Urgency */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center text-center">
          <Users size={18} className="text-cyan-400 mb-2" />
          <p className="text-[10px] text-slate-500 font-bold mb-1">ביקוש גבוה</p>
          <p className="text-xs font-black text-white">12 אנשים צופים בסרט כרגע</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center text-center">
          <Gift size={18} className="text-pink-400 mb-2" />
          <p className="text-[10px] text-slate-500 font-bold mb-1">צבירת נקודות</p>
          <p className="text-xs font-black text-white">תצבור {pointsEarned} נקודות!</p>
        </div>
      </div>

      {/* Savings Highlight */}
      <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex-row-reverse">
        <div className="flex items-center gap-2 flex-row-reverse">
          <TrendingDown size={14} className="text-emerald-400" />
          <span className="text-[10px] font-black text-white">מבצע בלעדי למזמינים באתר</span>
        </div>
        <span className="text-xs font-black text-emerald-400">₪15.00-</span>
      </div>
    </div>
  );
}
