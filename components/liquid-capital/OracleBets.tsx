'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { placeOracleBet } from '@/lib/actions/oracle';
import { useSession } from 'next-auth/react';

export const OracleBets = ({ initialPredictions }: { initialPredictions: any[] }) => {
  const { data: session } = useSession();
  const [predictions, setPredictions] = useState(initialPredictions);
  const [betAmounts, setBetAmounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleBet = async (predictionId: string, optionId: string) => {
    if (!session?.user) return alert('יש להתחבר כדי להמר');
    const amount = betAmounts[`${predictionId}-${optionId}`] || 100;
    
    setLoading(`${predictionId}-${optionId}`);
    const res = await placeOracleBet(session.user.id || 'guest', { predictionId, optionId, amount });
    
    if (res.success) {
      alert('ההימור נקלט בהצלחה!');
      // Optimistic update
      setPredictions(prev => prev.map(p => {
        if (p._id === predictionId) {
          const opts = { ...p.options };
          if (opts[optionId]) {
            opts[optionId].totalPool += amount;
          }
          return { ...p, options: opts };
        }
        return p;
      }));
    } else {
      alert(res.error || 'שגיאה בהגשת הימור');
    }
    setLoading(null);
  };

  return (
    <div className="w-full space-y-6 relative mt-8">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="w-6 h-6 text-[#fbbf24]" />
        <h2 className="text-2xl font-bold text-white tracking-tight font-outfit">הימורי אורקל (Oracle Bets)</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map(pred => (
          <motion.div key={pred._id} whileHover={{ y: -5 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl group hover:border-[#fbbf24]/30 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">{pred.question}</h3>
            <p className="text-sm text-white/50 mb-4">{pred.description}</p>
            
            <div className="space-y-4">
              {Object.keys(pred.options).map(optId => {
                const opt = pred.options[optId];
                const optKey = `${pred._id}-${optId}`;
                return (
                  <div key={optId} className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 font-medium">{opt.label}</span>
                      <span className="text-[#fbbf24] font-mono text-sm">{opt.totalPool.toLocaleString()} PTS (Pool)</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={betAmounts[optKey] || ''}
                        onChange={(e) => setBetAmounts(prev => ({ ...prev, [optKey]: parseInt(e.target.value) || 0 }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white w-24 focus:outline-none focus:border-[#fbbf24]/50"
                        placeholder="סכום..."
                        dir="ltr"
                      />
                      <button
                        onClick={() => handleBet(pred._id, optId)}
                        disabled={loading === optKey}
                        className="flex-1 bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 border border-[#fbbf24]/20 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {loading === optKey ? 'מהמר...' : 'המר'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
