'use client';

import React from 'react';
import { Bell, Film, Mail, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationSettings() {
  const [saved, setSaved] = React.useState(false);

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 relative">
      {saved && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl shadow-green-500/20 flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          ההגדרות עודכנו בהצלחה
        </motion.div>
      )}

      {/* Email Notifications */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <Mail size={20} className="text-[#FF9F0A]" />
          התראות באימייל
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-4">
          <ToggleRow title="אישור הזמנה" desc="קבל אישור באימייל לאחר כל הזמנה" enabled={true} onChange={triggerSaved} />
          <ToggleRow title="תזכורת לפני הקרנה" desc="קבל תזכורת שעה לפני תחילת הסרט" enabled={true} onChange={triggerSaved} />
          <ToggleRow title="סרטים חדשים" desc="עדכונים על סרטים חדשים שיוצאים לקולנוע" enabled={false} onChange={triggerSaved} />
          <ToggleRow title="מבצעים והנחות" desc="קבל הודעות על הנחות ומבצעים מיוחדים" enabled={false} onChange={triggerSaved} />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <Smartphone size={20} className="text-[#FF9F0A]" />
          התראות Push
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-4">
          <ToggleRow title="התראות בזמן אמת" desc="קבל עדכונים ישירות למכשיר שלך" enabled={true} onChange={triggerSaved} />
          <ToggleRow title="שינויי לוח זמנים" desc="עדכונים על שינויים בהקרנות שהזמנת" enabled={true} onChange={triggerSaved} />
        </div>
      </div>

      {/* Notification Categories */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <Bell size={20} className="text-[#FF9F0A]" />
          קטגוריות תוכן
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'אקשן', icon: Film, active: true },
            { label: 'דרמה', icon: Film, active: true },
            { label: 'קומדיה', icon: Film, active: false },
            { label: 'מדע בדיוני', icon: Film, active: true },
            { label: 'אנימציה', icon: Film, active: false },
            { label: 'מתח', icon: Film, active: true },
          ].map((cat) => (
            <CategoryChip key={cat.label} label={cat.label} active={cat.active} onChange={triggerSaved} />
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-4">בחר את הז&apos;אנרים שמעניינים אותך כדי לקבל המלצות מותאמות אישית</p>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

function ToggleRow({ title, desc, enabled, onChange }: { title: string; desc: string; enabled: boolean; onChange?: () => void }) {
  const [on, setOn] = React.useState(enabled);
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
      <div>
        <p className="text-white font-bold">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button 
        onClick={() => {
          setOn(!on);
          onChange?.();
        }} 
        className="relative"
      >
        <div className={`w-12 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-slate-700'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${on ? 'left-1' : 'right-1'}`} />
        </div>
      </button>
    </div>
  );
}

function CategoryChip({ label, active, onChange }: { label: string; active: boolean; onChange?: () => void }) {
  const [on, setOn] = React.useState(active);
  return (
    <button
      onClick={() => {
        setOn(!on);
        onChange?.();
      }}
      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
        on
          ? 'bg-primary/10 text-[#FF9F0A] border-primary/30'
          : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
      }`}
    >
      {label}
    </button>
  );
}
