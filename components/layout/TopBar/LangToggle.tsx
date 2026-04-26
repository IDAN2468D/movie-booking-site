'use client';

import React from 'react';

export default function LangToggle() {
  const [lang, setLang] = React.useState('he');

  const toggleLang = (newLang: string) => {
    setLang(newLang);
    // In a real app, this would use next-intl or similar
    // For now, we'll just simulate the state
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center bg-white/[0.03] p-1 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
      <button 
        onClick={() => toggleLang('en')}
        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 flex items-center gap-2 ${lang === 'en' ? 'bg-primary text-white shadow-[0_4px_14px_rgba(255,20,100,0.3)]' : 'text-slate-400 hover:text-white'}`}
      >
        <span className="text-xs">🇺🇸</span> EN
      </button>
      <button 
        onClick={() => toggleLang('he')}
        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 flex items-center gap-2 ${lang === 'he' ? 'bg-primary text-white shadow-[0_4px_14px_rgba(255,20,100,0.3)]' : 'text-slate-400 hover:text-white'}`}
      >
        <span className="text-xs">🇮🇱</span> HE
      </button>
    </div>
  );
}
