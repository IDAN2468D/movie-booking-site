import { describe, it, expect } from 'vitest';
import { getStemPresetsAction, saveCustomStemPresetAction } from '@/app/actions/stemMixerActions';
import { generateScreenplayBranchAction } from '@/app/actions/screenplayBranchActions';
import { getCoWatchingSessionAction, toggleMemberReadyAction } from '@/app/actions/coWatchingActions';
import { getLiveAuctionStateAction, submitAuctionBidAction } from '@/app/actions/auctionBidActions';
import { getAfterglowTriviaAction, getAfterglowDiscussionsAction } from '@/app/actions/afterglowActions';

describe('🚀 Next-Gen CinePulse Feature Suite (Sprints 92-96)', () => {
  describe('🎵 Stem Mixer Actions', () => {
    it('retrieves default stem presets correctly', async () => {
      const res = await getStemPresetsAction();
      expect(res.success).toBe(true);
      expect(res.data?.length).toBeGreaterThan(0);
      expect(res.data?.[0]).toHaveProperty('dialogue');
      expect(res.data?.[0]).toHaveProperty('subBassSweepHz');
    });

    it('saves a valid custom stem preset', async () => {
      const res = await saveCustomStemPresetAction({
        id: 'test_custom',
        name: 'פריסט בדיקה אישי',
        description: 'הגדרת בדיקה לאולפן',
        dialogue: 80,
        score: 70,
        bass: 90,
        fx: 60,
        subBassSweepHz: 42,
        spatialSpread: 80,
      });
      expect(res.success).toBe(true);
      expect(res.data?.name).toBe('פריסט בדיקה אישי');
    });
  });

  describe('🎬 Screenplay Branch Actions', () => {
    it('generates fallback screenplay node when offline/mocking', async () => {
      const res = await generateScreenplayBranchAction({
        movieTitle: 'דילמת המד"ב 2026',
        divergencePoint: 'הגיבור סירב להיכנס לחור השחור',
      });
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data?.summary).toBeTruthy();
      expect(res.data?.choices.length).toBeGreaterThan(0);
    });
  });

  describe('🌐 Co-Watching Group Sync Actions', () => {
    it('fetches co-watching session and toggles member readiness', async () => {
      const sessionRes = await getCoWatchingSessionAction('sync_cinema_alpha');
      expect(sessionRes.success).toBe(true);
      expect(sessionRes.data?.members.length).toBeGreaterThan(0);

      const toggleRes = await toggleMemberReadyAction('sync_cinema_alpha', 'user_1');
      expect(toggleRes.success).toBe(true);
    });
  });

  describe('⚡ VIP Seat Auction Actions', () => {
    it('retrieves active auction state and handles bid placement', async () => {
      const auctionRes = await getLiveAuctionStateAction('vip_auction_101');
      expect(auctionRes.success).toBe(true);
      expect(auctionRes.data?.currentBid).toBeGreaterThan(0);

      const currentBid = auctionRes.data!.currentBid;
      const bidRes = await submitAuctionBidAction({
        auctionId: 'vip_auction_101',
        bidAmount: currentBid + 25,
        bidderName: 'משתמש בדיקה',
      });
      expect(bidRes.success).toBe(true);
      expect(bidRes.data?.currentBid).toBe(currentBid + 25);
    });

    it('rejects bids lower than or equal to the current bid', async () => {
      const auctionRes = await getLiveAuctionStateAction('vip_auction_101');
      const bidRes = await submitAuctionBidAction({
        auctionId: 'vip_auction_101',
        bidAmount: auctionRes.data!.currentBid - 5,
        bidderName: 'משתמש בדיקה',
      });
      expect(bidRes.success).toBe(false);
    });
  });

  describe('💬 Afterglow Lounge & Trivia Actions', () => {
    it('retrieves post-movie trivia questions and community discussions', async () => {
      const triviaRes = await getAfterglowTriviaAction('דילמת המד"ב 2026');
      expect(triviaRes.success).toBe(true);
      expect(triviaRes.data?.length).toBeGreaterThan(0);

      const discRes = await getAfterglowDiscussionsAction();
      expect(discRes.success).toBe(true);
      expect(discRes.data?.length).toBeGreaterThan(0);
      expect(discRes.data?.[0]).toHaveProperty('isSpoiler');
    });
  });
});
