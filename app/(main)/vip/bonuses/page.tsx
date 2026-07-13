import React from "react";
import BonusesDashboard from "@/components/vip/BonusesDashboard";
import { CombinedRewardsSection } from "@/components/vip/CombinedRewardsSection";
import { getUserLoyaltyData, getAvailableRewards } from "@/app/actions/bonusActions";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "הטבות VIP - MovieBook",
  description: "ממש נקודות נאמנות ושדרג את החוויה שלך",
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
    points: 0,
    tier: "Bronze",
    claimedRewards: [],
  };

  const availableRewards = rewardsRes.success && rewardsRes.data ? rewardsRes.data : [];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F0F0F0]" dir="rtl">
      <BonusesDashboard
        initialLoyaltyData={initialLoyaltyData}
        availableRewards={availableRewards}
        userId={userId}
      />
      <CombinedRewardsSection />
    </div>
  );
}
