"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Bitcoin, Sparkles, Sliders, ShieldCheck } from "lucide-react";
import { getExchangeRatesAction } from "@/app/actions/currencyActions";
import type { ExchangeRates } from "@/lib/validations/currencySplit";
import { useExchangeStore } from "@/lib/store/useExchangeStore";

export function PaymentSingularityMatrix() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    totalAmountUsd,
    fiatAllocation,
    cryptoAllocation,
    loyaltyAllocation,
    fiatCurrency,
    cryptoCurrency,
    setTotalAmount,
    setFiatCurrency,
    setCryptoCurrency,
    updateFiatAllocation,
    updateCryptoAllocation,
    updateLoyaltyAllocation,
  } = useExchangeStore();

  useEffect(() => {
    const fetchRates = async () => {
      const res = await getExchangeRatesAction();
      if (res.success && res.data) {
        setRates(res.data);
      }
      setLoading(false);
    };

    if (totalAmountUsd === 0) setTotalAmount(100);
    fetchRates();
  }, [totalAmountUsd, setTotalAmount]);

  if (loading || !rates) {
    return (
      <div className="w-full p-8 bg-neutral-950/60 rounded-3xl border border-white/10 text-center animate-pulse">
        <p className="text-sm text-white/50 font-mono">טוען מטריצת פיצול קוונטי...</p>
      </div>
    );
  }

  const fiatRate = rates.rates[fiatCurrency] || 1;
  const cryptoRate = rates.rates[cryptoCurrency] || 0.000015;

  const fiatAmount = totalAmountUsd * fiatAllocation * fiatRate;
  const cryptoAmount = totalAmountUsd * cryptoAllocation * cryptoRate;
  const loyaltyPoints = Math.floor(totalAmountUsd * loyaltyAllocation * 100);

  const fiatPct = Math.round(fiatAllocation * 100);
  const cryptoPct = Math.round(cryptoAllocation * 100);
  const loyaltyPct = Math.round(loyaltyAllocation * 100);

  const handlePresetSplit = (type: "fiat" | "half" | "crypto") => {
    if (type === "fiat") {
      updateFiatAllocation(1.0);
    } else if (type === "half") {
      updateFiatAllocation(0.5);
      updateCryptoAllocation(0.5);
    } else if (type === "crypto") {
      updateCryptoAllocation(1.0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-6 sm:p-8 bg-neutral-950/85 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col gap-6" dir="rtl">
      {/* Header & Quick Presets */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-1">
            <Sliders className="w-4 h-4 animate-pulse" />
            <span>מטריצת תשלום קוונטי</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-outfit font-bold text-white">
            פיצול תשלום קוונטי
          </h2>
        </div>

        {/* Quick Split Action Buttons */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl border border-white/10 p-1 rounded-2xl">
          <button
            onClick={() => handlePresetSplit("fiat")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            100% פיאט
          </button>
          <button
            onClick={() => handlePresetSplit("half")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            50/50 חצי
          </button>
          <button
            onClick={() => handlePresetSplit("crypto")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500/10 transition-all"
          >
            100% קריפטו
          </button>
        </div>
      </div>

      {/* Responsive Grid Modules (3 Equal Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* FIAT MODULE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-neutral-900/60 to-neutral-950/80 shadow-[0_10px_30px_rgba(16,185,129,0.15)] flex flex-col justify-between overflow-hidden gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white/80 font-mono uppercase">FIAT</span>
            </div>
            <button
              onClick={() => setFiatCurrency(fiatCurrency === "USD" ? "ILS" : "USD")}
              className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg text-[10px] font-bold text-emerald-300 transition-all"
            >
              {fiatCurrency} 🔄
            </button>
          </div>

          <div>
            <div className="text-2xl font-bold font-outfit text-white truncate">
              {fiatCurrency === "ILS" ? "₪" : "$"}{fiatAmount.toFixed(2)}
            </div>
            <span className="text-xs text-emerald-400 font-mono font-semibold">{fiatPct}% מההזמנה</span>
          </div>

          <input
            type="range" min="0" max="1" step="0.05"
            value={fiatAllocation}
            onChange={(e) => updateFiatAllocation(parseFloat(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg"
          />
        </motion.div>

        {/* CRYPTO MODULE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-neutral-900/60 to-neutral-950/80 shadow-[0_10px_30px_rgba(245,158,11,0.15)] flex flex-col justify-between overflow-hidden gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bitcoin className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white/80 font-mono uppercase">CRYPTO</span>
            </div>
            <button
              onClick={() => setCryptoCurrency(cryptoCurrency === "BTC" ? "ETH" : "BTC")}
              className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-[10px] font-bold text-amber-300 transition-all"
            >
              {cryptoCurrency} 🔄
            </button>
          </div>

          <div>
            <div className="text-xl font-bold font-outfit text-white truncate">
              {cryptoAmount.toFixed(6)} {cryptoCurrency === "BTC" ? "₿" : "Ξ"}
            </div>
            <span className="text-xs text-amber-400 font-mono font-semibold">{cryptoPct}% מההזמנה</span>
          </div>

          <input
            type="range" min="0" max="1" step="0.05"
            value={cryptoAllocation}
            onChange={(e) => updateCryptoAllocation(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-white/10 rounded-lg"
          />
        </motion.div>

        {/* PULSE POINTS MODULE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-500/10 via-neutral-900/60 to-neutral-950/80 shadow-[0_10px_30px_rgba(168,85,247,0.15)] flex flex-col justify-between overflow-hidden gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white/80 font-mono uppercase">POINTS</span>
            </div>
            <span className="text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-500/30">
              VIP
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-outfit text-white truncate">
              {loyaltyPoints.toLocaleString()} ✦
            </div>
            <span className="text-xs text-purple-400 font-mono font-semibold">{loyaltyPct}% מההזמנה</span>
          </div>

          <input
            type="range" min="0" max="1" step="0.05"
            value={loyaltyAllocation}
            onChange={(e) => updateLoyaltyAllocation(parseFloat(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-2 bg-white/10 rounded-lg"
          />
        </motion.div>
      </div>

      {/* Summary Footer Bar */}
      <div className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-white/60 font-inter">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>שערי חליפין נעולים בזמן אמת</span>
        </div>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <span className="text-xs text-white/60">סה"כ לתשלום:</span>
          <span className="text-lg font-bold font-mono text-white">
            ${totalAmountUsd.toFixed(2)} USD
          </span>
        </div>
      </div>
    </div>
  );
}
