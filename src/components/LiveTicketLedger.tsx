"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BroadcastEvent, OrderState } from '../lib/wsTrigger';

const ORDER_STEPS: { id: OrderState; label: string }[] = [
  { id: 'payment_confirmed', label: 'Payment Confirmed' },
  { id: 'popcorn_popping', label: 'Popcorn Popping 🍿' },
  { id: 'ready_for_pickup', label: 'Snacks Ready for Pickup' },
  { id: 'hall_doors_open', label: 'Hall Doors Open - Enjoy the Movie!' }
];

interface LiveTicketLedgerProps {
  orderId: string;
  initialState?: OrderState;
}

export default function LiveTicketLedger({ orderId, initialState = 'payment_confirmed' }: LiveTicketLedgerProps) {
  const [currentState, setCurrentState] = useState<OrderState>(initialState);

  useEffect(() => {
    // Subscribe to the order tracking WebSocket room on mount using orderId
    const socket = new WebSocket(`ws://localhost:3000/api/ws?roomId=${orderId}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as BroadcastEvent;
        
        if (data.type === 'order_state_changed' && data.payload.orderId === orderId) {
          setCurrentState(data.payload.newState);
        }
      } catch (err) {
        console.error('WebSocket payload parsing error:', err);
      }
    };

    return () => socket.close();
  }, [orderId]);

  const activeIndex = ORDER_STEPS.findIndex(s => s.id === currentState);

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-[24px] saturate-[180%] shadow-[0_20px_40px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.2)]">
      <h3 className="text-2xl font-outfit font-bold text-white mb-8 drop-shadow-md tracking-wide">
        Live Ledger Status
      </h3>

      <div className="relative flex flex-col gap-8">
        {/* Continuous Track Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/10" />

        {ORDER_STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;
          
          let glowColor = "rgba(168,85,247,0.6)"; // Violet Glowing Pulse
          if (step.id === 'popcorn_popping') {
            glowColor = "rgba(245,158,11,0.6)"; // Amber Liquid Gold
          } else if (step.id === 'ready_for_pickup' || step.id === 'hall_doors_open') {
            glowColor = "rgba(34,197,94,0.6)"; // Green/Success indicator
          }

          return (
            <div key={step.id} className="relative flex items-center gap-6 z-10">
              {/* Step Indicator Node */}
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                {/* Background Ring */}
                <div 
                  className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${
                    isCompleted || isActive ? 'border-transparent' : 'border-white/20'
                  }`} 
                />
                
                {/* Active / Completed Fill Surface */}
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isActive || isCompleted ? 1 : 0,
                    opacity: isActive || isCompleted ? 1 : 0
                  }}
                  className="absolute inset-0 rounded-full backdrop-blur-md"
                  style={{
                    backgroundColor: isCompleted ? 'rgba(255,255,255,0.2)' : isActive ? glowColor : 'transparent',
                    boxShadow: isActive ? `0 0 20px ${glowColor}` : 'none'
                  }}
                />

                {/* Concentric Pulse Effect for Active Step */}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ backgroundColor: glowColor }}
                  />
                )}

                {/* Step Inner Core Dot */}
                <div 
                  className={`w-2 h-2 rounded-full transition-colors duration-500 z-10 ${
                    isCompleted || isActive ? 'bg-white shadow-[0_0_8px_white]' : 'bg-white/20'
                  }`}
                />
              </div>

              {/* Step Typography & Metadata Label */}
              <motion.div
                animate={{
                  opacity: isActive ? 1 : isCompleted ? 0.7 : 0.4,
                  x: isActive ? 5 : 0
                }}
                className="flex-1"
              >
                <p className={`font-inter text-lg transition-colors duration-500 ${
                  isActive ? 'text-white font-semibold drop-shadow-md' : 'text-gray-300'
                }`}>
                  {step.label}
                </p>
                {/* Active Context Text */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="block text-sm text-purple-200 mt-1 font-inter opacity-80"
                    >
                      Active Status
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
