'use client';

import React from 'react';
import { User, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import NextImage from 'next/image';

export default function PersonalInfoSettings() {
  const { data: session } = useSession();
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="space-y-8">
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-white/5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-primary/20 flex items-center justify-center text-primary text-3xl font-black overflow-hidden shadow-2xl">
              {session?.user?.image ? (
                <NextImage src={session.user.image} alt="Profile" width={96} height={96} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                session?.user?.name?.[0] || 'U'
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl border-4 border-[#1A1A1A] shadow-xl">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold text-white mb-1">פרופיל מחובר</h3>
            <p className="text-sm text-slate-500 font-medium">הפרטים שלך מסונכרנים עם חשבון ה-Google שלך</p>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">פעיל</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">Premium</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <User size={20} className="text-[#FF9F0A]" />
          מידע אישי
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">שם מלא</label>
              <input
                type="text"
                defaultValue={session?.user?.name || ''}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">שם תצוגה</label>
              <input
                type="text"
                defaultValue={session?.user?.name?.split(' ')[0] || ''}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">כתובת אימייל</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="email"
                defaultValue={session?.user?.email || ''}
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-slate-500 font-medium cursor-not-allowed text-right"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">טלפון</label>
            <input
              type="tel"
              placeholder="050-000-0000"
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
              dir="ltr"
            />
          </div>

          <div className="pt-4 flex justify-start items-center gap-4">
            <button 
              onClick={() => {
                setSaving(true);
                setTimeout(() => {
                  setSaving(false);
                  setSaved(true);
                  setTimeout(() => setSaved(false), 3000);
                }, 1000);
              }}
              disabled={saving}
              className="px-8 py-4 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {saving ? 'שומר...' : 'שמור שינויים'}
            </button>
            {saved && (
              <span className="text-green-400 font-bold text-sm animate-in fade-in zoom-in duration-300">השינויים נשמרו בהצלחה!</span>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          העדפות
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-4">
          <ToggleRow title="התראות באימייל" desc="קבל אישורי הזמנה והתראות על סרטים" enabled={true} />
          <ToggleRow title="מצב כהה" desc="ממשק כהה (מופעל כברירת מחדל)" enabled={true} />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, enabled }: { title: string; desc: string; enabled: boolean }) {
  const [on, setOn] = React.useState(enabled);
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
      <div>
        <p className="text-white font-bold">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)} className="relative">
        <div className={`w-12 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-slate-700'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${on ? 'left-1' : 'right-1'}`} />
        </div>
      </button>
    </div>
  );
}
