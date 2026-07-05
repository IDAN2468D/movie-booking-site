"use client";

import React, { useState, useOptimistic, useTransition, useEffect } from "react";
import { claimRewardAction } from "@/app/actions/bonusActions";
import { Crown, Gift, Sparkles, Check, AlertCircle } from "lucide-react";

interface RewardItem {
  _id: string;
  title: string;
  description: string;
  costInPoints: number;
  imageUrl: string;
  type: string;
}

interface UserLoyaltyData {
  points: number;
  tier: string;
  claimedRewards: string[];
}

interface BonusesDashboardProps {
  initialLoyaltyData: UserLoyaltyData;
  availableRewards: RewardItem[];
  userId: string;
}

export default function BonusesDashboard({
  initialLoyaltyData,
  availableRewards,
  userId,
}: BonusesDashboardProps) {
  const [loyaltyData, setLoyaltyData] = useState<UserLoyaltyData>(initialLoyaltyData);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Optimistic UI updates
  const [optimisticData, addOptimisticClaim] = useOptimistic(
    loyaltyData,
    (state: UserLoyaltyData, rewardCost: { rewardId: string; cost: number }) => ({
      ...state,
      points: state.points - rewardCost.cost,
      claimedRewards: [...state.claimedRewards, rewardCost.rewardId],
    })
  );

  const handleClaim = (reward: RewardItem) => {
    if (optimisticData.points < reward.costInPoints) {
      setErrorMsg("אין לך מספיק נקודות נאמנות למימוש הטבה זו");
      return;
    }
    
    setErrorMsg(null);

    startTransition(async () => {
      // 1. Optimistic Update
      addOptimisticClaim({ rewardId: reward._id, cost: reward.costInPoints });

      // 2. Server Action
      const result = await claimRewardAction({
        rewardId: reward._id,
        userId: userId,
        costInPoints: reward.costInPoints,
      });

      if (result.success && result.data) {
        // Sync with actual server state
        setLoyaltyData({
          ...loyaltyData,
          points: result.data.points,
          claimedRewards: result.data.claimedRewards,
        });
      } else {
        // Handle error, optimistic update rolls back automatically
        setErrorMsg(result.error || "שגיאת מערכת במימוש ההטבה");
      }
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Liquid Elite": return "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]";
      case "Gold": return "text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]";
      case "Silver": return "text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]";
      default: return "text-amber-700";
    }
  };

  const progressPercentage = Math.min((optimisticData.points / 1000) * 100, 100);

  return (
    <div className="bg-[#05070B] text-[#F0F0F0] p-6 lg:p-12 font-body leading-relaxed" dir="rtl">
      
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-4 flex-row-reverse space-x-reverse font-display">
          <Crown className="w-10 h-10 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
            מועדון ה-VIP
          </span>
        </h1>
        <p className="text-slate-400 text-lg">שדרג את החוויה הקולנועית שלך עם הטבות אקסקלוסיביות</p>
      </header>

      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Widget A: Liquid Points Progress & Tier Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div 
            className="bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-3xl p-8 relative overflow-hidden font-body"
            style={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)" 
            }}
          >
            <div className="absolute top-0 inset-inline-start-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 opacity-50"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-slate-400 text-sm mb-1">מעמד נוכחי</p>
                <h2 className={`text-3xl font-bold font-display ${getTierColor(optimisticData.tier)}`}>
                  {optimisticData.tier}
                </h2>
              </div>
              <Sparkles className="w-8 h-8 text-amber-500/70" />
            </div>

            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-slate-400">נקודות זמינות</span>
                <span className="text-3xl font-bold text-white flex items-center gap-1">
                  <span>{optimisticData.points}</span>
                  <span className="text-amber-500 text-lg">pts</span>
                </span>
              </div>
              
              {/* Progress Track */}
              <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-end">
                עוד {Math.max(0, 1000 - optimisticData.points)} נקודות למעמד הבא
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-red-900/20 border border-red-500/30 backdrop-blur-md rounded-2xl p-4 flex items-start gap-3 text-red-400 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Widget B: Instant Benefit Claims (Gourmet Perks) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableRewards.map((reward) => {
              const isClaimed = optimisticData.claimedRewards.includes(reward._id);
              const canAfford = optimisticData.points >= reward.costInPoints;

              return (
                <div 
                  key={reward._id}
                  className={`relative group bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] rounded-3xl overflow-hidden transition-all duration-300 transform-gpu hover:scale-[1.02] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isClaimed ? 'opacity-35 grayscale-[0.3]' : ''
                  }`}
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
                  }}
                >
                  {/* Decorative Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="aspect-[2/1] w-full relative overflow-hidden">
                    <img 
                      src={reward.imageUrl} 
                      alt={reward.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 inset-inline-start-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 flex-row-reverse">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-amber-50">{reward.type}</span>
                    </div>
                  </div>

                  <div className="p-6 relative z-10 -mt-8">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors font-display">
                      {reward.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {reward.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-0.5">עלות מימוש</span>
                        <span className={`text-lg font-bold flex items-center gap-1 flex-row-reverse ${
                          !canAfford && !isClaimed ? 'text-red-400' : 'text-amber-500'
                        }`}>
                          <span>pts</span>
                          <span>{reward.costInPoints}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleClaim(reward)}
                        disabled={isClaimed || isPending}
                        className={`relative overflow-hidden rounded-xl px-6 py-2.5 font-semibold text-sm transition-all duration-300 flex items-center gap-2 flex-row-reverse space-x-reverse ${
                          isClaimed 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                            : canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>מומש בהצלחה</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>ממש עכשיו</span>
                          </>
                        )}
                        
                        {/* Shimmer effect for afford button */}
                        {!isClaimed && canAfford && (
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent hover:animate-[shimmer_1.5s_infinite]"></div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
