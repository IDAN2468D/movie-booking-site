'use client';

import Image from 'next/image';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils/index';
import { ChatMessage } from '@/lib/chat-engine';
import { Movie } from '@/lib/tmdb';
import ReactMarkdown from 'react-markdown';

interface ChatWindowProps {
  onClose: () => void;
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  isTyping: boolean;
  botState: 'idle' | 'listening' | 'processing' | 'speaking';
  handleSend: (text?: string) => void;
  handleMovieSelect: (movie: Movie) => void;
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
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Speech Recognition State
  const [isRecording, setIsRecording] = React.useState(false);
  const recognitionRef = useRef<any>(null);

  // Drag to Scroll State
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk; // subtract because of RTL layout mostly, though scrollLeft behavior varies. We'll use standard subtraction.
  };

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'he-IL';
        
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInput(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [setInput]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('דפדפן זה אינו תומך בזיהוי קול.');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInput(''); // clear input before new recording
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <motion.div
      layoutId="concierge-orb"
      initial={{ opacity: 0, y: 20, scale: 0.92, transformOrigin: 'center' }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.92 }}
      className="w-full max-w-5xl h-[750px] max-h-[calc(100vh-80px)] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.4)] rounded-[48px] flex flex-col overflow-hidden pointer-events-auto relative"
    >
      {/* Header */}
      <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mini-Orb visual indicator representing states */}
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden bg-black/40">
            <motion.div
              animate={
                botState === 'processing'
                  ? { rotate: 360 }
                  : botState === 'listening'
                  ? { scale: [1, 1.1, 1] }
                  : botState === 'speaking'
                  ? { scale: [1, 1.15, 1] }
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                botState === 'processing'
                  ? { repeat: Infinity, duration: 1.5, ease: "linear" }
                  : botState === 'listening'
                  ? { repeat: Infinity, duration: 1.2 }
                  : { repeat: Infinity, duration: 2.5 }
              }
              style={{
                background:
                  botState === 'processing'
                    ? 'linear-gradient(135deg, #0AEFFF 0%, transparent 100%)'
                    : botState === 'listening'
                    ? 'linear-gradient(135deg, #FF1464 0%, transparent 100%)'
                    : botState === 'speaking'
                    ? 'linear-gradient(135deg, #FF9F0A 0%, transparent 100%)'
                    : 'linear-gradient(135deg, #FF1464 0%, #0AEFFF 100%)',
              }}
              className="absolute inset-0 opacity-40"
            />
            {botState === 'speaking' && (
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-2xl border border-[#FF9F0A]/30 pointer-events-none"
              />
            )}
            {botState === 'listening' && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 rounded-2xl border border-primary/30 pointer-events-none"
              />
            )}
            <Bot className="text-white relative z-10" size={20} />
          </div>
          <div>
            <h3 className="text-white font-black tracking-tight font-outfit drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)] text-xl">AI Concierge</h3>
            <div className="flex items-center gap-1.5 flex-row-reverse justify-end">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  botState === 'processing'
                    ? "bg-cyan-400 animate-ping"
                    : botState === 'listening'
                    ? "bg-primary animate-pulse"
                    : botState === 'speaking'
                    ? "bg-[#FF9F0A] animate-pulse"
                    : "bg-green-500 animate-pulse"
                )}
              />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider font-inter">
                {botState === 'processing' ? 'חושב...' : botState === 'listening' ? 'מקשיב...' : botState === 'speaking' ? 'מדבר...' : 'מחובר'}
              </span>
            </div>
          </div>
        </div>
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
                "max-w-[85%] px-6 py-4 rounded-3xl text-[15px] leading-relaxed text-right font-inter",
                msg.role === 'user'
                  ? "bg-gradient-to-br from-primary to-[#FF1464] text-black font-bold rounded-tr-none shadow-[0_10px_30px_rgba(255,20,100,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)]"
                  : "backdrop-blur-[30px] saturate-[200%] bg-neutral-900/40 border border-white/[0.12] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white/95 rounded-tl-none [&_strong]:text-primary [&_ul]:list-disc [&_ul]:mr-4 [&_li]:mb-1 [&_p]:mb-2 [&_p:last-child]:mb-0"
              )}
            >
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>

            {msg.type === 'movie_suggestion' && Array.isArray(msg.metadata) && (
              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                {(msg.metadata as Movie[]).map((movie: Movie, idx: number) => (
                  <button
                    key={movie.id || idx}
                    onClick={() => handleMovieSelect(movie)}
                    className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right hover:bg-white/10 transition-all group"
                  >
                    <div className="aspect-[2/3] bg-primary/20 rounded-lg mb-2 overflow-hidden relative border border-white/10 shadow-inner">
                      {movie.poster_path && (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt=""
                          fill
                          sizes="150px"
                          unoptimized
                          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
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
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            "px-6 pt-4 pb-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-row-reverse",
            isDragging ? "cursor-grabbing select-none" : "cursor-grab scroll-smooth"
          )}
        >
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              className="flex-shrink-0 px-6 py-3.5 flex items-center justify-center leading-normal backdrop-blur-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.12] hover:border-primary/50 rounded-full text-[12px] md:text-[13px] text-slate-300 font-bold font-inter transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(255,20,100,0.2)] hover:-translate-y-0.5 active:scale-95 pointer-events-auto"
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
            placeholder={isRecording ? "מקשיב לך עכשיו..." : "איזה סרט תרצו להזמין היום?..."}
            className={cn(
              "w-full h-16 backdrop-blur-[20px] bg-white/[0.02] border border-white/[0.12] shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] rounded-2xl px-6 pl-28 text-white text-base outline-none focus:border-primary/60 focus:bg-white/[0.05] focus:shadow-[0_0_25px_rgba(255,20,100,0.2),inset_0_2px_10px_rgba(0,0,0,0.4)] transition-all text-right font-inter font-medium",
              isRecording && "border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.2),inset_0_2px_10px_rgba(0,0,0,0.4)]"
            )}
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-lg",
                isRecording 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50 animate-pulse" 
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
              )}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer shadow-lg"
            >
              <Send size={18} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
