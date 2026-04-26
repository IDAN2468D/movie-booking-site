import React from 'react';
import { getCinemas } from '@/lib/actions/cinemas';
import BranchesClient from '@/components/branches/BranchesClient';
import HolographicBackground from '@/components/ui/HolographicBackground';

export const dynamic = 'force-dynamic';

export default async function BranchesPage() {
  const result = await getCinemas();
  
  const branches = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen bg-[#0A0A0B] overflow-x-hidden relative">
      <HolographicBackground />
      <BranchesClient initialBranches={branches} />
    </main>
  );
}
