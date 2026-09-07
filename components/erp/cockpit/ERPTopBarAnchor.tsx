'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, Sparkles } from 'lucide-react';
import { playCockpitTick } from './LiquidCockpitAudio';

interface ERPTopBarAnchorProps {
  currency: 'ILS' | 'USD';
  onCurrencyChange: (c: 'ILS' | 'USD') => void;
  taxRate: number;
  onTaxRateChange: (rate: number) => void;
}

export const ERPTopBarAnchor: React.FC<ERPTopBarAnchorProps> = ({
  currency,
  onCurrencyChange,
  taxRate,
  onTaxRateChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-4 p-5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_10px_35px_-10px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-white font-black uppercase tracking-wider text-sm font-['Outfit']">עוגן מס ומטבע גלובלי</h2>
          <p className="text-slate-400 text-xs">CinePulse Master Ledger Anchor</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/* Currency Switcher */}
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">מטבע בסיס:</span>
          <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                playCockpitTick(900);
                onCurrencyChange('ILS');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                currency === 'ILS'
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ILS ₪
            </button>
            <button
              onClick={() => {
                playCockpitTick(900);
                onCurrencyChange('USD');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                currency === 'USD'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD $
            </button>
          </div>
        </div>

        {/* VAT Rate Input */}
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">מע״מ / מס:</span>
          <div className="relative flex items-center">
            <input
              type="number"
              value={taxRate}
              onChange={(e) => onTaxRateChange(Math.max(0, Number(e.target.value)))}
              className="w-16 bg-black/60 border border-white/10 rounded-lg py-1 text-center text-white font-bold text-sm focus:outline-none focus:border-amber-400/50"
              dir="ltr"
            />
            <span className="absolute left-2 text-slate-500 text-xs pointer-events-none">%</span>
          </div>
        </div>

        {/* Live Ledger Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>סנכרון ראשי פעיל</span>
        </div>
      </div>
    </motion.div>
  );
};
