'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Target } from 'lucide-react';
import { contributeToSquad } from '@/lib/actions/squad';
import { useSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SquadBudgets = ({ initialSquads }: { initialSquads: any[] }) => {
  const { data: session } = useSession();
  const [squads, setSquads] = useState(initialSquads);
  const [contributeAmounts, setContributeAmounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleContribute = async (squadId: string) => {
    if (!session?.user) return alert('יש להתחבר כדי לתרום');
    const amount = contributeAmounts[squadId] || 100;
    
    setLoading(squadId);
    const res = await contributeToSquad(session.user.id || 'guest', session.user.name || 'Anonymous', { squadId, amount });
    
    if (res.success) {
      alert('התרומה נקלטה!');
      setSquads(prev => prev.map(s => s._id === squadId ? { ...s, currentAmount: s.currentAmount + amount } : s));
    } else {
      alert(res.error || 'שגיאה');
    }
    setLoading(null);
  };

  return (
    <div className="w-full space-y-6 relative mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight font-outfit">קופת חברים (Squad Budgets)</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {squads.map(squad => {
          const progress = Math.min((squad.currentAmount / squad.targetAmount) * 100, 100);
          return (
            <motion.div key={squad._id} whileHover={{ y: -5 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl group hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{squad.name}</h3>
                  <p className="text-sm text-white/50">{squad.description}</p>
                </div>
                <Target className="text-purple-400 w-5 h-5 opacity-50" />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs text-white/50 mb-2">
                  <span>{squad.currentAmount.toLocaleString()} PTS</span>
                  <span>יעד: {squad.targetAmount.toLocaleString()} PTS</span>
                </div>
                <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progress}%` }} 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={contributeAmounts[squad._id] || ''}
                  onChange={(e) => setContributeAmounts(prev => ({ ...prev, [squad._id]: parseInt(e.target.value) || 0 }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white w-24 focus:outline-none focus:border-purple-500/50"
                  placeholder="סכום..."
                  dir="ltr"
                />
                <button
                  onClick={() => handleContribute(squad._id)}
                  disabled={loading === squad._id || progress >= 100}
                  className="flex-1 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading === squad._id ? 'שולח...' : progress >= 100 ? 'הושלם!' : 'תרום לקופה'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
