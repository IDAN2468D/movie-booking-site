'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { useCriticStore } from '@/hooks/useCriticStore';
import LoyaltyBadge from '@/components/loyalty/LoyaltyBadge';
import TicketVaultWidget from '@/components/booking/TicketVaultWidget';

export default function FullPageConcierge() {
  const { messages, isTyping, addMessage, setTyping, updateLastMessage } = useCriticStore();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Mock loyalty for dashboard
  const loyalty = { tier: 'Gold', points: 1850 };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    const text = inputValue;
    setInputValue('');
    addMessage({ id: crypto.randomUUID(), role: 'user', content: text });
    setTyping(true);
    
    // Mock Agent Reply
    setTimeout(() => {
      setTyping(false);
      const reply = "I've processed your request in the main workspace. Notice the dashboard updates on the right.";
      addMessage({ id: crypto.randomUUID(), role: 'critic', content: reply });
    }, 1500);
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row relative z-10 p-4 md:p-8 gap-6">
      
      {/* Left Panel: Chat Feed */}
      <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full border border-amber-500/50 bg-amber-950/50 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              <Bot className="text-amber-400 w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-display font-bold text-xl">Aura Workspace</h2>
                <LoyaltyBadge points={loyalty.points} tier={loyalty.tier} />
              </div>
              <p className="text-xs text-white/50 font-mono tracking-widest uppercase">Global Matrix Active</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center opacity-50">
              <Bot className="w-16 h-16 text-amber-400/50 mb-4" />
              <p className="text-xl font-display font-bold text-amber-200">Welcome to the Aura Workspace</p>
              <p className="text-sm">I've synced your session. How can we proceed?</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-amber-600/20 border border-amber-500/30 text-amber-50' : 'bg-white/5 border border-white/10 text-white/90'}`}>
                {msg.role === 'critic' && <Bot className="w-4 h-4 mb-2 opacity-50" />}
                {msg.role === 'user' && <User className="w-4 h-4 mb-2 opacity-50" />}
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white/5 rounded-2xl p-4 animate-pulse">
                 <span className="text-white/30 text-sm">Processing...</span>
               </div>
             </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Command the matrix..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-amber-500/20 text-amber-400 rounded-full hover:bg-amber-500/40 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Dynamic Dashboard */}
      <div className="w-full md:w-[400px] lg:w-[500px] flex flex-col gap-6">
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl flex-1 flex flex-col">
          <h3 className="text-white font-display font-bold text-lg mb-4">Pulse Dashboard</h3>
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-4">
            <TicketVaultWidget />
            {/* Additional modular components can be injected here */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] mt-4 opacity-50 flex items-center justify-center min-h-[200px]">
              <p className="text-white/30 text-sm font-mono uppercase text-center">Awaiting Dynamic Context<br/>Render Engine Idle</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
