'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { KineticText } from '@/components/effects/KineticText';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("Attempting registration for:", email);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Registration status:", res.status);

      if (res.ok) {
        console.log("Registration successful, redirecting to login...");
        router.push('/login');
      } else {
        const data = await res.json();
        console.error("Registration failed:", data.message);
        setError(data.message || 'משהו השתבש');
      }
    } catch (err) {
      console.error("Unexpected registration error:", err);
      setError('אירעה שגיאה בתקשורת עם השרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-orange rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -ml-16 -mt-16" />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center justify-center gap-2">
          <KineticText text="הצטרפו" tag="span" />
          <span className="text-primary">
            <KineticText text="אלינו" tag="span" />
          </span>
        </h1>
        <p className="text-slate-400 text-sm font-medium">צרו חשבון לחוויות קולנועיות בלתי נשכחות</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-right">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1">שם מלא</label>
          <div className="relative">
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right"
              required
            />
          </div>
        </div>

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
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-1">סיסמה</label>
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

        <MagneticButton
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-[#FF7A00] text-background py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group mt-4"
        >
          {loading ? 'יוצר חשבון...' : (
            <>
              צור חשבון
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </>
          )}
        </MagneticButton>
      </form>

      <p className="mt-10 text-center text-sm text-slate-500 font-medium">
        כבר יש לך חשבון?{' '}
        <Link href="/login" className="text-primary font-black hover:underline mr-1">
          התחבר
        </Link>
      </p>
    </div>
  );
}
