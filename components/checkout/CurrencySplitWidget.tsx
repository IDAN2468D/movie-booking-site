"use client";

import React, { useState, useEffect } from 'react';
import { getCurrencyRatesAction } from '@/app/actions/getCurrencyRatesActions';

interface CurrencySplitWidgetProps {
  totalIls: number;
}

export const CurrencySplitWidget: React.FC<CurrencySplitWidgetProps> = ({ totalIls }) => {
  const [fiatPct, setFiatPct] = useState(50);
  const [cryptoPct, setCryptoPct] = useState(30);
  const [vipPct, setVipPct] = useState(20);
  const [result, setResult] = useState<{
    fiatAmount: number;
    cryptoBtcAmount: number;
    vipPointsNeeded: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fRatio = fiatPct / 100;
    const cRatio = cryptoPct / 100;
    const vRatio = vipPct / 100;

    getCurrencyRatesAction({
      totalAmountIls: totalIls,
      fiatRatio: fRatio,
      cryptoRatio: cRatio,
      vipPointsRatio: vRatio,
    }).then((res) => {
      if (res.success && res.data) {
        setResult(res.data);
        setErrorMsg(null);
      } else {
        setErrorMsg(res.error || 'שגיאה בפיצול');
      }
    });
  }, [totalIls, fiatPct, cryptoPct, vipPct]);

  return (
    <div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] text-white" dir="rtl">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
        <h4 className="font-['Outfit'] text-lg font-bold text-emerald-400">
          🪙 פיצול תשלום — Multi-Currency
        </h4>
        <span className="font-mono text-sm text-neutral-300">סה&quot;כ: ₪{totalIls}</span>
      </div>

      {/* Sliders for Payment Split */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
            <span>אשראי (Fiat ILS)</span>
            <span>{fiatPct}% (₪{result?.fiatAmount ?? 0})</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={fiatPct}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFiatPct(val);
              const rem = 100 - val;
              setCryptoPct(Math.round(rem * 0.6));
              setVipPct(Math.round(rem * 0.4));
            }}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
            <span>קריפטו (BTC)</span>
            <span>{cryptoPct}% ({result?.cryptoBtcAmount ?? 0} BTC)</span>
          </div>
          <input
            type="range"
            min={0}
            max={100 - fiatPct}
            value={cryptoPct}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCryptoPct(val);
              setVipPct(100 - fiatPct - val);
            }}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
            <span>נקודות VIP Pulse</span>
            <span>{vipPct}% ({result?.vipPointsNeeded ?? 0} pts)</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full transition-all" style={{ width: `${vipPct}%` }} />
          </div>
        </div>
      </div>

      {errorMsg ? (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs">{errorMsg}</div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-mono text-center">
          ⚡ שער ההמרה נעול ל-10 דקות כחלק מאחריות ה-Multi-Currency Engine
        </div>
      )}
    </div>
  );
};
