'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Zap, Ticket, Popcorn, Film, MessageSquare, Star } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { BookingWizard } from '../ai/BookingWizard';
import { formatMovieData } from '@/lib/tmdb';

export default function MovieChatBot() {
  const { 
    isConciergeOpen: isOpen, toggleConcierge: toggleOpen, conciergeMessages: messages, 
    addMessage, isThinking, setThinking, currentMovieId, currentMovieTitle 
  } = useUIStore();
  
  const [input, setInput] = useState('');
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

  const renderMessageContent = (content: string) => {
    const cleaned = content.replace(/\[ACTION:.*?\]/g, '').trim();
    return <span className="whitespace-pre-wrap">{cleaned}</span>;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] flex flex-col items-start justify-end p-4 md:p-10" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(20px)' }}
            className="pointer-events-auto w-full md:w-[460px] h-[85dvh] md:h-[750px] mb-24 overflow-hidden rounded-[40px] border border-white/10 flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.9)] relative transition-all"
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(24px) saturate(200%) brightness(1.1)', // Reduced from 40px for performance
              willChange: 'transform, opacity, filter',
            }}
          >
            {/* Liquid Glass Effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-orange-500/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/mesh-grain.png')] pointer-events-none mix-blend-overlay" />
            
            {/* Holographic Glows */}
            <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

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
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-ping flex-shrink-0 ${currentMovieId ? 'bg-cyan-400' : 'bg-primary'}`} />
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase truncate font-['Inter']">
                      {currentMovieId ? `Analyzing: ${currentMovieTitle}` : 'Liquid Glass Premium 2.0'}
                    </p>
                  </div>
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
                        style={{
                          boxShadow: msg.role === 'user' ? '0 10px 30px rgba(255, 20, 100, 0.3)' : '0 10px 30px rgba(0,0,0,0.5)'
                        }}
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

            {/* Quick Actions */}
            <div className="px-8 py-4 flex gap-3 overflow-x-auto no-scrollbar relative z-10">
              {(currentMovieId ? [
                { label: 'פרטים על העלילה', icon: MessageSquare },
                { label: 'דירוג המבקרים', icon: Star },
                { label: 'הזמן 3 כרטיסים', icon: Ticket }
              ] : [
                { label: 'מה מוקרן היום?', icon: Zap },
                { label: 'המלץ לי על סרט', icon: Bot },
                { label: 'נשנושים', icon: Popcorn }
              ]).map((chip) => (
                <motion.button 
                  key={chip.label}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(chip.label)}
                  className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-slate-300 hover:text-white transition-all backdrop-blur-md"
                >
                  <chip.icon size={14} className={currentMovieId ? 'text-cyan-400' : 'text-primary'} />
                  {chip.label}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="p-8 bg-black/40 border-t border-white/10 relative z-10 backdrop-blur-3xl">
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={currentMovieId ? `שאל משהו על ${currentMovieTitle}...` : "איך אוכל לעזור לך?"}
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pr-8 pl-16 text-base text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-right font-['Inter']"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isThinking}
                  className="absolute left-3 top-3 w-12 h-12 flex items-center justify-center bg-primary rounded-2xl text-background hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={22} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 The Refractive Orb Trigger (Bottom Left) */}
      <motion.button
        onClick={toggleOpen}
        layout
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden border border-white/30 group relative z-20"
        style={{
          background: currentMovieId ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 159, 10, 0.15)',
          backdropFilter: 'blur(32px) saturate(200%)',
          boxShadow: `0 25px 80px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 40px ${currentMovieId ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 159, 10, 0.2)'}`
        }}
      >
        {/* Animated Background Layers */}
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className={`absolute inset-[-50%] opacity-40 bg-gradient-to-tr from-transparent via-transparent ${currentMovieId ? 'to-cyan-400/40' : 'to-primary/40'}`}
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${currentMovieId ? 'from-cyan-500/20' : 'from-primary/20'} to-transparent`}
        />

        <div className={`relative z-10 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-12 ${currentMovieId ? 'text-cyan-400' : 'text-primary'}`}>
          {isOpen ? <X className="w-8 h-8 md:w-10 md:h-10" /> : <Sparkles className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_15px_currentColor]" />}
        </div>
        
        <AnimatePresence>
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 p-1"
            >
              <div className={`w-full h-full rounded-full border-[3px] border-t-transparent animate-spin ${currentMovieId ? 'border-cyan-400' : 'border-primary'} opacity-80`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refractive Lens Flare */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-white/20 to-transparent rotate-45 pointer-events-none" />
      </motion.button>
    </div>
  );
}
