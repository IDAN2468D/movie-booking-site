'use client';

import React, { useState, useOptimistic, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Coffee, Fingerprint, Sparkles, CheckCircle2 } from 'lucide-react';
import { placeCateringOrder } from '@/lib/actions/catering';

export const NeuralCatering = ({ initialCatering }: { initialCatering: any[] }) => {
  const [predictions, addOptimisticPrediction] = useOptimistic(
    initialCatering,
    (state: any[], updatedId: string) => 
      state.map(p => p._id === updatedId ? { ...p, status: 'delivering' } : p)
  );

  const [isScanning, setIsScanning] = useState(false);

  const handleOrder = async (orderId: string) => {
    startTransition(() => {
      addOptimisticPrediction(orderId);
    });
    await placeCateringOrder(orderId);
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="w-full space-y-6 relative mt-4">
      <div className="flex items-center gap-5 mb-10 relative group">
        <motion.div 
          className="relative flex items-center justify-center p-2"
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Brain className="w-10 h-10 text-[#00f2fe] relative z-10 drop-shadow-[0_0_16px_rgba(0,242,254,0.9)]" />
          <Sparkles className="w-5 h-5 text-white absolute -top-2 -right-2 z-20 animate-pulse drop-shadow-md" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] blur-2xl rounded-full"
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </motion.div>
        
        <div className="relative">
          <motion.h2 
            className="text-4xl md:text-5xl font-black tracking-tighter font-outfit drop-shadow-lg flex flex-col leading-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#00f2fe] via-[#e0fbfc] to-[#00f2fe] bg-[length:200%_auto] pb-1">
              Neural Sync Catering
            </span>
            <span className="text-white/50 font-medium text-sm md:text-base tracking-[0.2em] uppercase mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_12px_rgba(0,242,254,0.9)]"></span>
              Biometric Snack Prediction
            </span>
          </motion.h2>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button 
          onClick={simulateScan}
          disabled={isScanning}
          className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group"
        >
          <Fingerprint className={`w-5 h-5 ${isScanning ? 'text-[#00f2fe] animate-pulse' : 'text-white/70 group-hover:text-white'}`} />
          <span className="font-bold">{isScanning ? 'סורק מדדים ביומטריים...' : 'סרוק מצב רוח חדש'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <AnimatePresence>
          {predictions.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#00f2fe]/50 transition-all flex flex-col gap-4 relative overflow-hidden"
            >
              {order.status === 'delivering' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/10 to-transparent animate-pulse pointer-events-none" />
              )}
              
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-outfit text-white mb-1">
                    {order.mood.toUpperCase()} MOOD
                  </span>
                  <span className="text-white/50 text-sm">מושב: {order.seatNumber}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#00f2fe]/20 flex items-center justify-center border border-[#00f2fe]/30">
                  <Coffee className="w-6 h-6 text-[#00f2fe]" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 z-10">
                {order.items.map((item: string, idx: number) => (
                  <span key={idx} className="bg-black/50 px-3 py-1 rounded-full text-sm border border-white/5">
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-2 z-10 border-t border-white/5 pt-4">
                <span className="font-bold text-xl text-[#00f2fe]">₪{order.totalPrice}</span>
                {order.status === 'preparing' ? (
                  <button
                    onClick={() => handleOrder(order._id)}
                    className="bg-[#00f2fe]/10 text-[#00f2fe] hover:bg-[#00f2fe] hover:text-black px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  >
                    אשר שיגור
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[#00f2fe] font-bold text-sm bg-[#00f2fe]/10 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    משוגר אליך ב-Levitation
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
