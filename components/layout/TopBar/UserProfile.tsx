'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3 md:gap-6 md:me-10">
      {session ? (
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[8px] md:text-[9px] text-primary font-black uppercase tracking-[0.2em] mb-1">Authenticated User</span>
            <span className="text-xs md:text-sm font-black text-white leading-tight font-outfit">{session.user?.name}</span>
          </div>
          <Link href="/profile" className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-primary to-orange-600 p-[1.5px] shadow-[0_10px_30px_rgba(255,159,10,0.2)] hover:scale-110 transition-all duration-500 relative group">
            <div className="absolute inset-0 bg-primary blur-[20px] opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
            <div className="w-full h-full rounded-[10px] md:rounded-[14px] bg-[#0A0A0A] flex items-center justify-center overflow-hidden border border-white/10">
               {session.user?.image ? (
                 <Image 
                   src={session.user.image} 
                   alt="Profile" 
                   width={56}
                   height={56}
                   unoptimized
                   className="w-full h-full object-cover saturate-[1.2]" 
                 />
               ) : (
                 <User className="text-white/80 w-5 h-5 md:w-7 md:h-7" />
               )}
            </div>
          </Link>
        </div>
      ) : (
        <Link href="/login" className="px-4 md:px-8 py-2 md:py-3 bg-primary text-background rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-110 transition-all duration-500 shadow-[0_10px_30px_rgba(255,159,10,0.2)]">
          כניסה
        </Link>
      )}
      <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover:text-white transition-all group-hover:rotate-180" />
      </div>
    </div>
  );
}
