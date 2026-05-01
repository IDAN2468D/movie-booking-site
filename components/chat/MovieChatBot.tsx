'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Zap, Ticket, Popcorn, Film, MessageSquare, Star, Mic, Music, Ghost, Smile, Heart as HeartIcon } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { BookingWizard } from '../ai/BookingWizard';
import { formatMovieData } from '@/lib/tmdb';

export default function MovieChatBot() {
  const { 
    isConciergeOpen: isOpen, toggleConcierge: toggleOpen, conciergeMessages: messages, 
    addMessage, isThinking, setThinking, currentMovieId, currentMovieTitle 
  } = useUIStore();
  
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition start
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  const renderMessageContent = (content: string) => {
    const cleaned = content.replace(/\[ACTION:.*?\]/g, '').trim();
    return <span className="whitespace-pre-wrap">{cleaned}</span>;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] flex flex-col items-center md:items-start justify-start pt-20 md:pt-28 md:pr-10 p-4" dir="rtl">
      <AnimatePresence>
        {isOpen && (
            <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(20px)' }}
            className="pointer-events-auto w-full md:w-[460px] h-[85dvh] md:h-[750px] overflow-hidden rounded-[40px] border border-white/10 flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.9)] relative transition-all"
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(24px) saturate(200%) brightness(1.1)',
              willChange: 'transform, opacity, filter',
            }}
          >
            {/* Liquid Glass Effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-orange-500/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/mesh-grain.png')] pointer-events-none mix-blend-overlay" />
            
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${
                    currentMovieId ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-primary/20 border-primary/40 text-primary'
                  }`}>
                    {currentMovieId ? <Film size={28} className="animate-pulse" /> : <Bot size={28} className="animate-bounce" />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#000] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-white tracking-tighter truncate font-['Outfit']">
                    {currentMovieId ? 'AI Movie Expert' : 'AI Concierge'}
                  </h3>
                  <p className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase truncate font-['Inter']">
                    {isListening ? 'Listening...' : 'Liquid Glass 3.0'}
                  </p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleOpen} 
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'w-full flex justify-start' : 'w-full flex flex-col items-end'}`}>
                    {msg.content && (
                      <div 
                        className={`p-6 rounded-[28px] text-[15px] leading-relaxed-hebrew shadow-2xl border ${
                          msg.role === 'user' 
                            ? 'bg-primary text-background font-bold rounded-bl-none border-primary/20 font-["Inter"]' 
                            : 'bg-white/5 text-slate-100 border-white/10 rounded-br-none backdrop-blur-[40px] saturate-[180%] font-["Assistant"]'
                        }`}
                      >
                        {renderMessageContent(msg.content)}
                      </div>
                    )}
                    {msg.type === 'booking-wizard' && msg.movieData && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-[380px]"
                      >
                        <BookingWizard movie={msg.movieData} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <div className="flex justify-end">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/10 rounded-br-none backdrop-blur-xl flex gap-2">
                      {[0, 0.2, 0.4].map((delay) => (
                        <motion.div 
                          key={delay}
                          animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 0.8, delay }} 
                          className={`w-2.5 h-2.5 rounded-full ${currentMovieId ? 'bg-cyan-400' : 'bg-primary'} shadow-[0_0_10px_currentColor]`} 
                        />
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Mood Discovery Chips */}
            <div className="px-8 py-2 flex flex-col gap-3 relative z-10">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">איך המצב רוח היום?</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                  { label: 'בא לי אקשן!', mood: 'adrenaline', icon: Zap },
                  { label: 'משהו מצחיק', mood: 'laugh', icon: Smile },
                  { label: 'בא לי לבכות', mood: 'melancholic', icon: Music },
                  { label: 'משהו מפחיד', mood: 'scary', icon: Ghost },
                  { label: 'רומנטי', mood: 'romantic', icon: HeartIcon }
                ].map((chip) => (
                  <motion.button 
                    key={chip.mood}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSend(chip.label)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition-all backdrop-blur-md"
                  >
                    <chip.icon size={12} className="text-primary" />
                    {chip.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-8 bg-black/40 border-t border-white/10 relative z-10 backdrop-blur-3xl">
              <div className="relative group flex gap-3">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="איך אוכל לעזור לך?"
                    className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pr-8 pl-12 text-base text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-right font-['Inter']"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isThinking}
                    className="absolute left-3 top-3 w-12 h-12 flex items-center justify-center bg-primary rounded-2xl text-background hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 disabled:grayscale"
                  >
                    <Send size={22} />
                  </button>
                </div>
                <motion.button 
                  animate={isListening ? { scale: [1, 1.2, 1], backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(255,0,0,0.2)', 'rgba(255,255,255,0.1)'] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  onClick={toggleVoice}
                  className="w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-[24px] text-white hover:bg-white/10 transition-all"
                >
                  <Mic size={24} className={isListening ? 'text-red-500' : 'text-slate-400'} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
