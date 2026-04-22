import React from 'react';
import NextImage from 'next/image';
import { Clapperboard } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0A0A0A]">
      {/* Left Side: Visual/Cinematic */}
      <div className="hidden lg:block relative overflow-hidden">
        <NextImage
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2000"
          alt="Cinema Background"
          fill
          sizes="50vw"
          className="object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/20" />
        
        <div className="absolute bottom-20 right-20 max-w-lg text-right">
          <div className="flex items-center gap-3 mb-8 justify-end">
            <span className="text-3xl font-black text-white tracking-tighter">MOVIEBOOK</span>
            <div className="w-12 h-12 bg-[#FF9F0A] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,159,10,0.4)]">
              <Clapperboard className="text-white w-7 h-7" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6 tracking-tighter">
            המקום בו כל <span className="text-[#FF9F0A]">פריים</span> מספר סיפור
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            הצטרפו לאלפי חובבי קולנוע וקבלו גישה להקרנות בלעדיות, 
            מושבי פרימיום ומשלוחי אוכל גורמה עד למושב.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-20 relative">
        <div className="absolute top-10 right-10 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tighter">MOVIEBOOK</span>
            <div className="w-8 h-8 bg-[#FF9F0A] rounded-lg flex items-center justify-center">
              <Clapperboard className="text-white w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          {children}
        </div>
        
        <div className="mt-auto pt-10 text-slate-600 text-xs font-bold uppercase tracking-widest text-center">
          © 2026 MOVIEBOOK • חווית קולנוע פרימיום
        </div>
      </div>
    </div>
  );
}
