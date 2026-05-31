'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Ticket, 
  Film, 
  ChevronLeft,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils/index';
import { useBookingStore } from '@/lib/store';
import { ChatMessage, processMessage } from '@/lib/chat-engine';

export default function MovieChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'שלום! אני העוזר האישי שלכם לסרטים. במה אוכל לעזור היום?',
      timestamp: Date.now(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { allMovies, setSelectedMovie, setFilters, toggleFavorite } = useBookingStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-movie-chat', handleOpen);
    return () => window.removeEventListener('open-movie-chat', handleOpen);
  }, []);

  const handleSend = async () => {
    const userPrompt = input.trim();
    if (!userPrompt) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Try conversational State Control (Local Gemma 2)
      const stateResponse = await fetch('/api/ai/state-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userPrompt })
      });

      const stateResult = await stateResponse.json();

      if (stateResult.success && stateResult.data && stateResult.data.action !== 'NONE') {
        const { action, filters, favoriteMovie, reply } = stateResult.data;

        // Apply filters if detected
        if (action === 'FILTER' && filters) {
          setFilters({
            genre: filters.genre || 'הכל',
            year: filters.year || 'הכל',
            rating: filters.rating || 0
          });
        }

        // Apply favorite toggling if detected
        if (action === 'FAVORITE' && favoriteMovie) {
          const matchedMovie = allMovies.find(m => 
            (m.displayTitle && m.displayTitle.toLowerCase().includes(favoriteMovie.toLowerCase())) ||
            (m.title && m.title.toLowerCase().includes(favoriteMovie.toLowerCase()))
          );
          if (matchedMovie) {
            toggleFavorite(matchedMovie);
          }
        }

        // Show AI reply in chat
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
          type: 'text'
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }

      // 2. Fallback: Full conversational AI Chatbot (Gemini / Gemma hybrid route)
      const chatResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const chatResult = await chatResponse.json();

      if (chatResult.success && chatResult.response) {
        // Detect action links within response text (e.g. [ACTION:BOOK:ID])
        const actionMatch = chatResult.response.match(/\[ACTION:BOOK:(\w+)\]/);
        let movieData: any = null;

        if (actionMatch && actionMatch[1]) {
          const movieId = actionMatch[1];
          const matched = allMovies.find(m => m.id.toString() === movieId);
          if (matched) {
            movieData = [matched];
          }
        }

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: chatResult.response.replace(/\[ACTION:BOOK:\w+\]/g, '').trim(),
          timestamp: Date.now(),
          type: movieData ? 'movie_suggestion' : 'text',
          metadata: movieData
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }

      throw new Error('API routing failed');

    } catch (error) {
      console.warn('API call failed, falling back to local heuristic engine:', error);
      
      // 3. Absolute Fallback: Static Heuristic Engine
      setTimeout(() => {
        const result = processMessage(userPrompt, allMovies);
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: Date.now(),
          type: result.movies ? 'movie_suggestion' : 'text',
          metadata: result.movies
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 800);
    }
  };

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    // Add a message about the selection
    const msg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `מעולה! בחרתי עבורך את "${movie.title || movie.displayTitle}". תוכל לראות את פרטי הסרט בפאנל הצדדי.`,
      timestamp: Date.now(),
      type: 'text'
    };
    setMessages(prev => [...prev, msg]);
  };

  return (
    <div className="fixed bottom-24 left-6 z-50 flex flex-col items-start gap-4 pointer-events-none">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[380px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-140px)] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Bot className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black tracking-tight">AI Concierge</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online Now</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] px-5 py-3.5 rounded-3xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary text-black font-bold rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  
                  {msg.type === 'movie_suggestion' && msg.metadata && (
                    <div className="grid grid-cols-2 gap-3 w-full mt-2">
                      {msg.metadata.map((movie: any, idx: number) => (
                        <button
                          key={movie.id || movie._id || idx}
                          onClick={() => handleMovieSelect(movie)}
                          className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right hover:bg-white/10 transition-all group"
                        >
                          <div className="aspect-[2/3] bg-primary/20 rounded-lg mb-2 overflow-hidden relative">
                            {movie.posterUrl && (
                              <img src={movie.posterUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-white truncate">{movie.title || movie.displayTitle}</p>
                          <p className="text-[8px] text-slate-500">לחץ להזמנה</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {!isTyping && messages.length < 5 && (
              <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                {['מה מוקרן היום?', 'המלץ לי על סרט', 'איך מזמינים?'].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInput(action);
                      handleSend();
                    }}
                    className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-6 pt-2">
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="הקלידו הודעה..."
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 pr-14 text-white text-sm outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <Send size={18} className="rotate-180" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
