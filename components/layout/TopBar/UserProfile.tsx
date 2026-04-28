'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, ChevronDown, LogIn } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { KineticText } from '@/components/effects/KineticText';

export default function UserProfile() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3 md:gap-6 md:me-10" dir="rtl">
      {session ? (
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[8px] md:text-[9px] text-primary font-black uppercase tracking-[0.2em] mb-1 opacity-70">
              Authenticated
            </span>
            <div className="text-xs md:text-sm font-black text-white leading-tight font-outfit">
              <KineticText text={session.user?.name || ''} tag="span" />
            </div>
          </div>
          
          <div className="relative group">
            <Link href="/profile" className="block w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-primary to-orange-600 p-[1.5px] shadow-[0_10px_30px_rgba(255,159,10,0.2)] hover:scale-110 transition-all duration-500 relative">
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
            
            {/* Quick Logout Tooltip/Menu */}
            <button 
              onClick={() => signOut()}
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125 z-20"
              title="התנתקות"
            >
              <LogIn className="w-3 h-3 text-white rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <Link href="/login">
            <MagneticButton className="px-3 md:px-8 py-2 md:py-3 bg-primary text-background rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(255,159,10,0.2)] whitespace-nowrap">
              <KineticText text="כניסה" tag="span" />
            </MagneticButton>
          </Link>
        </div>
      )}
      <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover:text-white transition-all group-hover:rotate-180" />
      </div>
    </div>
  );
}
