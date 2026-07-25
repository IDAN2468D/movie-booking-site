'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GroupOrbitControlsViewProps {
  syncedCount: number;
  totalCount: number;
  statusHebrew: string;
  descriptionHebrew: string;
  onSyncAll: () => void;
  onAddParticipant: () => void;
}

export const GroupOrbitControlsView: React.FC<GroupOrbitControlsViewProps> = ({
  syncedCount,
  totalCount,
  statusHebrew,
  descriptionHebrew,
  onSyncAll,
  onAddParticipant,
}) => {
  return (
    <div className="w-full space-y-4 p-5 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-xl shadow-xl text-right" dir="rtl">
      {/* Group Status Card */}
      <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
        <span className="font-sans font-bold text-neutral-100">
          סטטוס הרמוניה קבוצתית
        </span>
        <span className="font-mono text-xs text-cyan-300 font-bold">
          {syncedCount} / {totalCount} מסונכרנים
        </span>
      </div>

      <p className="text-xs text-neutral-300 font-sans leading-relaxed">
        {descriptionHebrew} ({statusHebrew})
      </p>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddParticipant}
          className="py-2.5 px-3 rounded-xl text-xs font-sans font-bold bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
        >
          ➕ הוסף חבר לקבוצה
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSyncAll}
          className="py-2.5 px-3 rounded-xl text-xs font-sans font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 border border-white/20 shadow-lg backdrop-blur-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
        >
          ⚡ סנכרן את כל החברים
        </motion.button>
      </div>
    </div>
  );
};
