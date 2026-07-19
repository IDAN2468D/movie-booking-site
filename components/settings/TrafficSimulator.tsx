'use client';

import { useTimeShiftStore } from '@/lib/store/timeShiftStore';
import { AlertTriangle, Radar } from 'lucide-react';

export default function TrafficSimulator() {
  const { triggerMockTraffic, trafficStatus } = useTimeShiftStore();

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-md mb-6" dir="rtl">
      <h4 className="text-white font-outfit text-sm mb-3 flex items-center gap-2">
        <Radar className="w-4 h-4 text-violet-400" />
        סימולטור תנועה (Dev Mode)
      </h4>
      <div className="flex items-center gap-4">
        <button
          onClick={triggerMockTraffic}
          className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          הפעל "פקק תנועה כבד"
        </button>
        {trafficStatus && (
          <span className="text-xs text-white/50 font-inter">
            סטטוס נוכחי: <strong className="text-red-400">{trafficStatus}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
