'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Sparkles, Filter, Search } from 'lucide-react';
import { CrowdCampaignCard, CampaignData } from '@/components/cinecrowd/CrowdCampaignCard';
import { PledgeModal } from '@/components/cinecrowd/PledgeModal';
import { CreateCampaignModal } from '@/components/cinecrowd/CreateCampaignModal';
import { getCrowdCampaignsAction } from '@/app/actions/crowdScreeningActions';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export default function CineCrowdPage() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pledgeCampaign, setPledgeCampaign] = useState<CampaignData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await getCrowdCampaignsAction();
      if (res.success && res.campaigns) {
        setCampaigns(res.campaigns as unknown as CampaignData[]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        c.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'all') return matchSearch;
    if (selectedCategory === 'confirmed') return matchSearch && c.status === 'confirmed';
    if (selectedCategory === 'funding') return matchSearch && c.status === 'funding';
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-32" dir="rtl">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto space-y-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit mb-2">
              <Users className="w-3.5 h-3.5" /> CineCrowd • הקרנות קהילה לפי דרישה
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-outfit text-white drop-shadow-md">
              אתם בוחרים את הסרט. <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">אנחנו מביאים אותו למסך הגדול.</span>
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl mt-2 font-inter">
              הצטרפו לקמפיינים פעילים של סרטי פולחן, קלאסיקות והקרנות טרום-בכורה מיוחדות. ברגע שמוגש יעד התומכים — ההקרנה מתקיימת והמקומות משוריינים.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white font-black text-sm shadow-[0_0_25px_rgba(255,20,100,0.4)] flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> השק קמפיין חדש
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'כל ההקרנות' },
              { id: 'funding', label: 'בגיוס המונים ⏳' },
              { id: 'confirmed', label: 'הקרנות מאושרות 🎉' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-white text-zinc-950 shadow-md'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="חיפוש סרט או סניף..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary pr-9"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Grid Feed */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingIndicator variant="spinner" size={32} color="#ff1464" label="טוען קמפיינים קהילתיים..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/40 rounded-3xl border border-white/5 p-8">
            <Sparkles className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">לא נמצאו קמפיינים התואמים לחיפוש</h3>
            <p className="text-xs text-zinc-400 mt-1">היו הראשונים להשיק קמפיין להקרנת סרט שאתם אוהבים!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((campaign) => (
              <CrowdCampaignCard
                key={campaign._id}
                campaign={campaign}
                onPledgeClick={(c) => setPledgeCampaign(c)}
              />
            ))}
          </div>
        )}
      </div>

      <PledgeModal
        campaign={pledgeCampaign}
        onClose={() => setPledgeCampaign(null)}
        onSuccess={fetchCampaigns}
      />

      <CreateCampaignModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchCampaigns}
      />
    </div>
  );
}
