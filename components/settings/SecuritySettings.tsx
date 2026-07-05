'use client';

import React from 'react';
import { Shield, Eye, EyeOff, Smartphone, KeyRound, History } from 'lucide-react';

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="space-y-8 font-body">
      {/* Change Password */}
      <div 
        className="bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-[32px] p-10 font-body"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
        }}
      >
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 font-display">
          <Shield size={20} className="text-[#FF9F0A]" />
          שינוי סיסמה
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">סיסמה נוכחית</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none p-4 text-right pr-4 pl-12 font-body transform-gpu"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">סיסמה חדשה</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none p-4 text-right font-body transform-gpu"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">אימות סיסמה</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none p-4 text-right font-body transform-gpu"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
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
              className="px-8 py-4 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all transform-gpu disabled:opacity-50 font-display"
            >
              {saving ? 'מעדכן...' : 'עדכן סיסמה'}
            </button>
            <div className="min-h-[1.5rem] flex items-center justify-center">
              {saved && (
                <span className="text-green-400 font-bold text-sm animate-in fade-in zoom-in duration-300 font-body">הסיסמה עודכנה בהצלחה!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2FA & Sessions */}
      <div 
        className="bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-[32px] p-10 font-body"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
        }}
      >
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 font-display">
          <Smartphone size={20} className="text-[#FF9F0A]" />
          אימות דו-שלבי
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-4">
          <ToggleRow
            title="אימות באמצעות SMS"
            desc="קבל קוד חד-פעמי ב-SMS לאימות הכניסה"
            enabled={false}
          />
          <ToggleRow
            title="אפליקציית אימות"
            desc="השתמש באפליקציה כמו Google Authenticator"
            enabled={false}
          />
        </div>
      </div>

      {/* Active Sessions */}
      <div 
        className="bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-[32px] p-10 font-body"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
        }}
      >
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 font-display">
          <History size={20} className="text-[#FF9F0A]" />
          חיבורים פעילים
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-3">
          <SessionRow device="Chrome — Windows" location="תל אביב, ישראל" current />
          <SessionRow device="Safari — iPhone 15" location="תל אביב, ישראל" />
          <SessionRow device="Firefox — MacOS" location="חיפה, ישראל" />
        </div>

        <button className="mt-6 text-red-400 text-xs font-black uppercase tracking-widest hover:text-red-300 transition-colors font-display">
          נתק את כל המכשירים האחרים
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, enabled }: { title: string; desc: string; enabled: boolean }) {
  const [on, setOn] = React.useState(enabled);
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-neutral-900/40 border border-white/[0.08] hover:border-white/[0.2] transition-colors shadow-inner group">
      <div>
        <p className="text-white font-bold">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)} className="relative transition-transform duration-300 active:scale-95 transform-gpu">
        <div className={`w-12 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-white/10'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${on ? 'left-1' : 'right-1'}`} />
        </div>
      </button>
    </div>
  );
}

function SessionRow({ device, location, current }: { device: string; location: string; current?: boolean }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-neutral-900/40 border border-white/[0.08] hover:border-white/[0.2] transition-colors shadow-inner">
      <div className="flex items-center gap-3">
        <KeyRound size={16} className="text-slate-500" />
        <div>
          <p className="text-sm text-white font-bold">{device}</p>
          <p className="text-[10px] text-slate-500">{location}</p>
        </div>
      </div>
      {current ? (
        <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-3 py-1 rounded-full uppercase tracking-widest">פעיל כעת</span>
      ) : (
        <button className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors">נתק</button>
      )}
    </div>
  );
}
