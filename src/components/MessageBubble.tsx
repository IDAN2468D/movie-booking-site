"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCriticStore, ChatMessage } from '@/hooks/useCriticStore';
import { Bot, User, Volume2, Square } from 'lucide-react';
import { useMovieCriticSpeech } from '@/hooks/useMovieCriticSpeech';

interface MessageBubbleProps {
  msg: ChatMessage;
}

export const MessageBubble = ({ msg }: MessageBubbleProps) => {
  const activeSpeechId = useCriticStore((state) => state.activeSpeechId);
  const setActiveSpeechId = useCriticStore((state) => state.setActiveSpeechId);
  const { isPlaying, activeWordIndex, processStream, stop, resetProcessedLength, unlockAudioContext } = useMovieCriticSpeech(msg.id);
  const isActive = activeSpeechId === msg.id;

  useEffect(() => {
    if (isActive) {
      processStream(msg.content, !msg.isStreaming);
    }
  }, [msg.content, msg.isStreaming, isActive, processStream]);

  const handleToggle = () => {
    if (isActive) {
      stop();
    } else {
      stop();
      unlockAudioContext();
      resetProcessedLength();
      setActiveSpeechId(msg.id);
      
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
          {msg.role === 'user' ? <User className="w-4 h-4 text-white/60" /> : <Bot className="w-4 h-4 text-amber-400" />}
        </div>
        
        <div className={`relative p-4 rounded-2xl ${
          msg.role === 'user'
            ? 'bg-white/10 text-white rounded-tr-sm border border-white/5'
            : 'bg-black/60 text-white/90 rounded-tl-sm border border-white/10 shadow-lg'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-right" dir="rtl">
            {isActive && isPlaying && activeWordIndex ? (
              <>
                <span className="opacity-70">
                  {msg.content.slice(0, activeWordIndex.start)}
                </span>
                <span className="text-primary font-bold drop-shadow-[0_0_12px_rgba(255,20,100,0.9)] mx-[1px] inline-block scale-105">
                  {msg.content.slice(activeWordIndex.start, activeWordIndex.end)}
                </span>
                <span className="opacity-70">
                  {msg.content.slice(activeWordIndex.end)}
                </span>
              </>
            ) : (
              <span>{msg.content}</span>
            )}
            {msg.isStreaming && <span className="inline-block w-1.5 h-4 mr-1 bg-primary animate-pulse align-middle" />}
          </p>

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
