'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { KineticText } from '@/components/effects/KineticText';

interface AuthGateProps {
  initialView?: 'login' | 'register';
}

export default function AuthGate({ initialView = 'login' }: AuthGateProps) {
  const [view, setView] = useState<'login' | 'register'>(initialView);

  const toggleView = () => {
    setView((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <div
      className="relative overflow-hidden rounded-[40px] p-10 shadow-2xl border border-white/10 w-full max-w-lg mx-auto"
      style={{
        background: 'rgba(10, 10, 15, 0.65)',
        backdropFilter: 'blur(40px) saturate(200%) brightness(110%)',
      }}
    >
      {/* Visual Ambient glow decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      {/* Title section with Outfit typography */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center justify-center gap-2 font-outfit">
          {view === 'login' ? (
            <>
              <KineticText text="ברוכים" tag="span" />
              <span className="text-primary">
                <KineticText text="השבים" tag="span" />
              </span>
            </>
          ) : (
            <>
              <KineticText text="הצטרפו" tag="span" />
              <span className="text-primary">
                <KineticText text="אלינו" tag="span" />
              </span>
            </>
          )}
        </h1>
        <p className="text-slate-400 text-sm font-medium font-inter">
          {view === 'login'
            ? 'אנא הזינו את הפרטים שלכם כדי להתחבר'
            : 'צרו חשבון לחוויות קולנועיות בלתי נשכחות'}
        </p>
      </div>

      {/* Smooth sliding form content with zero reflow (X translations) */}
      <div className="relative overflow-hidden w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, x: view === 'login' ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === 'login' ? 30 : -30 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {view === 'login' ? (
              <LoginForm onToggleForm={toggleView} />
            ) : (
              <RegisterForm onToggleForm={toggleView} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
