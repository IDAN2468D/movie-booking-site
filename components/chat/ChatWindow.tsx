'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils/index';
import { ChatMessage } from '@/lib/chat-engine';

interface ChatWindowProps {
  onClose: () => void;
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  isTyping: boolean;
  botState: 'idle' | 'thinking' | 'speaking';
  handleSend: (text?: string) => void;
  handleMovieSelect: (movie: any) => void;
  quickActions: string[];
}

export default function ChatWindow({
  onClose,
  messages,
  input,
  setInput,
  isTyping,
  botState,
  handleSend,
  handleMovieSelect,
  quickActions,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <motion.div
      layoutId="concierge-orb"
      initial={{ opacity: 0, y: 30, scale: 0.92, transformOrigin: 'bottom left' }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.92 }}
      className="w-[380px] max-w-[calc(100vw-48px)] h-[580px] max-h-[calc(100vh-140px)] bg-black/40 backdrop-blur-[40px] border border-white/10 rounded-[36px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto relative"
    >
      {/* Header */}
      <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mini-Orb visual indicator representing states */}
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden bg-black/40">
            <motion.div
              animate={
                botState === 'thinking'
                  ? { rotate: 360 }
                  : botState === 'speaking'
                  ? { scale: [1, 1.15, 1] }
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                botState === 'thinking'
                  ? { repeat: Infinity, duration: 1.5, ease: "linear" }
                  : { repeat: Infinity, duration: 2.5 }
              }
              style={{
                background:
                  botState === 'thinking'
                    ? 'linear-gradient(135deg, #0AEFFF 0%, transparent 100%)'
                    : botState === 'speaking'
                    ? 'linear-gradient(135deg, #FF1464 0%, transparent 100%)'
                    : 'linear-gradient(135deg, #FF1464 0%, #0AEFFF 100%)',
              }}
              className="absolute inset-0 opacity-40"
            />
            {botState === 'speaking' && (
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-2xl border border-primary/30 pointer-events-none"
              />
            )}
            <Bot className="text-white relative z-10" size={20} />
          </div>
          <div>
            <h3 className="text-white font-black tracking-tight font-display">AI Concierge</h3>
            <div className="flex items-center gap-1.5 flex-row-reverse justify-end">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  botState === 'thinking' ? "bg-cyan-400 animate-ping" : "bg-green-500 animate-pulse"
                )}
              />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                {botState === 'thinking' ? 'חושב...' : botState === 'speaking' ? 'מדבר...' : 'מחובר'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}
          >
            <div
              className={cn(
                "max-w-[85%] px-5 py-3.5 rounded-3xl text-sm leading-relaxed text-right",
                msg.role === 'user'
                  ? "bg-primary text-black font-bold rounded-tr-none shadow-[0_4px_20px_rgba(255,20,100,0.2)]"
                  : "bg-white/5 border border-white/10 text-white rounded-tl-none backdrop-blur-xl"
              )}
            >
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
                    <div className="aspect-[2/3] bg-primary/20 rounded-lg mb-2 overflow-hidden relative border border-white/10 shadow-inner">
                      {movie.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt=""
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                    <p className="text-[10px] font-black text-white truncate font-outfit">
                      {movie.title || movie.displayTitle}
                    </p>
                    <p className="text-[8px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">
                      הזמן כעת
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-3xl rounded-tl-none">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(10,239,255,0.6)]"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Context-Aware Dynamic Quick Actions */}
      {!isTyping && (
        <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-row-reverse">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              className="flex-shrink-0 px-4 py-2.5 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-full text-[10px] md:text-[11px] text-slate-300 font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <div className="p-6 pt-2">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="איזה סרט תרצו להזמין היום?..."
            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 pr-14 text-white text-sm outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all text-right font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer shadow-lg"
          >
            <Send size={18} className="rotate-180" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
