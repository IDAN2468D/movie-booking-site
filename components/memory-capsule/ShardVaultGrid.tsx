'use client';

import React, { useState, useEffect } from 'react';
import { MemoryShard, ShardRarity } from '@/lib/schemas/memoryCapsule.schema';
import { fetchUserMemoryVault } from '@/lib/actions/memoryCapsuleActions';
import { MemoryShardCard } from './MemoryShardCard';
import { ShardMintModal } from './ShardMintModal';
import { Gem, Plus, Sparkles } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export function ShardVaultGrid() {
  const [shards, setShards] = useState<MemoryShard[]>([]);
  const [filterRarity, setFilterRarity] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isMintOpen, setIsMintOpen] = useState(false);

  useEffect(() => {
    fetchUserMemoryVault().then((res) => {
      if (res.success && res.data) {
        setShards(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  const filteredShards = filterRarity === 'ALL'
    ? shards
    : shards.filter((s) => s.rarity === filterRarity);

  const totalVaultValue = shards.reduce((acc, s) => acc + s.marketValueIls, 0);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-[36px] bg-black/60 backdrop-blur-3xl border border-purple-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-black">
            <Gem size={16} />
            <span>כספת שברי הזיכרון • Digital Shard Vault</span>
          </div>
          <h1 className="text-3xl font-black text-white font-rubik">אוסף הזיכרונות הקולנועיים שלי</h1>
          <p className="text-xs text-off-white/60">
            {shards.length} שברים נאספו • שווי תיק משוער: <span className="text-amber-400 font-mono font-bold">₪{totalVaultValue}</span>
          </p>
        </div>

        <button
          onClick={() => setIsMintOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:opacity-90 text-white font-black text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 shrink-0"
        >
          <Plus size={18} />
          <span>הנפק שבר זיכרון חדש</span>
        </button>
      </div>

      {/* Rarity Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'MYTHIC', 'EPIC', 'RARE', 'COMMON'].map((rarity) => (
          <button
            key={rarity}
            onClick={() => setFilterRarity(rarity)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filterRarity === rarity
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 text-off-white/60 border border-white/5 hover:bg-white/10'
            }`}
          >
            {rarity === 'ALL' ? 'כל השברים' : rarity}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <LoadingIndicator variant="spinner" size={32} color="#A855F7" label="טוען שברי זיכרון מהכספת..." />
        </div>
      ) : filteredShards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShards.map((shard) => (
            <MemoryShardCard key={shard.shardId} shard={shard} />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-black/40 border border-white/10 text-center text-off-white/40">
          לא נמצאו שברים בקטגוריה זו
        </div>
      )}

      <ShardMintModal
        isOpen={isMintOpen}
        onClose={() => setIsMintOpen(false)}
        movieId="693134"
        movieTitle="חולית: חלק 2"
        onMinted={(newShard) => setShards((prev) => [newShard, ...prev])}
      />
    </div>
  );
}
