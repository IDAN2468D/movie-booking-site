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
    <div className="space-y-12">
      <div 
        className="bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-[40px] p-12 relative overflow-hidden font-body"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-white/5">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] bg-white/5 border-2 border-primary/30 flex items-center justify-center text-primary text-4xl font-black overflow-hidden shadow-[0_20px_40px_rgba(255,159,10,0.2)]">
              {session?.user?.image ? (
                <NextImage src={session.user.image} alt="Profile" width={128} height={128} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                session?.user?.name?.[0] || 'U'
              )}
            </div>
            <div className="absolute -bottom-3 -right-3 p-3 bg-primary rounded-2xl border-4 border-[#0A0A0A] shadow-xl">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
          </div>
          <div className="text-center md:text-right flex-1">
            <h3 className="text-3xl font-black text-white mb-2 font-display">פרופיל <span className="text-primary">מחובר</span></h3>
            <p className="text-base text-slate-400 font-medium font-body">הפרטים שלך מסונכרנים בבטחה עם חשבון ה-Google שלך</p>
            <div className="mt-5 flex items-center justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">פעיל</span>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20 shadow-[0_0_15px_rgba(255,159,10,0.1)]">Premium</span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 font-display">
          <User size={24} className="text-primary" />
          מידע אישי
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </h3>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 mr-2 font-body">שם מלא</label>
              <input
                type="text"
                defaultValue={session?.user?.name || ''}
                className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none p-5 text-lg text-right font-body transform-gpu"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 mr-2 font-body">שם תצוגה</label>
              <input
                type="text"
                defaultValue={session?.user?.name?.split(' ')[0] || ''}
                className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none p-5 text-lg text-right font-body transform-gpu"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 mr-2 font-body">כתובת אימייל</label>
            <div className="relative">
              <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
              <input
                type="email"
                defaultValue={session?.user?.email || ''}
                disabled
                className="w-full bg-neutral-900/30 border border-white/[0.04] text-slate-500 placeholder-neutral-600 rounded-xl p-5 py-5 pr-14 pl-5 text-lg cursor-not-allowed text-right opacity-70 font-body"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 mr-2 font-body">טלפון</label>
            <input
              type="tel"
              placeholder="050-000-0000"
              className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none p-5 text-lg text-right font-body transform-gpu"
              dir="ltr"
            />
          </div>

          <div className="pt-6 flex justify-start items-center gap-6">
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
              className="px-10 py-5 bg-primary text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(255,159,10,0.3)] hover:scale-[1.02] active:scale-95 transition-all transform-gpu disabled:opacity-50 disabled:scale-100 border border-transparent hover:border-white/20 font-display"
            >
              {saving ? 'שומר שינויים...' : 'שמור שינויים'}
            </button>
            <div className="min-h-[1.5rem] flex items-center justify-center">
              {saved && (
                <span className="text-green-400 font-bold text-sm animate-in fade-in zoom-in duration-300 font-body">השינויים נשמרו בהצלחה!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div 
        className="bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-[40px] p-12 relative overflow-hidden font-body"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
        }}
      >
        <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 font-display">
          העדפות
          <div className="w-2 h-2 rounded-full bg-primary" />
        </h3>

        <div className="space-y-6">
          <ToggleRow title="התראות באימייל" desc="קבל אישורי הזמנה והתראות על סרטים חדשים" enabled={true} />
          <ToggleRow title="מצב קולנוע (כהה)" desc="ממשק כהה מותאם אישית לחוויה קולנועית (מומלץ)" enabled={true} />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, enabled }: { title: string; desc: string; enabled: boolean }) {
  const [on, setOn] = React.useState(enabled);
  return (
    <div 
      className="flex items-center justify-between p-8 rounded-[24px] bg-neutral-900/40 border border-white/[0.08] hover:border-white/[0.2] transition-colors shadow-inner group font-body"
    >
      <div>
        <p className="text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</p>
        <p className="text-sm text-slate-400 font-medium">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)} className="relative shrink-0 transition-transform duration-300 active:scale-95 transform-gpu">
        <div className={`w-14 h-8 rounded-full transition-colors shadow-inner ${on ? 'bg-primary shadow-[0_0_15px_rgba(255,159,10,0.4)]' : 'bg-white/10'}`}>
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${on ? 'left-1' : 'right-1'}`} />
        </div>
      </button>
    </div>
  );
}
