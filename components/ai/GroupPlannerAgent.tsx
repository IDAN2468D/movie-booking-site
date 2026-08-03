'use client';

import React, { useState } from 'react';
import { Bot, Users, CreditCard, Popcorn, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const GroupPlannerAgent: React.FC = () => {
  const [groupMembers] = useState([
    { name: 'אלכס', pref: 'אקשן / מד"ב', diet: 'טבעוני' },
    { name: 'מאיה', pref: 'דרמה / מתח', diet: 'ללא גלוטן' },
    { name: 'דניאל', pref: 'קומדיה / מד"ב', diet: 'רגיל' }
  ]);

  const [aiRecommendation, setAiRecommendation] = useState({
    movie: 'Inception 2: Quantum Realm',
    time: '20:30 (אולם VIP IMAX)',
    splitPayPerPerson: 78,
    cateringCombo: 'פופקורן ענק + נאצ׳וס ללא גלוטן + קולה זירו'
  });

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-gradient-to-br from-gray-950 via-slate-900 to-black border border-cyan-500/30 backdrop-blur-2xl shadow-2xl text-white" dir="rtl">
      <div className="flex items-center gap-3 mb-6 border-b border-cyan-500/20 pb-4">
        <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
          <Bot className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <h3 className="font-['Outfit'] text-xl font-bold text-cyan-300">סוכן AI לתכנון קבוצתי & Split Pay</h3>
          <p className="text-xs text-gray-400">מתאם העדפות, מחשב תשלום מפוצל וממליץ על קייטרינג</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-sm">
            <Users className="w-4 h-4" />
            <span>חברי הקבוצה והעדפות:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {groupMembers.map((m, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-right">
                <p className="font-bold text-white">{m.name}</p>
                <p className="text-[10px] text-cyan-300">{m.pref}</p>
                <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded">
                  {m.diet}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900/60 border border-cyan-500/40 space-y-3"
        >
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>המלצת סוכן ה-AI האופטימלית:</span>
          </div>

          <div className="flex justify-between items-center bg-black/50 p-3 rounded-xl border border-white/10">
            <div>
              <p className="font-bold text-white text-sm">{aiRecommendation.movie}</p>
              <p className="text-xs text-gray-400">{aiRecommendation.time}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40">
              התאמה של 98%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-gray-400 block">Split Pay למשתתף</span>
                <span className="font-bold text-emerald-400 text-sm">₪{aiRecommendation.splitPayPerPerson}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
              <Popcorn className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-gray-400 block">קומבו קייטרינג מותאם</span>
                <span className="font-bold text-amber-300 text-[11px] truncate block max-w-[130px]" title={aiRecommendation.cateringCombo}>
                  {aiRecommendation.cateringCombo}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
