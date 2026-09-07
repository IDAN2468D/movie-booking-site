'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, QrCode, Lock } from 'lucide-react';
import { playCockpitTick } from './LiquidCockpitAudio';

export const ERPSecurityRadar: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-black/50 backdrop-blur-2xl border border-red-500/25 rounded-[36px] p-7 shadow-[0_0_35px_rgba(239,68,68,0.12)] relative overflow-hidden flex flex-col justify-between"
      dir="rtl"
    >
      <div className="absolute top-0 start-0 w-36 h-36 bg-red-500/10 rounded-full blur-[70px] pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 rounded-2xl border border-red-500/30 text-red-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-['Outfit']">רדאר כוונות חריגות ואבטחה</h3>
            <p className="text-slate-400 text-xs">ניטור סריקות כפולות והגנת קופות</p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 relative z-10 flex-1">
        {/* Security Alert Item 1 */}
        <div
          onClick={() => playCockpitTick(750)}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 flex gap-3 cursor-pointer hover:bg-red-500/15 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0 animate-ping" />
          <div>
            <p className="text-red-200 text-xs font-bold">סריקת כרטיס כפולה נחסמה בשער 4</p>
            <p className="text-red-300/70 text-[11px] mt-0.5">כרטיס #CP-8842 נסרק פעמיים בטווח של 12 שניות. נחסם מיידית באולם IMAX.</p>
          </div>
        </div>

        {/* Security Alert Item 2 */}
        <div
          onClick={() => playCockpitTick(750)}
          className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex gap-3 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
          <div>
            <p className="text-slate-200 text-xs font-bold">אימות HMAC תקין בעמדות איסוף</p>
            <p className="text-slate-400 text-[11px] mt-0.5">כל 120 הסריקות האחרונות עברו אימות קריפטוגרפי מלא מול מפתח האולם.</p>
          </div>
        </div>
      </div>

      {/* Footer Firewall Guard Status */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>סטטוס חומת אש קופות:</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> מאובטח 100%
        </span>
      </div>
    </motion.div>
  );
};
