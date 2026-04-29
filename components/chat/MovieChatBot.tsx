'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarkerHighlight } from '../fx/MarkerHighlight';
import { X, Send, Sparkles, Bot, Zap, Ticket, Popcorn, Film, MessageSquare, Star } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { useBookingStore } from '@/lib/store';
import { BookingWizard } from '../ai/BookingWizard';
import { formatMovieData } from '@/lib/tmdb';


export default function MovieChatBot() {
  const { 
    isConciergeOpen: isOpen, toggleConcierge: toggleOpen, conciergeMessages: messages, 
    addMessage, isThinking, setThinking, currentMovieId, currentMovieTitle 
  } = useUIStore();
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setSelectedMovie } = useBookingStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Handle cross-component chat triggers
  useEffect(() => {
    const handleOpenChat = () => {
      if (!isOpen) toggleOpen();
    };
    window.addEventListener('open-movie-chat', handleOpenChat);
    return () => window.removeEventListener('open-movie-chat', handleOpenChat);
  }, [isOpen, toggleOpen]);

  const getAIResponse = async (query: string) => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          movieId: currentMovieId, 
          message: query,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      
      const data = await response.json();
      if (data.success) return data.response;
      return "סליחה, אני חווה קושי קטן בחיבור. אולי כדאי לנסות שוב בעוד רגע?";
    } catch (error) {
      console.error('Chat AI Error:', error);
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
    
    // Action Recognition Logic
    let actionTriggered = false;
    const actionRegex = /\[ACTION:(?:BOOK|PURCHASE):\s*(\d+)\]/i;
    const match = response.match(actionRegex);

    if (match) {
      const movieId = parseInt(match[1], 10);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=he-IL`);
        if (res.ok) {
          const rawMovieData = await res.json();
          const movieData = formatMovieData(rawMovieData);
          addMessage(response, 'assistant', 'booking-wizard', movieData);
          actionTriggered = true;
        }

      } catch (e) {
        console.error("Action fetch error:", e);
      }
    }

    if (!actionTriggered) {
      addMessage(response, 'assistant');
    }
    setThinking(false);
  };

  const renderMessageContent = (content: string) => {
    // Clean up action tags for display
    let cleaned = content.replace(/\[ACTION:.*?\]/g, '').trim();
    return <span className="whitespace-pre-wrap">{cleaned}</span>;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] flex flex-col items-end justify-end p-6 md:p-10" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(20px)' }}
            className="pointer-events-auto w-full md:w-[440px] h-[80dvh] md:h-[700px] mb-24 overflow-hidden rounded-[40px] border border-white/10 flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.8)] relative"
            style={{
              background: 'rgba(10, 10, 15, 0.75)',
              backdropFilter: 'blur(60px) saturate(220%) brightness(1.1)',
            }}
          >
            {/* Liquid Glass Overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[url('/mesh-grain.png')] pointer-events-none" />

            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    currentMovieId ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-primary/20 border-primary/30 text-primary'
                  }`}>
                    {currentMovieId ? <Film size={24} /> : <Bot size={24} />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0A0A0F] rounded-full" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-white tracking-tight truncate">
                    {currentMovieId ? 'מומחה קולנוע AI' : 'הקונסיירז׳ הדיגיטלי'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0 ${currentMovieId ? 'bg-cyan-400' : 'bg-primary'}`} />
                    <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase truncate">
                      {currentMovieId ? `מנתח את: ${currentMovieTitle}` : 'MovieBook Premium V4.0'}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={toggleOpen} 
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl text-slate-500 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[90%] space-y-4 ${msg.role === 'user' ? 'w-full flex justify-start' : 'w-full flex flex-col items-end'}`}>
                    {msg.content && (
                      <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-lg border-[0.5px] ${
                        msg.role === 'user' 
                          ? 'bg-primary text-background font-black rounded-bl-none border-primary/20' 
                          : 'bg-white/5 text-slate-200 border-white/20 rounded-br-none backdrop-blur-[40px]'
                      }`}>
                        {renderMessageContent(msg.content)}
                      </div>
                    )}
                    {msg.type === 'booking-wizard' && msg.movieData && (
                      <div className="w-full max-w-[360px]">
                        <BookingWizard movie={msg.movieData} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <div className="flex justify-end">
                   <div className="bg-white/5 p-5 rounded-3xl border border-white/10 rounded-br-none backdrop-blur-xl">
                      <div className="flex gap-1.5">
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-2 h-2 rounded-full ${currentMovieId ? 'bg-cyan-400' : 'bg-primary'}`} />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-2 h-2 rounded-full ${currentMovieId ? 'bg-cyan-400' : 'bg-primary'}`} />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className={`w-2 h-2 rounded-full ${currentMovieId ? 'bg-cyan-400' : 'bg-primary'}`} />
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar relative z-10">
              {(currentMovieId ? [
                { label: 'פרטים על העלילה', icon: MessageSquare },
                { label: 'דירוג המבקרים', icon: Star },
                { label: 'הזמן 3 כרטיסים', icon: Ticket }
              ] : [
                { label: 'מה מוקרן היום?', icon: Zap },
                { label: 'המלץ לי על סרט', icon: Bot },
                { label: 'נשנושים', icon: Popcorn }
              ]).map((chip) => (
                <button 
                  key={chip.label}
                  onClick={() => handleSend(chip.label)}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all active:scale-95 backdrop-blur-md"
                >
                  <chip.icon size={12} />
                  <MarkerHighlight color="#FF9F0A" delay={0.3} strokeWidth={6}>
                    {chip.label}
                  </MarkerHighlight>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-8 bg-white/5 border-t border-white/5 relative z-10 backdrop-blur-xl">
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={currentMovieId ? `שאל משהו על ${currentMovieTitle}...` : "איך אוכל לעזור לך?"}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pr-6 pl-16 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-right"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isThinking}
                  className="absolute left-2.5 top-2.5 w-11 h-11 flex items-center justify-center bg-primary rounded-xl text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 The Refractive Orb Trigger (Bottom Left) */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.05, boxShadow: currentMovieId ? '0 0 50px rgba(6, 182, 212, 0.4)' : '0 0 50px rgba(255, 159, 10, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-[0.5px] border-white/30 group relative z-20"
        style={{
          background: currentMovieId ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 159, 10, 0.1)',
          backdropFilter: 'blur(40px) saturate(200%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className={`absolute inset-0 opacity-40 bg-gradient-to-br from-transparent via-transparent ${currentMovieId ? 'to-cyan-500/30' : 'to-primary/30'}`}
        />
        
        <div className={`relative z-10 transition-all duration-500 transform group-hover:rotate-12 ${currentMovieId ? 'text-cyan-400' : 'text-primary'}`}>
          {isOpen ? <X size={32} /> : <Sparkles size={32} className={`drop-shadow-[0_0_10px_rgba(${currentMovieId ? '6,182,212' : '255,159,10'},0.8)]`} />}
        </div>
        
        <AnimatePresence>
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 p-[2px]"
            >
              <div className={`w-full h-full rounded-full border-2 border-t-transparent animate-spin ${currentMovieId ? 'border-cyan-400' : 'border-primary'}`} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none" />
      </motion.button>
    </div>
  );
}
