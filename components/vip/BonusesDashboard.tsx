"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { claimRewardAction } from "@/app/actions/bonusActions";
import { Crown, Gift, Sparkles, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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
      case "Neural Elite": 
      case "Liquid Elite": return "text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]";
      case "Gold": return "text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]";
      case "Silver": return "text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]";
      default: return "text-amber-700";
    }
  };

  const progressPercentage = Math.min((optimisticData.points / 1000) * 100, 100);

  return (
    <div className="bg-[#05070B] text-[#F0F0F0] p-6 lg:p-12 font-['Inter'] leading-relaxed relative" dir="rtl">
      
      {/* Header */}
      <header className="mb-12 text-center relative z-10">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-4 flex-row-reverse space-x-reverse font-['Outfit']">
          <Crown className="w-10 h-10 text-[#00F0FF] drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]" />
          <span className="bg-clip-text text-transparent bg-gradient-to-l from-[#00F0FF] to-blue-500 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            הטבות ה-VIP שלך
          </span>
        </h1>
        <p className="text-slate-400 text-lg">שדרג את החוויה הקולנועית שלך עם הטבות נוירוניות אקסקלוסיביות</p>
      </header>

      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10">
        
        {/* Widget A: Liquid Points Progress & Tier Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] rounded-3xl p-8 relative overflow-hidden"
            style={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)" 
            }}
          >
            <div className="absolute top-0 inset-inline-start-0 w-full h-1 bg-gradient-to-r from-[#00F0FF]/0 via-[#00F0FF] to-[#00F0FF]/0 opacity-50"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-slate-400 text-sm mb-1">מעמד נוכחי</p>
                <h2 className={`text-3xl font-bold font-['Outfit'] ${getTierColor(optimisticData.tier)}`}>
                  {optimisticData.tier}
                </h2>
              </div>
              <Sparkles className="w-8 h-8 text-[#00F0FF]/70 animate-pulse" />
            </div>

            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-slate-400">נקודות זמינות</span>
                <span className="text-3xl font-bold text-white flex items-center gap-1 font-mono">
                  <motion.span
                    key={optimisticData.points}
                    initial={{ scale: 1.5, color: "#00F0FF" }}
                    animate={{ scale: 1, color: "#FFFFFF" }}
                    transition={{ duration: 0.5 }}
                  >
                    {optimisticData.points}
                  </motion.span>
                  <span className="text-[#00F0FF] text-lg">pts</span>
                </span>
              </div>
              
              {/* Progress Track */}
              <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-l from-[#00F0FF] to-blue-500 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-end">
                עוד {Math.max(0, 1000 - optimisticData.points)} נקודות למעמד הבא
              </p>
            </div>
          </motion.div>

          {/* Error Alert */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-500/30 backdrop-blur-[40px] rounded-2xl p-4 flex items-start gap-3 text-red-400"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{errorMsg}</p>
            </motion.div>
          )}
        </div>

        {/* Widget B: Instant Benefit Claims */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableRewards.map((reward, idx) => {
              const isClaimed = optimisticData.claimedRewards.includes(reward._id);
              const canAfford = optimisticData.points >= reward.costInPoints;

              return (
                <motion.div 
                  key={reward._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={!isClaimed ? { scale: 1.02, y: -5 } : {}}
                  className={`relative group backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] rounded-3xl overflow-hidden ${
                    isClaimed ? 'opacity-50 grayscale' : ''
                  }`}
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)"
                  }}
                >
                  <div className="aspect-[2/1] w-full relative overflow-hidden">
                    <motion.img 
                      src={reward.imageUrl} 
                      alt={reward.title}
                      whileHover={!isClaimed ? { scale: 1.1 } : {}}
                      transition={{ duration: 0.7 }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 inset-inline-start-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 flex-row-reverse">
                      <Gift className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span className="text-xs font-medium text-[#00F0FF]">{reward.type}</span>
                    </div>
                  </div>

                  <div className="p-6 relative z-10 -mt-8">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00F0FF] transition-colors font-['Outfit']">
                      {reward.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {reward.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-0.5">עלות מימוש</span>
                        <span className={`text-lg font-bold flex items-center gap-1 flex-row-reverse font-mono ${
                          !canAfford && !isClaimed ? 'text-red-400' : 'text-[#00F0FF]'
                        }`}>
                          <span>pts</span>
                          <span>{reward.costInPoints}</span>
                        </span>
                      </div>

                      <motion.button
                        whileTap={!isClaimed && canAfford ? { scale: 0.95 } : {}}
                        onClick={() => handleClaim(reward)}
                        disabled={isClaimed || isPending}
                        className={`relative overflow-hidden rounded-xl px-6 py-2.5 font-semibold text-sm transition-all duration-300 flex items-center gap-2 flex-row-reverse space-x-reverse ${
                          isClaimed 
                            ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : canAfford
                              ? 'bg-gradient-to-l from-[#00F0FF] to-blue-600 text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] cursor-pointer'
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
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
