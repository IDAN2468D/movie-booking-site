'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, ShieldAlert, DollarSign, Bot, ArrowUpRight, 
  Settings, Globe, Command, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useERPStore } from '@/lib/store/useERPStore';

export default function ErpDashboard() {
  const { stats } = useERPStore();
  const [currency, setCurrency] = useState<'ILS' | 'USD'>('ILS');
  const [taxRate, setTaxRate] = useState<number>(17);
  const [aiCommand, setAiCommand] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiResponses, setAiResponses] = useState<{id: number, text: string}[]>([]);

  // Format currency based on selected anchor
  const formatMoney = (amount: number) => {
    const value = currency === 'USD' ? amount / 3.7 : amount;
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;
    
    setIsProcessingAi(true);
    setTimeout(() => {
      setAiResponses(prev => [
        { id: Date.now(), text: `פעולה עובדה: הוזמן מלאי מראש לסרט שובר קופות עתידי בעקבות פקודה '${aiCommand}'` },
        ...prev
      ].slice(0, 3));
      setAiCommand('');
      setIsProcessingAi(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8" dir="rtl">
      {/* Dynamic Tax & Currency Anchor (Top Bar) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3">
          <Globe className="text-[#FFB800] w-5 h-5" />
          <h2 className="text-white font-black uppercase tracking-widest text-sm">עוגן מס ומטבע גלובלי</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-bold uppercase">מטבע בסיס:</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setCurrency('ILS')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${currency === 'ILS' ? 'bg-[#FFB800] text-black shadow-[0_0_15px_rgba(255,184,0,0.4)]' : 'text-slate-400 hover:text-white'}`}
              >
                ILS ₪
              </button>
              <button 
                onClick={() => setCurrency('USD')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${currency === 'USD' ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'text-slate-400 hover:text-white'}`}
              >
                USD $
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-bold uppercase">מס חברות/מע״מ:</span>
            <div className="relative flex items-center">
              <input 
                type="number" 
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-16 bg-black/50 border border-white/10 rounded-lg py-1.5 text-center text-white font-bold text-sm focus:outline-none focus:border-[#FFB800]/50 transition-colors"
                dir="ltr"
              />
              <span className="absolute left-2 text-slate-500 text-xs">%</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Real-Time Liquidity Stream */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          <div className="absolute top-0 end-0 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FFB800]/20 transition-colors duration-1000" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FFB800]/10 rounded-2xl border border-[#FFB800]/20">
                <Activity className="text-[#FFB800] w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">זרימת נזילות בזמן אמת</h3>
                <p className="text-slate-400 text-sm font-medium">Bento Block לנתוני הכנסות ומסחר</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#FFB800]" />
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">הכנסות נטו (לאחר מס)</span>
              </div>
              <div className="text-4xl font-black text-white font-display tracking-tighter">
                {formatMoney((stats?.totalRevenue || 0) * (1 - taxRate / 100))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5% מהשעה האחרונה</span>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">שווי עגלות ממתינות</span>
              </div>
              <div className="text-4xl font-black text-white font-display tracking-tighter">
                {formatMoney(14250)}
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs font-bold">
                <span>מבוסס על 84 עגלות פעילות</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Anomalous Intent Radar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-950/80 backdrop-blur-2xl border border-red-500/20 rounded-[40px] p-8 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden flex flex-col h-full"
        >
          <div className="absolute top-0 start-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <ShieldAlert className="text-red-500 w-6 h-6" />
            <h3 className="text-xl font-black text-white">רדאר כוונות חריגות</h3>
          </div>
          
          <div className="space-y-4 relative z-10 flex-1">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-4">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
              <div>
                <p className="text-red-200 text-sm font-bold">ניסיון הזרקת קוד נחסם</p>
                <p className="text-red-400/70 text-xs mt-1">סשן #A98F ניסה להריץ פקודת SQL דרך צ'אט הלקוחות. הפעולה נחסמה אוטומטית.</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
              <div className="w-2 h-2 rounded-full bg-[#00F0FF] mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-200 text-sm font-bold">פעילות בוטים חשודה נוטרה</p>
                <p className="text-slate-500 text-xs mt-1">רצף של 50 בקשות כרטיסים מאותה כתובת IP הועבר לאימות Captcha.</p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">סטטוס חומת אש:</span>
              <span className="flex items-center gap-1.5 text-xs text-green-400 font-black bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                <ShieldCheck className="w-3 h-3" /> מוגן
              </span>
            </div>
          </div>
        </motion.div>

        {/* Predictive AI Supply Chain */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-gradient-to-r from-slate-900/60 to-slate-950/60 backdrop-blur-xl border border-white/10 rounded-[40px] p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Bot className="text-[#00F0FF] w-7 h-7" />
            <div>
              <h3 className="text-2xl font-black text-white">שרשרת אספקה נבונה (AI)</h3>
              <p className="text-slate-400 text-sm">הזן פקודות בשפה טבעית לניהול מלאי ותחזיות</p>
            </div>
          </div>
          
          <form onSubmit={handleAiSubmit} className="relative flex items-center mb-6">
            <div className="absolute start-6 text-[#00F0FF]">
              <Command className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={aiCommand}
              onChange={(e) => setAiCommand(e.target.value)}
              placeholder="למשל: תן תחזית למכירות פופקורן בסוף השבוע הקרוב והוסף למלאי במידת הצורך..."
              className="w-full bg-black/50 border border-white/10 rounded-3xl py-5 ps-14 pe-32 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all font-medium"
            />
            <button 
              type="submit"
              disabled={isProcessingAi || !aiCommand.trim()}
              className="absolute end-3 px-6 py-3 bg-[#00F0FF] text-black rounded-2xl font-black text-sm hover:bg-[#00F0FF]/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              {isProcessingAi ? 'מנתח...' : 'הפעל סוכן'}
            </button>
          </form>

          <AnimatePresence>
            {aiResponses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                {aiResponses.map((res, i) => (
                  <motion.div 
                    key={res.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-2xl"
                  >
                    <div className="p-2 bg-[#00F0FF]/20 rounded-xl shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-[#00F0FF]" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{res.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
