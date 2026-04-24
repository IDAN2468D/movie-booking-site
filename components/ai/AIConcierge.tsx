'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Zap, Ticket, Popcorn, Film, MessageSquare, Star } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { usePathname } from 'next/navigation';

export const AIConcierge = () => {
  const { 
    isConciergeOpen, toggleConcierge, conciergeMessages, addMessage, 
    isThinking, setThinking, currentMovieId, currentMovieTitle 
  } = useUIStore();
  
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

  // Combined logic: Concierge + Movie Expert
  const getAIResponse = async (query: string) => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          movieId: currentMovieId, 
          message: query 
        }),
      });
      
      const data = await response.json();
      if (data.success) return data.response;
      
      // Graceful fallback only if API fails
      return "סליחה, אני חווה קושי קטן בחיבור לשרת. אולי כדאי לנסות שוב בעוד רגע?";
    } catch (error) {
      console.error('Unified AI Error:', error);
      return "משהו השתבש... אני מנסה להתחבר מחדש. תרצה לנסות לשאול שוב?";
    }
  };

  const handleSend = async (customQuery?: string) => {
    const queryToUse = customQuery || input;
    if (!queryToUse.trim() || isThinking) return;
    
    setInput('');
    addMessage(queryToUse, 'user');
    setThinking(true);
    
    const response = await getAIResponse(queryToUse);
    addMessage(response, 'assistant');
    setThinking(false);
  };

  const isMoviePage = !!currentMovieId;

  return (
    <div className="fixed bottom-10 right-10 md:right-72 z-[2000]" dir="rtl">
      <AnimatePresence>
        {isConciergeOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
            className="absolute bottom-24 right-0 w-[90vw] md:w-[420px] h-[600px] overflow-hidden rounded-[48px] border border-white/10 flex flex-col shadow-2xl origin-bottom-right"
            style={{
              background: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(50px) saturate(210%) brightness(1.1)',
              boxShadow: '0 30px 100px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-cyan-500/5 pointer-events-none" />

            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    isMoviePage ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-primary/20 border-primary/30 text-primary'
                  }`}>
                    {isMoviePage ? <Film size={24} /> : <Bot size={24} />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0A0A0F] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white tracking-tight">
                      {isMoviePage ? 'מומחה קולנוע AI' : 'הקונסיירז׳ הדיגיטלי'}
                    </h3>
                    {isMoviePage && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-400/10 border border-cyan-400/20 rounded-md">
                        <Sparkles size={8} className="text-cyan-400" />
                        <span className="text-[7px] font-black text-cyan-400 uppercase tracking-tighter">NotebookLM Enhanced</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMoviePage ? 'bg-cyan-400' : 'bg-primary'}`} />
                    <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
                      {isMoviePage ? `מנתח את: ${currentMovieTitle}` : 'MovieBook Partner V4.0'}
                    </p>
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
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-2 h-2 rounded-full ${isMoviePage ? 'bg-cyan-400' : 'bg-primary'}`} />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-2 h-2 rounded-full ${isMoviePage ? 'bg-cyan-400' : 'bg-primary'}`} />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className={`w-2 h-2 rounded-full ${isMoviePage ? 'bg-cyan-400' : 'bg-primary'}`} />
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips */}
            <div className="px-8 py-2 flex gap-2 overflow-x-auto no-scrollbar relative z-10">
              {(isMoviePage ? [
                { label: 'פרטים על העלילה', icon: MessageSquare },
                { label: 'דירוג המבקרים', icon: Star },
                { label: 'המדריך הקולי', icon: Zap },
                { label: 'הזמן עכשיו', icon: Ticket }
              ] : [
                { label: 'סרטים חמים', icon: Zap },
                { label: 'הזמן כרטיס', icon: Ticket },
                { label: 'נשנושים', icon: Popcorn }
              ]).map((chip) => (
                <button 
                  key={chip.label}
                  onClick={() => handleSend(chip.label)}
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
                  placeholder={isMoviePage ? `שאל משהו על ${currentMovieTitle}...` : "איך אוכל לעזור?"}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-6 pl-14 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
                />
                <button 
                  onClick={() => handleSend()}
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
        whileHover={{ scale: 1.05, boxShadow: isMoviePage ? '0 0 50px rgba(6, 182, 212, 0.4)' : '0 0 50px rgba(255, 159, 10, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border border-white/20 group z-20"
        style={{
          background: isMoviePage ? 'rgba(6, 182, 212, 0.05)' : 'rgba(255, 159, 10, 0.05)',
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
          className={`absolute inset-0 opacity-40 bg-gradient-to-br from-transparent via-transparent ${isMoviePage ? 'to-cyan-500/30' : 'to-primary/30'}`}
        />
        
        {/* The Sparkle/Icon */}
        <div className={`relative z-10 transition-all duration-500 transform group-hover:rotate-12 ${isMoviePage ? 'text-cyan-400' : 'text-primary'}`}>
          {isConciergeOpen ? <X size={32} /> : <Sparkles size={32} className={`drop-shadow-[0_0_10px_rgba(${isMoviePage ? '6,182,212' : '255,159,10'},0.8)]`} />}
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
              <div className={`w-full h-full rounded-full border-2 border-t-transparent animate-spin ${isMoviePage ? 'border-cyan-400' : 'border-primary'}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refraction Shine */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none" />
      </motion.button>
    </div>
  );
};
