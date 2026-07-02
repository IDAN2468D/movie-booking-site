'use client';

import React, { useActionState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { loginAction } from '@/app/actions/authActions';
import { MagneticButton } from '@/components/ui/MagneticButton';

interface LoginFormProps {
  onToggleForm: () => void;
}

const initialState = {
  success: false,
  error: undefined,
};

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  // Monitor server action response
  useEffect(() => {
    if (state?.success && state.data) {
      // Credentials have been verified by Server Action, sign in locally via NextAuth
      const email = state.data.email;
      const form = document.getElementById('login-form-el') as HTMLFormElement;
      if (form) {
        const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
        const password = passwordInput?.value || '';

        signIn('credentials', {
          email,
          password,
          redirect: false,
        }).then((res) => {
          if (res?.error) {
            console.error('NextAuth signin error:', res.error);
          } else {
            router.push('/splash');
            router.refresh();
          }
        });
      }
    }
  }, [state, router]);

  return (
    <form id="login-form-el" action={formAction} className="space-y-6 text-right">
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
        <div className="flex items-center justify-between mr-1">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest font-inter">
            סיסמה
          </label>
        </div>
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
        className="w-full bg-primary hover:bg-[#FF7A00] text-background py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group font-outfit"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            כניסה
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          </>
        )}
      </MagneticButton>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#050505] px-2 text-slate-500 font-bold font-inter">או התחברו באמצעות</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/splash' })}
        disabled={isPending}
        className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95 font-inter"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        התחברות עם Google
      </button>

      <p className="mt-10 text-center text-sm text-slate-500 font-medium font-inter">
        אין לך חשבון?{' '}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-primary font-black hover:underline mr-1 focus:outline-none"
        >
          צור אחד עכשיו
        </button>
      </p>
    </form>
  );
}
