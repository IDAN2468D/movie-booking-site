'use client';

import React from 'react';
import { Shield, Eye, EyeOff, Smartphone, KeyRound, History } from 'lucide-react';

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
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
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-right pr-4 pl-12"
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
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">אימות סיסמה</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
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
              className="px-8 py-4 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? 'מעדכן...' : 'עדכן סיסמה'}
            </button>
            {saved && (
              <span className="text-green-400 font-bold text-sm">הסיסמה עודכנה בהצלחה!</span>
            )}
          </div>
        </div>
      </div>

      {/* 2FA & Sessions */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
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
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <History size={20} className="text-[#FF9F0A]" />
          חיבורים פעילים
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-3">
          <SessionRow device="Chrome — Windows" location="תל אביב, ישראל" current />
          <SessionRow device="Safari — iPhone 15" location="תל אביב, ישראל" />
          <SessionRow device="Firefox — MacOS" location="חיפה, ישראל" />
        </div>

        <button className="mt-6 text-red-400 text-xs font-black uppercase tracking-widest hover:text-red-300 transition-colors">
          נתק את כל המכשירים האחרים
        </button>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

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

function SessionRow({ device, location, current }: { device: string; location: string; current?: boolean }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5">
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
