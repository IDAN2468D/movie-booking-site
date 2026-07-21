"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getExchangeRatesAction, ExchangeRates } from "@/app/actions/currencyActions";
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
    updateFiatAllocation,
    updateCryptoAllocation,
    updateLoyaltyAllocation,
  } = useExchangeStore();

  useEffect(() => {
    // Initial fetch of exchange rates
    const fetchRates = async () => {
      const res = await getExchangeRatesAction();
      if (res.success && res.data) {
        setRates(res.data);
      }
      setLoading(false);
    };
    
    // Simulate a $100 checkout for testing if it's 0
    if (totalAmountUsd === 0) setTotalAmount(100);
    
    fetchRates();
  }, [totalAmountUsd, setTotalAmount]);

  if (loading || !rates) {
    return (
      <div className="w-full h-40 flex items-center justify-center bg-black/20 rounded-3xl border border-white/10 animate-pulse">
        <p className="text-white/50 font-inter">Loading Singularity Matrix...</p>
      </div>
    );
  }

  // Calculate actual amounts
  const fiatAmount = (totalAmountUsd * fiatAllocation) * (rates.rates[fiatCurrency] || 1);
  const cryptoAmount = (totalAmountUsd * cryptoAllocation) * (rates.rates[cryptoCurrency] || 0);
  const loyaltyPoints = Math.floor((totalAmountUsd * loyaltyAllocation) * 100); // 1 USD = 100 Points

  const formatNumber = (num: number, isCrypto = false) => {
    if (isCrypto) return num.toFixed(6);
    return num.toFixed(2);
  };

  return (
    <div dir="rtl" className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <h2 className="text-white font-outfit text-2xl tracking-wide mb-2">פיצול תשלום קוונטי</h2>
      <div className="flex flex-col md:flex-row gap-3 w-full h-[300px]">
        
        {/* FIAT MODULE */}
        <motion.div 
          layout
          className="relative flex flex-col justify-between p-5 rounded-[24px] border border-white/20 backdrop-blur-md overflow-hidden bg-neutral-900/50"
          style={{ flex: Math.max(0.2, fiatAllocation) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-white/80 font-inter text-sm mb-1 uppercase">Fiat ({fiatCurrency})</h3>
            <p className="text-white font-outfit text-3xl font-bold">
              {fiatCurrency === "ILS" ? "₪" : "$"}{formatNumber(fiatAmount)}
            </p>
          </div>
          <input 
            type="range" min="0" max="1" step="0.05" 
            value={fiatAllocation} 
            onChange={(e) => updateFiatAllocation(parseFloat(e.target.value))}
            className="w-full accent-green-400 cursor-pointer relative z-10"
          />
        </motion.div>

        {/* CRYPTO MODULE */}
        <motion.div 
          layout
          className="relative flex flex-col justify-between p-5 rounded-[24px] border border-white/20 backdrop-blur-md overflow-hidden bg-neutral-900/50"
          style={{ flex: Math.max(0.2, cryptoAllocation) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-white/80 font-inter text-sm mb-1 uppercase">Crypto ({cryptoCurrency})</h3>
            <p className="text-white font-outfit text-2xl font-bold">
              {formatNumber(cryptoAmount, true)} {cryptoCurrency === "BTC" ? "₿" : "Ξ"}
            </p>
          </div>
          <input 
            type="range" min="0" max="1" step="0.05" 
            value={cryptoAllocation} 
            onChange={(e) => updateCryptoAllocation(parseFloat(e.target.value))}
            className="w-full accent-orange-400 cursor-pointer relative z-10"
          />
        </motion.div>

        {/* LOYALTY MODULE */}
        <motion.div 
          layout
          className="relative flex flex-col justify-between p-5 rounded-[24px] border border-white/20 backdrop-blur-md overflow-hidden bg-neutral-900/50"
          style={{ flex: Math.max(0.2, loyaltyAllocation) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-white/80 font-inter text-sm mb-1 uppercase">Pulse Points</h3>
            <p className="text-white font-outfit text-3xl font-bold">
              {loyaltyPoints} ✦
            </p>
          </div>
          <input 
            type="range" min="0" max="1" step="0.05" 
            value={loyaltyAllocation} 
            onChange={(e) => updateLoyaltyAllocation(parseFloat(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer relative z-10"
          />
        </motion.div>
      </div>

      <div className="flex justify-between items-center px-4 py-2 mt-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
        <p className="text-white/70 font-inter text-sm">סה"כ לתשלום ערך קוונטי</p>
        <p className="text-white font-outfit font-bold text-lg">${totalAmountUsd.toFixed(2)} USD</p>
      </div>
    </div>
  );
}
