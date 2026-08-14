'use client';

import React from 'react';

interface KeyboardShortcutHintProps {
  keys: string[];
  className?: string;
}

export function KeyboardShortcutHint({
  keys,
  className = '',
}: KeyboardShortcutHintProps) {
  return (
    <div className={`inline-flex items-center gap-1 font-mono text-[10px] select-none ${className}`} dir="ltr">
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-white/30 text-[9px]">+</span>}
          <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-white/80 font-bold shadow-sm shadow-black/40">
            {k}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  );
}
