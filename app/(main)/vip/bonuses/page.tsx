import React from "react";
import BonusesDashboard from "@/components/vip/BonusesDashboard";
import { CombinedRewardsSection } from "@/components/vip/CombinedRewardsSection";
import { getUserLoyaltyData, getAvailableRewards } from "@/app/actions/bonusActions";

export const metadata = {
  title: "הטבות VIP - MovieBook",
  description: "ממש נקודות נאמנות ושדרג את החוויה שלך",
};

export default async function VIPBonusesPage() {
  // In a real app, you would get this from a session/auth context
  // Using a hardcoded demo user for this implementation
  const demoUserId = "user_123_demo";

  const [loyaltyRes, rewardsRes] = await Promise.all([
    getUserLoyaltyData(demoUserId),
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
        userId={demoUserId}
      />
      <CombinedRewardsSection />
    </div>
  );
}
