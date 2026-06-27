'use client';

import React, { useOptimistic, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, Wifi, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { syncPhantomInvite } from '@/lib/actions/phantom';

export const PhantomPresence = ({ initialInvites }: { initialInvites: any[] }) => {
  const [invites, addOptimisticSync] = useOptimistic(
    initialInvites,
    (state: any[], updatedId: string) => 
      state.map(inv => inv._id === updatedId ? { ...inv, status: 'synced', accessKey: 'WEBRTC_ESTABLISHING...' } : inv)
  );

  const handleSync = async (inviteId: string) => {
    startTransition(() => {
      addOptimisticSync(inviteId);
    });
    await syncPhantomInvite(inviteId);
  };

  return (
    <div className="w-full space-y-6 relative mt-4">
      <div className="flex items-center gap-5 mb-10 relative group">
        <motion.div 
          className="relative flex items-center justify-center p-2"
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <Ghost className="w-10 h-10 text-[#10b981] relative z-10 drop-shadow-[0_0_16px_rgba(16,185,129,0.9)]" />
          <Sparkles className="w-5 h-5 text-white absolute -top-2 -right-2 z-20 animate-pulse drop-shadow-md" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#10b981] to-[#34d399] blur-2xl rounded-full"
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </motion.div>
        
        <div className="relative">
          <motion.h2 
            className="text-4xl md:text-5xl font-black tracking-tighter font-outfit drop-shadow-lg flex flex-col leading-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#10b981] via-[#d1fae5] to-[#10b981] bg-[length:200%_auto] pb-1">
              Phantom Presence
            </span>
            <span className="text-white/50 font-medium text-sm md:text-base tracking-[0.2em] uppercase mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]"></span>
              WebRTC Remote Sync
            </span>
          </motion.h2>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group">
          <Mail className="w-5 h-5 text-white/70 group-hover:text-white" />
          <span className="font-bold">שגר הזמנת פנטום חדשה</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <AnimatePresence>
          {invites.map((invite) => (
            <motion.div
              key={invite._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 rounded-2xl border border-[#10b981]/20 hover:border-[#10b981]/50 transition-all flex flex-col gap-4 relative overflow-hidden"
            >
              {invite.status === 'synced' && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent pointer-events-none" />
              )}
              
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white mb-1">
                    {invite.guestEmail}
                  </span>
                  <span className="text-white/50 text-sm">הזמנה לסרט: {invite.bookingId}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-white/10">
                  <Ghost className={`w-6 h-6 ${invite.status === 'synced' ? 'text-[#10b981] animate-pulse' : 'text-white/30'}`} />
                </div>
              </div>

              <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center justify-between text-sm z-10">
                <div className="flex items-center gap-2">
                  <Wifi className={`w-4 h-4 ${invite.status === 'synced' ? 'text-[#10b981]' : 'text-white/30'}`} />
                  <span className={invite.status === 'synced' ? 'text-white' : 'text-white/50'}>
                    {invite.status === 'synced' ? 'SMPTE TIMECODE SYNCED' : 'WAITING FOR CONNECTION'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 z-10 border-t border-white/5 pt-4">
                <span className="text-sm font-mono text-[#10b981]/70">{invite.accessKey || '---'}</span>
                {invite.status === 'pending' || invite.status === 'accepted' ? (
                  <button
                    onClick={() => handleSync(invite._id)}
                    className="bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-black px-6 py-2 rounded-xl text-sm font-bold transition-all border border-[#10b981]/30"
                  >
                    הפעל חיבור WebRTC
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm bg-[#10b981]/10 px-4 py-2 rounded-xl border border-[#10b981]/20">
                    <CheckCircle2 className="w-4 h-4" />
                    החבר מחובר
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
