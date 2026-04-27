import React from 'react';
import { getSmartRecommendationsAction } from '@/lib/actions/recommendations';
import SmartPicksView from './SmartPicksView';

/**
 * 🚀 SmartPicks: Server Component for AI Recommendations.
 * Fetches personalized data on the server for maximum performance.
 */
export default async function SmartPicks() {
  // Use the server action directly
  const data = await getSmartRecommendationsAction();

  if (!data || data.recommendations.length === 0) {
    return null;
  }

  return <SmartPicksView data={data} />;
}
