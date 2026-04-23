'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Zap, Ticket, Popcorn } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { usePathname } from 'next/navigation';

export const AIConcierge = () => {
  const { isConciergeOpen, toggleConcierge, conciergeMessages, addMessage, isThinking, setThinking } = useUIStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleOpenChat = () => {
      if (!isConciergeOpen) toggleConcierge();
    };

    window.addEventListener('open-movie-chat', handleOpenChat);
    return () => window.removeEventListener('open-movie-chat', handleOpenChat);
  }, [isConciergeOpen, toggleConcierge]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conciergeMessages, isThinking]);

  // Context-aware logic
  const getContextualResponse = (query: string) => {
    const q = query.toLowerCase();
    
    if (q.includes('סרט') || q.includes('movie')) {
      return "יש לנו כמה סרטים חמים עכשיו! אני ממליץ על 'דדפול & וולברין' או 'הקול בראש 2'. תרצה שאראה לך שעות הקרנה?";
    }
    if (q.includes('אוכל') || q.includes('food') || q.includes('פופקורן')) {
      if (pathname !== '/food') {
        return "רעב? אני יכול להעביר אותך לתפריט הנשנושים שלנו או להוסיף פופקורן להזמנה!";
      }
      return "הפופקורן שלנו מיוצר במקום עם חמאה הולנדית. מומלץ להוסיף גם נאצ'וס!";
    }
    if (q.includes('הזמנ') || q.includes('book') || q.includes('כרטיס')) {
      return "אני יכול לעזור לך להשלים את ההזמנה. רק תבחר מושבים ואני אדאג לכל השאר!";
    }
    
    return "אני כאן כדי לעזור לך! אני יכול להמליץ על סרטים, לעזור עם ההזמנה או לסדר לך פינוקים מהמזנון.";
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg = input;
    setInput('');
    addMessage(userMsg, 'user');
    
    setThinking(true);
    
    // Process response
    setTimeout(() => {
      const response = getContextualResponse(userMsg);
      addMessage(response, 'assistant');
      setThinking(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-10 right-10 md:right-72 z-[2000]" dir="rtl">
      <AnimatePresence>
        {isConciergeOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
            className="absolute bottom-24 right-0 w-[90vw] md:w-[400px] h-[550px] overflow-hidden rounded-[48px] border border-white/10 flex flex-col shadow-2xl origin-bottom-right"
            style={{
              background: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(50px) saturate(210%) brightness(1.1)',
              boxShadow: '0 30px 100px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-white/5 pointer-events-none" />

            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30">
                    <Bot size={24} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0A0A0F] rounded-full" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">הקונסיירז׳ הדיגיטלי</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <p className="text-[10px] text-primary font-black tracking-widest uppercase">AI Agent V3.0</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={toggleConcierge} 
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl text-slate-500 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
              {conciergeMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary text-background font-black rounded-bl-none' 
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-br-none backdrop-blur-md'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <div className="flex justify-end">
                   <div className="bg-white/5 p-5 rounded-3xl border border-white/10 rounded-br-none">
                      <div className="flex gap-1.5">
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips */}
            <div className="px-8 py-2 flex gap-2 overflow-x-auto no-scrollbar relative z-10">
              {[
                { label: 'סרטים חמים', icon: Zap },
                { label: 'הזמן כרטיס', icon: Ticket },
                { label: 'נשנושים', icon: Popcorn }
              ].map((chip) => (
                <button 
                  key={chip.label}
                  onClick={() => { setInput(chip.label); }}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
                >
                  <chip.icon size={12} />
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-8 bg-white/5 border-t border-white/5 relative z-10">
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="איך אוכל לעזור?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-6 pl-14 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isThinking}
                  className="absolute left-2.5 top-2.5 w-10 h-10 flex items-center justify-center bg-primary rounded-xl text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 The Refractive Orb Trigger */}
      <motion.button
        onClick={toggleConcierge}
        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255, 159, 10, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border border-white/20 group z-20"
        style={{
          background: 'rgba(255, 159, 10, 0.05)',
          backdropFilter: 'blur(30px) saturate(180%)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Organic Background Movement */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/20 opacity-40"
        />
        
        {/* The Sparkle/Icon */}
        <div className="relative z-10 text-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
          {isConciergeOpen ? <X size={32} /> : <Sparkles size={32} className="drop-shadow-[0_0_10px_rgba(255,159,10,0.8)]" />}
        </div>
        
        {/* Thinking / Active Conic Ring */}
        <AnimatePresence>
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 p-[2px]"
            >
              <div className="w-full h-full rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refraction Shine */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none" />
      </motion.button>
    </div>
  );
};
