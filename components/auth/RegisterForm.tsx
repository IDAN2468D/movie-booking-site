'use client';

import React, { useActionState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { registerAction } from '@/app/actions/authActions';
import { MagneticButton } from '@/components/ui/MagneticButton';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const initialState = {
  success: false,
  error: undefined,
};

export default function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  useEffect(() => {
    if (state?.success) {
      // Automatically toggle to login form on success
      onToggleForm();
    }
  }, [state, onToggleForm]);

  return (
    <form action={formAction} className="space-y-5 text-right">
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1 font-body">
          שם מלא
        </label>
        <div className="relative">
          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            name="name"
            placeholder="ישראל ישראלי"
            className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none py-4 pr-12 pl-4 text-right font-body transform-gpu"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1 font-body">
          כתובת אימייל
        </label>
        <div className="relative">
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="hello@example.com"
            className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none py-4 pr-12 pl-4 text-right font-body transform-gpu"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1 font-body">
          סיסמה
        </label>
        <div className="relative">
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none py-4 pr-12 pl-4 text-right font-body transform-gpu"
            required
            disabled={isPending}
          />
        </div>
      </div>

      {/* Pre-allocated height to prevent container reflow on error */}
      <div className="min-h-[1.5rem] flex items-center justify-center">
        {state?.error && (
          <p className="text-red-500 text-xs font-bold text-center font-body">{state.error}</p>
        )}
      </div>

      <MagneticButton
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-[#FF7A00] text-background py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group mt-4 font-display"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            צור חשבון
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          </>
        )}
      </MagneticButton>

      <p className="mt-10 text-center text-sm text-slate-500 font-medium font-body">
        כבר יש לך חשבון?{' '}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-primary font-black hover:underline mr-1 focus:outline-none"
        >
          התחבר
        </button>
      </p>
    </form>
  );
}
