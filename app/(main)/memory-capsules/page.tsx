'use client';

import React from 'react';
import { ShardVaultGrid } from '@/components/memory-capsule/ShardVaultGrid';

export default function MemoryCapsulesPage() {
  return (
    <div className="min-h-screen px-4 md:px-12 py-8 space-y-8">
      <ShardVaultGrid />
    </div>
  );
}
