"use client";

import React from 'react';
import { Send } from 'lucide-react';

interface ConciergeInputProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isTyping: boolean;
}

export function ConciergeInput({ inputValue, setInputValue, onSubmit, isTyping }: ConciergeInputProps) {
  return (
    <div className="p-4 border-t border-white/5 bg-black/20 transform-gpu">
      <form onSubmit={onSubmit} className="relative flex items-center transform-gpu">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Analyze this film..." 
          disabled={isTyping} 
          className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all disabled:opacity-50 transform-gpu" 
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isTyping} 
          className="absolute right-2 p-2 rounded-full bg-primary text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(255,20,100,0.4)] transform-gpu"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
