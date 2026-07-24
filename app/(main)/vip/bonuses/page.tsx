import React from "react";
import Link from "next/link";
import BonusesDashboard from "@/components/vip/BonusesDashboard";
import { CombinedRewardsSection } from "@/components/vip/CombinedRewardsSection";
import { HolographicVIPPass } from "@/components/vip/HolographicVIPPass";
import { HoloVoicePassContainer } from "@/src/components/chat/HoloVoicePassContainer";
import { getUserLoyaltyData, getAvailableRewards } from "@/app/actions/bonusActions";
import { ArrowRight, Crown, Sparkles, Mic } from "lucide-react";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "מתחם הטבות VIP קוונטי - MovieBook",
  description: "ממש נקודות נאמנות, הפק כרטיס הולוגרפי ושדרג את חוויית הקולנוע שלך",
};

export default async function VIPBonusesPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "user_123_demo";

  const [loyaltyRes, rewardsRes] = await Promise.all([
    getUserLoyaltyData(userId),
    getAvailableRewards(),
  ]);

  // Fallback initial states in case of error
  const initialLoyaltyData = loyaltyRes.success && loyaltyRes.data ? loyaltyRes.data : {
    points: 750,
    tier: "Liquid Elite",
    claimedRewards: [],
  };

  const availableRewards = rewardsRes.success && rewardsRes.data ? rewardsRes.data : [];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F0F0F0] pb-24" dir="rtl">
      {/* Header Banner & Navigation */}
      <div className="max-w-7xl mx-auto pt-8 px-6 lg:px-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <Link
          href="/vip"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-['Outfit'] border border-white/10 transition-all group"
        >
          <ArrowRight size={16} className="text-[#00F0FF] group-hover:translate-x-1 transition-transform" />
          חזרה למועדון ה-VIP
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-widest bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-3 py-1 rounded-full font-sans">
            מתחם מימוש הטבות קוונטי
          </span>
        </div>
      </div>

      {/* Holographic VIP Pass Showcase Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 my-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest bg-pink-950/40 border border-pink-800/40 px-3 py-1 rounded-full inline-block font-sans">
            כרטיס VIP הולוגרפי & AI קולי
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2 font-['Outfit']">
            הפק כרטיס <span className="text-pink-400">VIP הולוגרפי</span> אישי
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-items-center">
          <div className="w-full flex justify-center">
            <HolographicVIPPass
              tierName={initialLoyaltyData.tier}
              points={initialLoyaltyData.points}
              glowColor="rgba(0,240,255,0.3)"
              badge="VIP ACCESS"
              activeStep={1}
            />
          </div>
          <div className="w-full">
            <HoloVoicePassContainer />
          </div>
        </div>
      </div>

      {/* Main Rewards Dashboard */}
      <BonusesDashboard
        initialLoyaltyData={initialLoyaltyData}
        availableRewards={availableRewards}
        userId={userId}
      />

      {/* Combined Activity & Rewards Section */}
      <CombinedRewardsSection />
    </div>
  );
}
