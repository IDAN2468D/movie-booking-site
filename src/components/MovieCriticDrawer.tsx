"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCriticStore } from '@/hooks/useCriticStore';
import { Send, X, Bot, User } from 'lucide-react';

interface MovieCriticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
}

export default function MovieCriticDrawer({ isOpen, onClose, movieId }: MovieCriticDrawerProps) {
  const { messages, isTyping, addMessage, updateLastMessage, setTyping, clearSession } = useCriticStore();
  const [inputValue, setInputValue] = useState('');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    
    addMessage({ id: Date.now().toString(), role: 'user', content: userText });
    setTyping(true);

    try {
      const response = await fetch('/api/critic/proxy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          localContext: { movieId, currentMood: 'Curious' }, // Mocking mood, can be extended
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 flex flex-col backdrop-blur-2xl bg-black/40 border-l border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(255,20,100,0.3)]">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-white font-display font-bold tracking-wide">Aura Critic</h2>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Encrypted Connection</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorStatus && (
              <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2">
                <p className="text-xs text-red-400 font-mono text-center">{errorStatus}</p>
              </div>
            )}

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <Bot className="w-12 h-12 text-white/20" />
                  <p className="text-white/40 text-sm font-medium max-w-[200px]">Ask me anything about the cinematography, plot, or actors.</p>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
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
                    
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-white/10 text-white rounded-tr-sm border border-white/5'
                        : 'bg-black/60 text-white/90 rounded-tl-sm border border-white/10 shadow-lg'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.content}
                        {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
