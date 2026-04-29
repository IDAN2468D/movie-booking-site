'use client';

import React from 'react';
import { TrendingDown, Users, Gift, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartCheckoutInsightsProps {
  movieTitle: string;
  totalAmount: number;
}

export default function SmartCheckoutInsights({ movieTitle, totalAmount }: SmartCheckoutInsightsProps) {
  const pointsEarned = Math.floor(totalAmount * 1.5);

  return (
    <div className="space-y-4" dir="rtl">
      {/* AI Insight Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-[32px] p-6 relative overflow-hidden group border border-[#FF1464]/[0.12]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,20,100,0.04), rgba(255,20,100,0.01), transparent)',
        }}
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF1464]/[0.06] rounded-full blur-[60px] -ml-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="flex items-center gap-2.5 mb-4 flex-row-reverse">
          <div className="w-7 h-7 bg-[#FF1464]/10 rounded-lg flex items-center justify-center border border-[#FF1464]/20">
            <Brain size={14} className="text-[#FF1464]" />
          </div>
          <h4 className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] font-anton">AI CHECKOUT INSIGHT</h4>
        </div>
        
        <p className="text-xs text-white/50 leading-relaxed text-right font-rubik">
          ניתוח חכם של ההזמנה שלך עבור <span className="text-white font-black">{movieTitle}</span> מצביע על כך שבחרת את המועד הכי משתלם. הוספנו לך הנחה אוטומטית של <span className="text-[#E5FF00] font-black font-anton">₪18.00</span> על חבילת הנשנושים.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-all"
        >
          <Users size={18} className="text-[#0AEFFF] mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-[9px] text-white/25 font-black uppercase tracking-widest mb-2 font-anton">HIGH DEMAND</p>
          <p className="text-[11px] font-black text-white/60 font-rubik leading-tight">12 אנשים צופים כרגע</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-all"
        >
          <Gift size={18} className="text-[#FF1464] mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-[9px] text-white/25 font-black uppercase tracking-widest mb-2 font-anton">POINTS EARNED</p>
          <p className="text-[11px] font-black text-white/60 font-rubik leading-tight">תצבור <span className="text-[#E5FF00] font-anton">{pointsEarned}</span> נקודות!</p>
        </motion.div>
      </div>

      {/* Savings Highlight */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-between p-4 border border-[#00FF85]/[0.12] rounded-[20px] flex-row-reverse group hover:bg-[#00FF85]/[0.03] transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,133,0.03), transparent)',
        }}
      >
        <div className="flex items-center gap-2.5 flex-row-reverse">
          <TrendingDown size={14} className="text-[#00FF85]" />
          <span className="text-[10px] font-black text-white/60 font-rubik">מבצע בלעדי למזמינים באתר</span>
        </div>
        <span className="text-sm font-black text-[#00FF85] font-anton">₪15.00-</span>
      </motion.div>
    </div>
  );
}
