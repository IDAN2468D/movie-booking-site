"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCriticStore } from '@/hooks/useCriticStore';
import { useRouter } from 'next/navigation';
import { X, Bot, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useCognitiveContext } from '@/hooks/useCognitiveContext';
import { useTransactionStore } from '@/hooks/useTransactionStore';
import { TransactionStatusOverlay } from './TransactionStatusOverlay';
import LoyaltyBadge from '@/components/loyalty/LoyaltyBadge';
import { processSecureBooking } from '@/lib/actions/transactionActions';
import { MessageBubble } from './MessageBubble';
import { ConciergeActivity } from './ConciergeActivity';
import { useUserMood, usePruneContext } from '@/lib/store/conciergeStore';
import { useNeuralSpeech } from '@/lib/hooks/useNeuralSpeech';
import { useIsSpeaking } from '@/lib/store/audioStore';
import { ConciergeInput } from './ConciergeInput';
interface MovieCriticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
}

export default function MovieCriticDrawer({ isOpen, onClose, movieId }: MovieCriticDrawerProps) {
  const messages = useCriticStore((state) => state.messages);
  const isTyping = useCriticStore((state) => state.isTyping);
  const isMuted = useCriticStore((state) => state.isMuted);
  const addMessage = useCriticStore((state) => state.addMessage);
  const updateLastMessage = useCriticStore((state) => state.updateLastMessage);
  const setTyping = useCriticStore((state) => state.setTyping);
  const toggleMute = useCriticStore((state) => state.toggleMute);
  const clearSession = useCriticStore((state) => state.clearSession);
  const cognitiveContext = useCognitiveContext();
  const transactionState = useTransactionStore();
  const userMood = useUserMood();
  const pruneContext = usePruneContext();
  const { speak, stop } = useNeuralSpeech();
  const isSpeaking = useIsSpeaking();
  
  const [inputValue, setInputValue] = useState('');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loyalty, setLoyalty] = useState({ tier: 'Bronze', points: 150 });
  const router = useRouter();
  const isGoldOrElite = loyalty.tier === 'Gold' || loyalty.tier === 'Liquid Elite';

  const handleQuickBook = async () => {
    transactionState.setStatus('PAYMENT_PENDING');
    const result = await processSecureBooking({
      userId: 'user_123',
      showtimeId: 'showtime_abc',
      seatIds: ['seat_1', 'seat_2'],
      paymentToken: 'mock-success',
      idempotencyKey: crypto.randomUUID(),
    });
    if (result.success && result.currentTier && result.pointsEarned) {
      transactionState.setStatus('SUCCESS');
      setLoyalty({ tier: result.currentTier, points: loyalty.points + result.pointsEarned });
    } else {
      transactionState.setError(result.error || 'Transaction failed');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      clearSession();
      setErrorStatus(null);
      stop();
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [isOpen, clearSession, stop, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    const userText = inputValue;
    setInputValue('');
    setErrorStatus(null);
    stop();
    addMessage({ id: Date.now().toString(), role: 'user', content: userText });
    pruneContext(10);
    setTyping(true);
    try {
      const response = await fetch('/api/critic/proxy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          userMood,
          localContext: { movieId, currentMood: userMood.mood, appState: cognitiveContext },
        }),
      });

      if (!response.ok || !response.body) throw new Error('Stream Connection Failed');

      addMessage({ id: (Date.now() + 1).toString(), role: 'critic', content: '', isStreaming: true });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponseText = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          updateLastMessage(chunk);
          fullResponseText += chunk;

          const lowerChunk = chunk.toLowerCase();
          if (lowerChunk.includes('sci-fi') || lowerChunk.includes('science fiction')) {
            window.dispatchEvent(new CustomEvent('DiscoveryJump', { detail: 'sci-fi' }));
          } else if (lowerChunk.includes('romance')) {
            window.dispatchEvent(new CustomEvent('DiscoveryJump', { detail: 'romance' }));
          }
        }
      }

      speak(fullResponseText);
    } catch (err) {
      setErrorStatus("Connection to Critic Core failed. Entering offline fallback.");
      addMessage({ id: Date.now().toString(), role: 'critic', content: "Lost connection to film archives.", isStreaming: false });
    } finally {
      setTyping(false);
      useCriticStore.setState((state) => {
        const msgs = [...state.messages];
        if (msgs.length > 0) msgs[msgs.length - 1].isStreaming = false;
        return { messages: msgs };
      });
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[85vh] w-[95vw] sm:w-[500px] z-50 flex flex-col rounded-3xl backdrop-blur-2xl bg-black/60 border border-white/10 shadow-2xl overflow-hidden transform-gpu">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md relative overflow-hidden transform-gpu">
              <div className={`absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 transform-gpu transition-all duration-300 ${isGoldOrElite ? 'bg-gradient-to-r from-amber-500 to-transparent' : 'bg-gradient-to-r from-cyan-500 to-transparent'}`} />
              <div className="flex items-center gap-3 relative z-10 transform-gpu">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border transform-gpu ${isGoldOrElite ? 'bg-amber-950/50 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-white/5 border-white/20'}`}>
                  <Bot className={`w-5 h-5 transform-gpu ${isGoldOrElite ? 'text-amber-400' : 'text-white/80'}`} />
                  {isSpeaking && (
                    <span className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping pointer-events-none transform-gpu" />
                  )}
                </div>
                <div className="flex flex-col transform-gpu">
                  <div className="flex items-center gap-2">
                    <h2 className={`font-display font-bold tracking-wide font-outfit ${isGoldOrElite ? 'text-amber-100' : 'text-white'}`}>Aura Concierge</h2>
                    <LoyaltyBadge points={loyalty.points} tier={loyalty.tier} />
                  </div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Cognitive Matrix Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2 transform-gpu">
                {transactionState.status === 'IDLE' && (
                  <button onClick={handleQuickBook} className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors mr-2 transform-gpu">1-Tap Book</button>
                )}
                <button onClick={() => { onClose(); router.push('/concierge'); }} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors group relative transform-gpu">
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button onClick={() => { stop(); toggleMute(); }} className={`p-2 rounded-full transition-colors transform-gpu ${isMuted ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white transform-gpu"><X className="w-5 h-5" /></button>
              </div>
            </div>
            {errorStatus && <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 transform-gpu"><p className="text-xs text-red-400 font-mono text-center">{errorStatus}</p></div>}
            <ConciergeActivity />
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide transform-gpu">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 relative z-10 transform-gpu">
                  <Bot className={`w-12 h-12 ${isGoldOrElite ? 'text-amber-400/50' : 'text-white/20'}`} />
                  <p className={`font-display font-bold text-lg ${isGoldOrElite ? 'text-amber-200' : 'text-white'}`}>AI Aura Sync Initialized</p>
                  <p className="text-sm">I've analyzed your acoustic matrix and seat preferences. How can I help?</p>
                </div>
              )}
              {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
              <TransactionStatusOverlay
                status={transactionState.status}
                errorMsg={transactionState.errorMsg}
                reset={() => transactionState.reset()}
              />
              {isTyping && <div className="flex justify-start"><div className="bg-white/5 rounded-2xl p-4 animate-pulse"><span className="text-white/30 text-sm">Concierge is thinking...</span></div></div>}
            </div>
            <ConciergeInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSubmit={handleSubmit}
              isTyping={isTyping}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
