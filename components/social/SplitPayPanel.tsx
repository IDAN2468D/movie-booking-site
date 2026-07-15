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
      className="rounded-[40px] p-8 md:p-10 border border-white/5 relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-4 font-['Outfit'] tracking-tight">
          <Users className="text-[#FF1464]" size={32} /> Social Cinema
        </h2>
        <button 
          onClick={handleToggleMode}
          className={`px-6 py-2.5 rounded-2xl text-sm font-black font-['Outfit'] transition-all shadow-lg hover:scale-105 ${isSocialMode ? 'bg-[#FF1464] text-white shadow-[#FF1464]/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isSocialMode ? 'ביטול פיצול' : 'פצל תשלום'}
        </button>
      </div>

      <AnimatePresence>
        {isSocialMode && inviteCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl bg-transparent border border-cyan-500/30 flex items-center justify-between shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
          >
            <div className="text-left flex-1 pl-4">
              <p className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest mb-1 font-['Outfit']">קוד הצטרפות לקבוצה</p>
              <p className="text-2xl font-black text-white tracking-[0.1em] font-['Outfit']">{inviteCode}</p>
            </div>
            <button 
              onClick={copyInviteCode}
              className="p-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all text-cyan-400 shrink-0"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
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
            <div className="flex flex-col md:flex-row gap-6 mb-8 flex-row-reverse">
              {/* Cost Box (Right side in RTL) */}
              <div className="md:w-1/3 bg-white/5 rounded-3xl p-6 border border-white/5 text-right flex flex-col justify-center shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]">
                <p className="text-[11px] font-black text-white/50 uppercase mb-2 tracking-widest font-['Outfit']">עלות לאדם</p>
                <p className="text-4xl font-black text-white font-['Outfit'] tracking-tight">₪{splitTotal.toFixed(2)}</p>
                <p className="text-[12px] text-[#FF1464] font-bold mt-3 font-['Outfit']">פיצול בין {groupMembers.length + 1} משתתפים</p>
              </div>
              
              {/* Add Members Box (Left side in RTL) */}
              <form onSubmit={handleAdd} className="md:w-2/3 space-y-3 text-right flex flex-col justify-center">
                <p className="text-sm font-bold text-white mb-1 font-['Outfit']">הוסף חברים לקבוצה</p>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="שם חבר" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF1464]/50 transition-colors font-['Inter']"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input 
                      type="email" 
                      placeholder="אימייל" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF1464]/50 transition-colors font-['Inter']"
                    />
                  </div>
                  <button type="submit" className="px-5 bg-[#FF1464] text-white rounded-2xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,20,100,0.3)] flex items-center justify-center shrink-0">
                    <UserPlus size={20} />
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-3 mb-8">
              {groupMembers.map(member => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-2xl border border-white/5 flex-row-reverse shadow-inner"
                  key={member.id}
                >
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-10 h-10 bg-[#FF1464]/20 rounded-full flex items-center justify-center text-[#FF1464] font-black text-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white font-['Outfit']">{member.name}</p>
                      <p className="text-[11px] text-white/50 font-['Inter']">{member.email}</p>
                    </div>
                  </div>
                  <button onClick={() => removeGroupMember(member.id)} className="p-2 text-white/30 hover:text-[#FF1464] transition-colors rounded-xl hover:bg-white/5">
                    <X size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="p-5 bg-transparent border border-[#FF1464]/30 rounded-3xl flex items-center justify-between flex-row-reverse shadow-[inset_0_0_20px_rgba(255,20,100,0.05)]">
              <div className="w-10 h-10 rounded-xl bg-[#FF1464]/10 flex items-center justify-center shrink-0 border border-[#FF1464]/20">
                <CreditCard size={20} className="text-[#FF1464]" />
              </div>
              <p className="text-xs text-white/60 font-medium font-['Inter'] text-right mr-4 flex-1">
                החברים יקבלו קישור לתשלום אישי מיד לאחר השלמת ההזמנה שלך.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
