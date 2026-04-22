'use client';

import React from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('פרטי התחברות שגויים');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('אירעה שגיאה. אנא נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-orange rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
          ברוכים <span className="text-primary">השבים</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium">אנא הזינו את הפרטים שלכם כדי להתחבר</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-right">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1">כתובת אימייל</label>
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mr-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">סיסמה</label>
            <Link href="#" className="text-[10px] font-black text-primary hover:underline">שכחת סיסמה?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-[#FF7A00] text-background py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2 group"
        >
          {loading ? 'מתחבר...' : 'כניסה'}
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a1a1a] px-2 text-slate-500 font-bold">או התחברו באמצעות</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95"
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
      </form>

      <p className="mt-10 text-center text-sm text-slate-500 font-medium">
        אין לך חשבון?{' '}
        <Link href="/register" className="text-primary font-black hover:underline mr-1">
          צור אחד עכשיו
        </Link>
      </p>
    </div>
  );
}
