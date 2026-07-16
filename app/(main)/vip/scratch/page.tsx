import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ScratchCardContainer } from '@/components/scratch/ScratchCardContainer';

export const metadata = {
  title: 'כרטיס הגירוד הנוירוני - VIP',
  description: 'חשוף את ההטבה הסודית שלך באמצעות כרטיס הגירוד הנוירוני',
};

export default async function ScratchCardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "user_123_demo";

  return (
    <div className="relative min-h-screen bg-[#05070B] text-[#F0F0F0] overflow-hidden flex flex-col items-center justify-center p-6" dir="rtl">
      {/* Background Decorative Neon Glows */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-[#00F0FF]/5 blur-[150px] pointer-events-none" />

      {/* Floating Back Navigation Button */}
      <div className="absolute top-8 right-8 z-20">
        <Link
          href="/vip/bonuses"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 backdrop-blur-md"
        >
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm font-medium font-inter">חזרה להטבות VIP</span>
        </Link>
      </div>

      {/* Centered Card Content Wrapper */}
      <div className="flex flex-col items-center max-w-md w-full text-center relative z-10">
        <header className="mb-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00F0FF] to-blue-600 p-[1px] mb-4 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <div className="w-full h-full rounded-[15px] bg-[#05070B] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00F0FF]" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-l from-[#00F0FF] to-blue-500 font-outfit mb-3">
            כרטיס הגירוד הנוירוני
          </h1>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            גרד לפחות 70% מכרטיס הזכוכית הדיגיטלי כדי לחשוף את קוד המימוש וההטבה הסודית שלך
          </p>
        </header>

        <div className="relative p-3 rounded-[32px] bg-white/[0.01] border border-white/[0.06] backdrop-blur-[20px] shadow-2xl">
          <ScratchCardContainer
            userId={userId}
          />
        </div>

        <footer className="mt-8 text-slate-500 text-xs font-inter tracking-wider">
          SECURE ENCRYPTED NODE • IDAN2468D
        </footer>
      </div>
    </div>
  );
}
