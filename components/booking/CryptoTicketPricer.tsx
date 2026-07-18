'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';
import { useCryptoPricing } from '@/hooks/useCryptoPricing';
import { useWalletStore } from '@/lib/store/walletStore';

interface CryptoTicketPricerProps {
  basePriceUSD: number; // e.g., total cart price
  onPaymentSuccess?: () => void;
}

export const CryptoTicketPricer: React.FC<CryptoTicketPricerProps> = ({ basePriceUSD, onPaymentSuccess }) => {
  const { rates, history, loading, isLocked, lockPrice, unlockPrice } = useCryptoPricing();
  const { addCashback } = useWalletStore();
  
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'SOL'>('BTC');
  const [lockTimer, setLockTimer] = useState(60);
  const [paymentState, setPaymentState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [earnedBonus, setEarnedBonus] = useState<number>(0);

  const nodeRef = useRef<HTMLSpanElement>(null);

  // Calculate equivalent crypto value
  const cryptoValue = rates ? basePriceUSD / rates[selectedCrypto] : 0;

  // Track previous value for the animation and trend
  const prevValueRef = useRef(cryptoValue);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (nodeRef.current && cryptoValue !== 0 && !isLocked) {
      if (cryptoValue > prevValueRef.current) setTrend('up');
      else if (cryptoValue < prevValueRef.current) setTrend('down');

      const controls = animate(prevValueRef.current, cryptoValue, {
        duration: 1.2,
        ease: "easeInOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = value.toFixed(selectedCrypto === 'BTC' ? 6 : 4);
          }
        }
      });
      prevValueRef.current = cryptoValue;
      return () => controls.stop();
    }
  }, [cryptoValue, selectedCrypto, isLocked]);

  // Lock Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimer > 0 && paymentState === 'idle') {
      interval = setInterval(() => setLockTimer(t => t - 1), 1000);
    } else if (lockTimer === 0 && isLocked && paymentState === 'idle') {
      unlockPrice();
      setLockTimer(60);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer, paymentState, unlockPrice]);

  // Generate SVG Sparkline Path
  const sparklinePath = useMemo(() => {
    if (history.length < 2) return '';
    const values = history.map(h => basePriceUSD / h[selectedCrypto]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1; // avoid div by zero
    const width = 100;
    const height = 40;
    
    return values.map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [history, selectedCrypto, basePriceUSD]);

  const handlePayment = () => {
    setPaymentState('loading');
    setTimeout(() => {
      // 5% Cashback logic
      const cashback = prevValueRef.current * 0.05;
      addCashback(selectedCrypto, cashback);
      setEarnedBonus(cashback);
      
      setPaymentState('success');
      
      // Notify parent
      if (onPaymentSuccess) {
        setTimeout(onPaymentSuccess, 3000);
      }
    }, 2500); // 2.5s mock transaction
  };

  const borderColors = {
    BTC: 'border-orange-500/40 shadow-[0_15px_30px_-5px_rgba(249,115,22,0.3),inset_0_0_15px_rgba(249,115,22,0.1)]',
    ETH: 'border-blue-500/40 shadow-[0_15px_30px_-5px_rgba(59,130,246,0.3),inset_0_0_15px_rgba(59,130,246,0.1)]',
    SOL: 'border-purple-500/40 shadow-[0_15px_30px_-5px_rgba(168,85,247,0.3),inset_0_0_15px_rgba(168,85,247,0.1)]'
  };

  const activeTextGlow = {
    BTC: 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]',
    ETH: 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]',
    SOL: 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
  };

  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-white/40';

  if (loading) {
    return (
      <div className="h-16 px-6 w-full rounded-[24px] bg-neutral-950/50 backdrop-blur-[40px] border border-white/[0.12] flex items-center justify-center animate-pulse">
        <span className="text-xs text-white/50 font-['Outfit'] tracking-widest uppercase">מחבר לבלוקצ'יין...</span>
      </div>
    );
  }

  return (
    <div dir="rtl" className={`relative overflow-hidden flex flex-col gap-4 py-4 px-6 w-full rounded-[24px] bg-neutral-950/60 backdrop-blur-[40px] saturate-[250%] brightness-110 border-t border-white/[0.15] border-b border-black/60 border-l border-white/[0.05] border-r border-white/[0.05] transition-all duration-700 ${borderColors[selectedCrypto]} ${isLocked && paymentState !== 'success' ? 'ring-2 ring-emerald-400/50' : ''}`}>
      
      {/* Background Sparkline */}
      {history.length >= 2 && (
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 -10 100 60">
          <motion.path
            d={sparklinePath}
            fill="none"
            stroke="url(#sparkline-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={selectedCrypto === 'BTC' ? '#f97316' : selectedCrypto === 'ETH' ? '#3b82f6' : '#a855f7'} />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Top Row: Pricing */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-white/60 font-['Outfit'] uppercase tracking-[0.1em] leading-none">סה"כ קריפטו</span>
            {!isLocked && trend !== 'neutral' && (
              <motion.span 
                key={trend}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[10px] font-bold ${trendColor}`}
              >
                {trend === 'up' ? '↗' : '↘'}
              </motion.span>
            )}
            {isLocked && paymentState === 'idle' && (
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                ננעל: {lockTimer}s
              </span>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-mono tracking-tight font-bold transition-colors duration-500 ${isLocked ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : activeTextGlow[selectedCrypto]}`} ref={nodeRef}>
              {cryptoValue.toFixed(selectedCrypto === 'BTC' ? 6 : 4)}
            </span>
            <span className="text-white/40 text-xs font-bold tracking-widest">{selectedCrypto}</span>
          </div>
        </div>

        {/* Currency Selectors - Only show if not locked */}
        {!isLocked && (
          <div className="flex flex-col gap-1.5">
            {(['BTC', 'ETH', 'SOL'] as const).map(currency => (
              <button
                key={currency}
                onClick={() => setSelectedCrypto(currency)}
                className={`relative text-[9px] font-bold px-2 py-1 rounded-lg transition-all duration-300 ${
                  selectedCrypto === currency 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="relative z-10">{currency}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Row: Actions */}
      <div className="w-full relative z-10 mt-2">
        {!isLocked ? (
          <button 
            disabled={basePriceUSD === 0}
            onClick={() => { lockPrice(); setLockTimer(60); setPaymentState('idle'); }}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            נעל שער למשך 60 שניות 🔒
          </button>
        ) : (
          <AnimatePresence mode="wait">
            {paymentState === 'idle' && (
              <motion.button
                key="pay"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs py-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                שלם בארנק ה-Web3 🚀
              </motion.button>
            )}
            
            {paymentState === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-white/10 border border-white/20 py-3 rounded-xl flex items-center justify-center gap-3 text-xs text-white"
              >
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ממתין לאישור ארנק...
              </motion.div>
            )}

            {paymentState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center gap-2"
              >
                <div className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                  ✅ התשלום עבר בהצלחה
                </div>
                
                {/* Reward Banner */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 flex justify-between items-center shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">בונוס Cashback 5%</span>
                    <span className="text-amber-400 font-bold text-sm">+{earnedBonus.toFixed(6)} {selectedCrypto}</span>
                  </div>
                  <span className="text-2xl">💰</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
      
    </div>
  );
};
