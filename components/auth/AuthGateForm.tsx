'use client';

import React, { useActionState, useEffect, useState, useTransition, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { authenticateUserAction } from '@/app/actions/authActions';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { KineticText } from '@/components/effects/KineticText';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const initialState = { success: false, error: undefined };

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, filter: 'blur(4px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function AuthGateForm({ initialView = 'login' }: { initialView?: 'login' | 'register' }) {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [state, formAction, isPending] = useActionState(authenticateUserAction, initialState);
  const [isTransitioning, startTransition] = useTransition();
  const credentialsRef = useRef({ email: '', password: '' });

  const toggleView = () => setView((v) => (v === 'login' ? 'register' : 'login'));

  useEffect(() => {
    if (state?.success && state.targetUrl) {
      startTransition(() => {
        signIn('credentials', {
          email: credentialsRef.current.email,
          password: credentialsRef.current.password,
          redirect: false,
        }).then((res) => {
          if (!res?.error) {
            router.push(state.targetUrl!);
            router.refresh();
          } else {
            console.error('NextAuth error:', res.error);
          }
        });
      });
    }
  }, [state, router]);

  const isLoading = isPending || isTransitioning;

  return (
    <div className="relative w-full max-w-lg mx-auto pointer-events-auto" dir="rtl">
      {/* Animated Glowing Gradient Border Wrapper */}
      <div className="absolute -inset-[1px] rounded-[40px] bg-gradient-to-br from-primary/30 via-orange-500/10 to-cyan-500/20 opacity-50 blur-md animate-[pulse_4s_ease-in-out_infinite] -z-10" />
      
      <div 
        className="relative overflow-hidden rounded-[40px] p-8 md:p-10 w-full border border-white/[0.12] backdrop-blur-[40px] saturate-[250%] bg-neutral-950/70 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.15)] text-right z-10" 
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transform-gpu" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none transform-gpu" />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center justify-center gap-2 font-outfit drop-shadow-md">
          {view === 'login' ? (
            <><KineticText text="ברוכים" tag="span" /><span className="text-primary"><KineticText text="השבים" tag="span" /></span></>
          ) : (
            <><KineticText text="הצטרפו" tag="span" /><span className="text-primary"><KineticText text="אלינו" tag="span" /></span></>
          )}
        </h1>
        <p className="text-slate-400 text-sm font-medium font-inter">
          {view === 'login' ? 'הזינו את הפרטים שלכם כדי להתחבר' : 'צרו חשבון לחוויות קולנועיות בלתי נשכחות'}
        </p>
      </div>

      <motion.form 
        id="auth-gate-form" 
        action={formAction} 
        onSubmit={(e) => {
          const fd = new FormData(e.currentTarget);
          credentialsRef.current = {
            email: fd.get('email') as string || '',
            password: fd.get('password') as string || ''
          };
        }}
        className="space-y-5 relative w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <input type="hidden" name="actionType" value={view} />
        
        <AnimatePresence mode="popLayout">
          {view === 'register' && (
            <motion.div key="register-name-field" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.9, y: -20, filter: 'blur(4px)' }} transition={{ duration: 0.2 }} className="relative transform-gpu">
              <input type="text" id="name" name="name" placeholder=" " required disabled={isLoading} className="peer w-full bg-neutral-900/40 border border-white/[0.08] focus:border-primary/50 focus:bg-neutral-950/80 text-white placeholder-transparent rounded-xl transition-all duration-300 focus:ring-1 focus:ring-primary/30 outline-none py-4 px-4 pr-12 font-inter transform-gpu shadow-inner" />
              <label htmlFor="name" className="absolute right-12 top-4 text-slate-500 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none font-inter uppercase tracking-widest font-black">
                שם מלא
              </label>
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-primary peer-focus:scale-110 peer-focus:-rotate-6 transition-all duration-300 w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="relative transform-gpu">
          <input type="email" id="email" name="email" placeholder=" " required disabled={isLoading} className="peer w-full bg-neutral-900/40 border border-white/[0.08] focus:border-primary/50 focus:bg-neutral-950/80 text-white placeholder-transparent rounded-xl transition-all duration-300 focus:ring-1 focus:ring-primary/30 outline-none py-4 px-4 pr-12 font-inter transform-gpu shadow-inner" />
          <label htmlFor="email" className="absolute right-12 top-4 text-slate-500 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none font-inter uppercase tracking-widest font-black">
            כתובת אימייל
          </label>
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-primary peer-focus:scale-110 peer-focus:rotate-6 transition-all duration-300 w-5 h-5" />
        </motion.div>

        <motion.div variants={itemVariants} className="relative transform-gpu">
          <input type="password" id="password" name="password" placeholder=" " required disabled={isLoading} className="peer w-full bg-neutral-900/40 border border-white/[0.08] focus:border-primary/50 focus:bg-neutral-950/80 text-white placeholder-transparent rounded-xl transition-all duration-300 focus:ring-1 focus:ring-primary/30 outline-none py-4 px-4 pr-12 font-inter transform-gpu shadow-inner" />
          <label htmlFor="password" className="absolute right-12 top-4 text-slate-500 text-sm transition-all duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none font-inter uppercase tracking-widest font-black">
            סיסמה
          </label>
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-primary peer-focus:scale-110 peer-focus:-rotate-6 transition-all duration-300 w-5 h-5" />
        </motion.div>

        <div className="min-h-[1.5rem] flex items-center justify-center">
          <AnimatePresence>
            {state?.error && (
              <motion.p key="error-msg" initial={{ opacity: 0, y: -5, x: -10 }} animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="text-red-500 text-xs font-bold text-center font-inter transform-gpu">
                {state.error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div variants={itemVariants}>
          <MagneticButton type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-[#FF7A00] hover:to-primary text-background py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-[0_4px_25px_rgba(255,20,100,0.4)] flex items-center justify-center gap-2 group font-outfit relative overflow-hidden">
            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="relative z-10 flex items-center gap-2">{view === 'login' ? 'התחברות' : 'צור חשבון'}<ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform transform-gpu" /></span>}
          </MagneticButton>
        </motion.div>

        <motion.div variants={itemVariants} className="relative my-6 transform-gpu">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/[0.08]"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0a] px-3 text-slate-500 font-inter rounded-full border border-white/[0.05]">או</span></div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MagneticButton 
            type="button" 
            onClick={() => signIn('google', { callbackUrl: '/splash' })}
            disabled={isLoading}
            className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-3 font-outfit backdrop-blur-sm transform-gpu group"
          >
            <motion.div className="group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </motion.div>
            התחברות דרך Google
          </MagneticButton>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-xs text-slate-400 mt-6 font-inter transform-gpu">
          {view === 'login' ? 'אין לכם חשבון?' : 'כבר יש לכם חשבון?'}{' '}
          <button type="button" onClick={toggleView} disabled={isLoading} className="text-primary hover:text-white font-bold transition-colors">
            {view === 'login' ? 'הירשמו עכשיו' : 'התחברו'}
          </button>
        </motion.p>
      </motion.form>
      </div>
    </div>
  );
}
