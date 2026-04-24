'use client';

import React, { useState } from 'react';
import { Users, UserPlus, X, CreditCard, Copy, Check } from 'lucide-react';
import { useSocialStore } from '@/lib/store/social-store';
import { motion, AnimatePresence } from 'framer-motion';

interface SplitPayPanelProps {
  total: number;
  splitTotal: number;
}

export const SplitPayPanel = ({ splitTotal }: Omit<SplitPayPanelProps, 'total'>) => {
  const { 
    isSocialMode, 
    setSocialMode, 
    groupMembers, 
    addGroupMember, 
    removeGroupMember,
    inviteCode,
    generateInviteCode
  } = useSocialStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleMode = () => {
    if (!isSocialMode) {
      setSocialMode(true);
      if (!inviteCode) generateInviteCode();
    } else {
      setSocialMode(false);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      addGroupMember(name, email);
      setName('');
      setEmail('');
    }
  };

  return (
    <div 
      className="rounded-[40px] p-10 border border-white/5 relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-between mb-8 flex-row-reverse">
        <h2 className="text-2xl font-black text-white flex items-center gap-4 flex-row-reverse">
          <Users className="text-primary" /> Social Cinema
        </h2>
        <button 
          onClick={handleToggleMode}
          className={`px-6 py-2 rounded-full text-xs font-black transition-all ${isSocialMode ? 'bg-primary text-background shadow-[0_0_20px_rgba(255,159,10,0.4)]' : 'bg-white/10 text-white'}`}
        >
          {isSocialMode ? 'ביטול פיצול' : 'פצל תשלום'}
        </button>
      </div>

      <AnimatePresence>
        {isSocialMode && inviteCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-cyan-400/5 border border-cyan-400/20 flex items-center justify-between flex-row-reverse"
          >
            <div className="text-right">
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">קוד הצטרפות לקבוצה</p>
              <p className="text-xl font-mono font-black text-white">{inviteCode}</p>
            </div>
            <button 
              onClick={copyInviteCode}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-cyan-400"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </motion.div>
        )}
        {isSocialMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 flex-row-reverse">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">עלות לאדם</p>
                <p className="text-3xl font-black text-white">₪{splitTotal.toFixed(2)}</p>
                <p className="text-[10px] text-primary font-bold mt-2">פיצול בין {groupMembers.length + 1} משתתפים</p>
              </div>
              
              <form onSubmit={handleAdd} className="space-y-4 text-right">
                <p className="text-xs font-bold text-white mb-2">הוסף חברים לקבוצה</p>
                <div className="flex gap-2 flex-row-reverse">
                  <input 
                    type="text" 
                    placeholder="שם חבר" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                  <input 
                    type="email" 
                    placeholder="אימייל" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                  <button type="submit" className="p-2 bg-primary text-background rounded-xl hover:scale-105 transition-all">
                    <UserPlus size={18} />
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-3">
              {groupMembers.map(member => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 flex-row-reverse"
                  key={member.id}
                >
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{member.name}</p>
                      <p className="text-[10px] text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <button onClick={() => removeGroupMember(member.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3 flex-row-reverse">
              <CreditCard size={16} className="text-primary" />
              <p className="text-[10px] text-slate-400 font-medium">החברים יקבלו קישור לתשלום אישי מיד לאחר השלמת ההזמנה שלך.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
