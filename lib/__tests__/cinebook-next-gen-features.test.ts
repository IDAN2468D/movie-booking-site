import { describe, it, expect } from 'vitest';
import { createCrowdCampaignSchema, pledgeCrowdCampaignSchema } from '@/lib/validations/crowdScreening';
import { updateExternalSyncSchema, scrobbleTicketScanSchema } from '@/lib/validations/scrobbleValidation';
import { createSeatExchangeSchema, acceptSeatExchangeSchema } from '@/lib/validations/seatExchangeValidation';
import { useStealthTrayStore } from '@/lib/store/stealthTrayStore';

describe('CineBook Next-Gen Features Suite (v1.0 SDD)', () => {
  describe('Feature 1: CineCrowd Validations', () => {
    it('validates a valid campaign creation payload', () => {
      const payload = {
        movieId: 'm-123',
        movieTitle: 'מועדון קרב (Fight Club)',
        moviePoster: 'https://example.com/poster.jpg',
        genre: 'קלאסיקה',
        branchId: 'b-tlv',
        branchName: 'תל אביב IMAX',
        targetDate: new Date().toISOString(),
        minThreshold: 50,
        ticketPrice: 45,
        creatorUserId: 'u-1',
        creatorName: 'יואב',
      };
      const result = createCrowdCampaignSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects campaign with threshold lower than 10', () => {
      const payload = {
        movieId: 'm-123',
        movieTitle: 'מועדון קרב',
        moviePoster: 'https://example.com/poster.jpg',
        branchId: 'b-tlv',
        branchName: 'תל אביב',
        targetDate: new Date().toISOString(),
        minThreshold: 5, // invalid
        creatorUserId: 'u-1',
        creatorName: 'יואב',
      };
      const result = createCrowdCampaignSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('validates a backer pledge with 1-10 seats', () => {
      const pledge = {
        campaignId: 'c-1',
        userId: 'u-10',
        userName: 'נועה',
        seatsCount: 3,
        paymentIntentId: 'pi_hold_123',
      };
      const result = pledgeCrowdCampaignSchema.safeParse(pledge);
      expect(result.success).toBe(true);
    });
  });

  describe('Feature 2: Stealth Tray Store', () => {
    it('initializes in inactive state and toggles properly', () => {
      const store = useStealthTrayStore.getState();
      expect(store.isStealthActive).toBe(false);
      store.toggleStealthMode(true);
      expect(useStealthTrayStore.getState().isStealthActive).toBe(true);
      store.toggleStealthMode(false);
      expect(useStealthTrayStore.getState().isStealthActive).toBe(false);
    });

    it('adds items and calculates quantities correctly', () => {
      const store = useStealthTrayStore.getState();
      store.clearStealthOrder();
      store.addStealthItem({ id: 'pop-1', name: 'פופקורן', category: 'popcorn', price: 30, icon: '🍿' });
      expect(useStealthTrayStore.getState().stealthItems.length).toBe(1);
      expect(useStealthTrayStore.getState().stealthItems[0].quantity).toBe(1);

      store.updateStealthQuantity('pop-1', 1);
      expect(useStealthTrayStore.getState().stealthItems[0].quantity).toBe(2);
    });
  });

  describe('Feature 3: Letterboxd & Trakt Scrobble Validations', () => {
    it('validates external account connection toggle', () => {
      const syncData = {
        userId: 'u-1',
        platform: 'letterboxd' as const,
        connected: true,
        username: 'idan_cinephile',
        autoScrobbleOnTicketScan: true,
      };
      const result = updateExternalSyncSchema.safeParse(syncData);
      expect(result.success).toBe(true);
    });

    it('validates barcode scan scrobble trigger', () => {
      const scan = {
        userId: 'u-1',
        movieId: 'dune-2',
        movieTitle: 'חולית 2',
        bookingReference: 'CP-987654',
      };
      const result = scrobbleTicketScanSchema.safeParse(scan);
      expect(result.success).toBe(true);
    });
  });

  describe('Feature 5: Dynamic Surge Seat Exchange Validations', () => {
    it('validates seat swap proposal payload', () => {
      const req = {
        showtimeId: 'st-101',
        movieId: 'dune-2',
        movieTitle: 'חולית 2',
        ticketId: 'tkt-1',
        requesterUserId: 'u-101',
        requesterName: 'רועי',
        currentSeatId: 'שורה 4, מושב 12',
        desiredTiers: ['VIP', 'PRIME'],
        desiredRow: 'שורה 8',
        bidDiffPrice: 15,
      };
      const result = createSeatExchangeSchema.safeParse(req);
      expect(result.success).toBe(true);
    });

    it('validates peer swap acceptance payload', () => {
      const accept = {
        requestId: 'req-1',
        acceptorUserId: 'u-102',
        acceptorName: 'דנה',
        acceptorTicketId: 'tkt-2',
        acceptorSeatId: 'שורה 8, מושב 14',
      };
      const result = acceptSeatExchangeSchema.safeParse(accept);
      expect(result.success).toBe(true);
    });
  });
});
