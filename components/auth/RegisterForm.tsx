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
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1 font-inter">
          שם מלא
        </label>
        <div className="relative">
          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            name="name"
            placeholder="ישראל ישראלי"
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right font-inter"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1 font-inter">
          כתובת אימייל
        </label>
        <div className="relative">
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="hello@example.com"
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right font-inter"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1 font-inter">
          סיסמה
        </label>
        <div className="relative">
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right font-inter"
            required
            disabled={isPending}
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-red-500 text-xs font-bold text-center font-inter">{state.error}</p>
      )}

      <MagneticButton
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-[#FF7A00] text-background py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group mt-4 font-outfit"
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

      <p className="mt-10 text-center text-sm text-slate-500 font-medium font-inter">
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
