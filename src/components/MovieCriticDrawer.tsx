"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCriticStore, ChatMessage } from '@/hooks/useCriticStore';
import { useRouter } from 'next/navigation';
import { Send, X, Bot, User, Volume2, VolumeX, Square, Maximize2 } from 'lucide-react';
import { useMovieCriticSpeech } from '@/hooks/useMovieCriticSpeech';
import { useCognitiveContext } from '@/hooks/useCognitiveContext';
import { useTransactionStore } from '@/hooks/useTransactionStore';
import BookingConfirmationWidget from '@/components/checkout/BookingConfirmationWidget';
import LoyaltyBadge from '@/components/loyalty/LoyaltyBadge';
import TicketVaultWidget from '@/components/booking/TicketVaultWidget';
import { processSecureBooking } from '@/lib/actions/transactionActions';

interface MovieCriticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
}

const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const { activeSpeechId, setActiveSpeechId } = useCriticStore();
  const { isPlaying, activeWordIndex, processStream, stop, resetProcessedLength, unlockAudioContext } = useMovieCriticSpeech(msg.id);
  const isActive = activeSpeechId === msg.id;

  // Pipe streaming text to TTS if this bubble is the active one
  useEffect(() => {
    if (isActive) {
      processStream(msg.content, !msg.isStreaming);
    }
  }, [msg.content, msg.isStreaming, isActive, processStream]);

  // Handle explicit toggle gesture
  const handleToggle = () => {
    if (isActive) {
      stop();
    } else {
      stop();
      unlockAudioContext();
      resetProcessedLength();
      setActiveSpeechId(msg.id);
      
      // Delay slightly to prevent cancel() from swallowing the new speak() command
      setTimeout(() => {
        processStream(msg.content, !msg.isStreaming);
      }, 50);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
          msg.role === 'user' 
            ? 'bg-white/10 border border-white/5' 
            : 'bg-primary/20 border border-primary/30 shadow-[0_0_10px_rgba(255,20,100,0.2)]'
        }`}>
          {msg.role === 'user' ? <User className="w-4 h-4 text-white/60" /> : <Bot className="w-4 h-4 text-primary" />}
        </div>
        
        <div className={`relative p-4 rounded-2xl ${
          msg.role === 'user'
            ? 'bg-white/10 text-white rounded-tr-sm border border-white/5'
            : 'bg-black/60 text-white/90 rounded-tl-sm border border-white/10 shadow-lg'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-right" dir="rtl">
            {isActive && isPlaying && activeWordIndex ? (
              <>
                <span className="opacity-70 transition-opacity duration-300">
                  {msg.content.slice(0, activeWordIndex.start)}
                </span>
                <span className="text-primary font-bold drop-shadow-[0_0_12px_rgba(255,20,100,0.9)] mx-[1px] transition-all duration-75 inline-block scale-105">
                  {msg.content.slice(activeWordIndex.start, activeWordIndex.end)}
                </span>
                <span className="opacity-70 transition-opacity duration-300">
                  {msg.content.slice(activeWordIndex.end)}
                </span>
              </>
            ) : (
              <span>{msg.content}</span>
            )}
            {msg.isStreaming && <span className="inline-block w-1.5 h-4 mr-1 bg-primary animate-pulse align-middle" />}
          </p>

          {/* Interactive Contextual Speaker Node */}
          {msg.role === 'critic' && (
            <button
              onClick={handleToggle}
              className={`absolute -bottom-3 -left-3 backdrop-blur-md bg-white/5 border border-white/10 p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all duration-200 cursor-pointer ${
                isActive && isPlaying ? 'animate-pulse shadow-[0_0_12px_rgba(139,92,246,0.4)]' : ''
              }`}
              title={isActive && isPlaying ? 'Stop Narration' : 'Listen'}
            >
              {isActive && isPlaying ? (
                <Square className="w-3 h-3 text-purple-400" fill="currentColor" />
              ) : (
                <Volume2 className="w-3 h-3 text-white/70" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function MovieCriticDrawer({ isOpen, onClose, movieId }: MovieCriticDrawerProps) {
  const { messages, isTyping, isMuted, activeSpeechId, addMessage, updateLastMessage, setTyping, toggleMute, clearSession } = useCriticStore();
  const cognitiveContext = useCognitiveContext();
  const transactionState = useTransactionStore();
  
  const [inputValue, setInputValue] = useState('');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loyalty, setLoyalty] = useState({ tier: 'Bronze', points: 150 });
  const router = useRouter();

  const isGoldOrElite = loyalty.tier === 'Gold' || loyalty.tier === 'Liquid Elite';

  // Mock a one-tap transaction
  const handleQuickBook = async () => {
    transactionState.setStatus('PAYMENT_PENDING');
    const result = await processSecureBooking({
      userId: 'user_123', // mock
      showtimeId: 'showtime_abc',
      seatIds: ['seat_1', 'seat_2'],
      paymentToken: 'mock-success',
      idempotencyKey: crypto.randomUUID(),
    });
    
    if (result.success) {
      transactionState.setStatus('SUCCESS');
      if (result.currentTier && result.pointsEarned) {
        setLoyalty({ tier: result.currentTier, points: loyalty.points + result.pointsEarned });
      }
    } else {
      transactionState.setError(result.error || 'Transaction failed');
    }
  };

  const unlockAudioContext = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
    }
  };

  // Strictly Sandbox Memory Context
  useEffect(() => {
    if (!isOpen) {
      clearSession();
      setErrorStatus(null);
    }
  }, [isOpen, clearSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue('');
    setErrorStatus(null);
    unlockAudioContext();
    
    addMessage({ id: Date.now().toString(), role: 'user', content: userText });
    setTyping(true);

    try {
      const response = await fetch('/api/critic/proxy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          localContext: { 
            movieId, 
            currentMood: 'Curious',
            appState: cognitiveContext 
          }, 
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream Connection Failed');
      }

      addMessage({ id: (Date.now() + 1).toString(), role: 'critic', content: '', isStreaming: true });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          updateLastMessage(chunk);

          // Semantic Catalog Trigger (Sprint 11)
          const lowerChunk = chunk.toLowerCase();
          if (lowerChunk.includes('sci-fi') || lowerChunk.includes('science fiction')) {
            window.dispatchEvent(new CustomEvent('DiscoveryJump', { detail: 'sci-fi' }));
          } else if (lowerChunk.includes('romance')) {
            window.dispatchEvent(new CustomEvent('DiscoveryJump', { detail: 'romance' }));
          }
        }
      }

    } catch (err) {
      console.error(err);
      setErrorStatus("Connection to Critic Core failed. Entering offline fallback.");
      addMessage({ 
        id: Date.now().toString(), 
        role: 'critic', 
        content: "I seem to have lost my connection to the film archives. Let's discuss this later.",
        isStreaming: false
      });
    } finally {
      setTyping(false);
      // Finalize the last message's streaming state
      useCriticStore.setState((state) => {
        const msgs = [...state.messages];
        if (msgs.length > 0) {
          msgs[msgs.length - 1].isStreaming = false;
        }
        return { messages: msgs };
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[85vh] w-[95vw] sm:w-[500px] z-50 flex flex-col rounded-3xl backdrop-blur-2xl bg-black/60 border border-white/10 shadow-2xl overflow-hidden"
            >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md relative overflow-hidden">
              {/* Dynamic Bot Glow */}
              <div className={`absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 ${isGoldOrElite ? 'bg-gradient-to-r from-amber-500 to-transparent' : 'bg-gradient-to-r from-cyan-500 to-transparent'}`} />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border ${isGoldOrElite ? 'bg-amber-950/50 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-white/5 border-white/20'}`}>
                  <Bot className={`w-5 h-5 ${isGoldOrElite ? 'text-amber-400' : 'text-white/80'}`} />
                </div>
                <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h2 className={`font-display font-bold tracking-wide ${isGoldOrElite ? 'text-amber-100' : 'text-white'}`}>Aura Concierge</h2>
                    <LoyaltyBadge points={loyalty.points} tier={loyalty.tier} />
                  </div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Cognitive Matrix Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {transactionState.status === 'IDLE' && (
                  <button 
                    onClick={handleQuickBook}
                    className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors mr-2"
                  >
                    1-Tap Book
                  </button>
                )}
                <button 
                  onClick={() => {
                    onClose();
                    router.push('/concierge');
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors group relative"
                >
                  <Maximize2 className="w-5 h-5" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                    Fullscreen Workspace
                  </span>
                </button>
                <button 
                  onClick={() => {
                    unlockAudioContext();
                    toggleMute();
                  }} 
                  className={`p-2 rounded-full transition-colors ${
                    isMuted ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {errorStatus && (
              <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2">
                <p className="text-xs text-red-400 font-mono text-center">{errorStatus}</p>
              </div>
            )}

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 relative z-10">
                  <Bot className={`w-12 h-12 ${isGoldOrElite ? 'text-amber-400/50' : 'text-white/20'}`} />
                  <p className={`font-display font-bold text-lg ${isGoldOrElite ? 'text-amber-200' : 'text-white'}`}>AI Aura Sync Initialized</p>
                  <p className="text-sm">I've analyzed your acoustic matrix and seat preferences. How can I help?</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {transactionState.status === 'PAYMENT_PENDING' && (
                <div className="flex justify-center p-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-mono tracking-wider animate-pulse">Processing Secure Payment...</span>
                  </div>
                </div>
              )}

              {transactionState.status === 'SUCCESS' && (
                <div className="w-full flex flex-col items-center">
                  <BookingConfirmationWidget onDismiss={() => transactionState.reset()} />
                  <TicketVaultWidget />
                </div>
              )}
              
              {transactionState.status === 'FAILED' && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-center">
                  <p className="text-red-400 font-bold mb-1">Transaction Failed</p>
                  <p className="text-red-300/70 text-xs">{transactionState.errorMsg}</p>
                  <button onClick={() => transactionState.reset()} className="mt-2 text-xs text-white/50 hover:text-white underline">Dismiss</button>
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl p-4 animate-pulse">
                    <span className="text-white/30 text-sm">Concierge is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Analyze this film..."
                  disabled={isTyping}
                  className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2 rounded-full bg-primary text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(255,20,100,0.4)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
