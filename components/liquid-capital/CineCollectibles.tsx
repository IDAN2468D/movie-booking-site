'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';
import { purchaseCollectible } from '@/lib/actions/collectibles';
import { useSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CineCollectibles = ({ initialCollectibles }: { initialCollectibles: any[] }) => {
  const { data: session } = useSession();
  const [collectibles, setCollectibles] = useState(initialCollectibles);
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (collectibleId: string) => {
    if (!session?.user) return alert('יש להתחבר כדי לרכוש');
    
    setLoading(collectibleId);
    const res = await purchaseCollectible(session.user.id || 'guest', { collectibleId });
    
    if (res.success) {
      alert('נרכש בהצלחה! הפריט נוסף לאוסף שלך.');
      setCollectibles(prev => prev.map(c => c._id === collectibleId ? { ...c, stock: c.stock - 1 } : c).filter(c => c.stock > 0));
    } else {
      alert(res.error || 'שגיאה ברכישה');
    }
    setLoading(null);
  };

  return (
    <div className="w-full space-y-6 relative mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Diamond className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight font-outfit">אספנות קולנועית (Digital Collectibles)</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collectibles.map(item => (
          <motion.div key={item._id} whileHover={{ scale: 1.05 }} className="bg-gradient-to-b from-white/[0.05] to-black border border-white/10 rounded-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-40 w-full bg-black/50 p-4 flex items-center justify-center relative overflow-hidden">
              {/* Fallback visual for NFT */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 animate-spin-slow opacity-80 mix-blend-screen shadow-[0_0_30px_rgba(34,211,238,0.5)]" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
              <p className="text-xs text-cyan-400 mb-3">{item.rarity} • נותרו {item.stock}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-white font-mono font-bold">{item.price.toLocaleString()} PTS</span>
                <button
                  onClick={() => handlePurchase(item._id)}
                  disabled={loading === item._id}
                  className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {loading === item._id ? 'רוכש...' : 'רכוש עכשיו'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
