'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check, Film, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { 
  getExternalSyncProfileAction, 
  updateExternalSyncAction, 
  importExternalWatchlistAction 
} from '@/app/actions/scrobbleActions';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export const ExternalSyncSettings: React.FC<{ userId?: string }> = ({ userId = 'default_user' }) => {
  const [profile, setProfile] = useState<{
    traktConnected: boolean;
    traktUsername?: string;
    letterboxdConnected: boolean;
    letterboxdUsername?: string;
    autoScrobbleOnTicketScan: boolean;
    syncRatings: boolean;
  }>({
    traktConnected: true,
    traktUsername: 'cinephile_il',
    letterboxdConnected: true,
    letterboxdUsername: 'idan_movies',
    autoScrobbleOnTicketScan: true,
    syncRatings: true,
  });

  const [loading, setLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getExternalSyncProfileAction(userId);
      if (res.success && res.profile) {
        setProfile(res.profile);
      }
    };
    loadProfile();
  }, [userId]);

  const togglePlatform = async (platform: 'trakt' | 'letterboxd') => {
    setLoading(true);
    const isConn = platform === 'trakt' ? profile.traktConnected : profile.letterboxdConnected;
    try {
      const res = await updateExternalSyncAction({
        userId,
        platform,
        connected: !isConn,
        username: !isConn ? (platform === 'trakt' ? 'trakt_user' : 'letterboxd_user') : '',
      });
      if (res.success && res.profile) {
        setProfile(res.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (platform: 'trakt' | 'letterboxd') => {
    setLoading(true);
    try {
      const res = await importExternalWatchlistAction(userId, platform);
      if (res.success && res.message) {
        setSyncMessage(res.message);
        setTimeout(() => setSyncMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-6 shadow-2xl space-y-6 text-right" dir="rtl">
      <div>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit mb-2">
          <Film className="w-3.5 h-3.5" /> סנכרון רשתות קולנוע (Letterboxd & Trakt)
        </div>
        <h3 className="text-xl font-black text-white font-outfit">
          סנכרון יומן צפייה ודירוגים אוטומטי
        </h3>
        <p className="text-xs text-zinc-400 mt-1 font-inter">
          חברו את חשבון Letterboxd או Trakt כדי לסנכרן אוטומטית כל כרטיס שנסרק בכניסה לאולם ליומן הצפייה שלכם.
        </p>
      </div>

      {syncMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> {syncMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Letterboxd Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <h4 className="text-sm font-black text-white font-outfit">Letterboxd Diary</h4>
            </div>
            <button
              onClick={() => togglePlatform('letterboxd')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${profile.letterboxdConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-zinc-400'}`}
            >
              {profile.letterboxdConnected ? 'מחובר' : 'התחבר'}
            </button>
          </div>
          {profile.letterboxdConnected && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-zinc-400 font-mono">@{profile.letterboxdUsername}</span>
              <button
                onClick={() => handleImport('letterboxd')}
                disabled={loading}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-bold"
              >
                ייבא רשימת צפייה <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Trakt.tv Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <h4 className="text-sm font-black text-white font-outfit">Trakt.tv Scrobble</h4>
            </div>
            <button
              onClick={() => togglePlatform('trakt')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${profile.traktConnected ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-zinc-400'}`}
            >
              {profile.traktConnected ? 'מחובר' : 'התחבר'}
            </button>
          </div>
          {profile.traktConnected && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-zinc-400 font-mono">@{profile.traktUsername}</span>
              <button
                onClick={() => handleImport('trakt')}
                disabled={loading}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-bold"
              >
                ייבא סרטים שנצפו <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 p-3 rounded-xl border border-white/5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>סנכרון מיידי בעת סריקת הברקוד בכניסה לאולם (Auto-Scrobble on Hall Entry).</span>
      </div>
    </div>
  );
};
