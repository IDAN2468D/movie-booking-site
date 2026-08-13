import { describe, it, expect } from 'vitest';
import { getLiveSpoilerStreamAction, postSpoilerCommentAction } from '@/app/actions/communityLiveAudioActions';
import { getBioSensorySnackPairingsAction } from '@/app/actions/bioSensorySnackActions';
import { getSplitPaymentSessionAction, payIndividualSeatAction } from '@/app/actions/splitPaymentActions';
import { predictMoodAndFlavorsAction } from '@/app/actions/bioSensoryMoodActions';

describe('🚀 Master Feature Audit Suite (Sprints 97-101)', () => {
  describe('🎙️ Sprint 97: Live Spoiler Filter & Auto-Archiving Community', () => {
    it('retrieves live spoiler stream and posts a comment with AI spoiler detection', async () => {
      const streamRes = await getLiveSpoilerStreamAction('דילמת המד"ב 2026');
      expect(streamRes.success).toBe(true);
      expect(streamRes.data?.length).toBeGreaterThan(0);

      const postRes = await postSpoilerCommentAction({
        text: 'ספוילר: הגיבור מנצח בסוף',
        movieTitle: 'דילמת המד"ב 2026',
        authorName: 'משתמש בדיקה',
      });
      expect(postRes.success).toBe(true);
      expect(postRes.data?.isSpoiler).toBe(true);
    });
  });

  describe('🍱 Sprint 98: AI Bio-Sensory CineSnacks & Kitchen Timer', () => {
    it('retrieves bio-sensory snack pairings for a movie genre', async () => {
      const res = await getBioSensorySnackPairingsAction('Sci-Fi');
      expect(res.success).toBe(true);
      expect(res.data?.length).toBeGreaterThan(0);
      expect(res.data?.[0]).toHaveProperty('matchScorePercentage');
      expect(res.data?.[0]).toHaveProperty('estimatedPrepTimeSec');
    });
  });

  describe('💳 Sprint 99: 10-Min Session Lock & Group Split Payment', () => {
    it('retrieves split payment session and processes individual seat payment', async () => {
      const sessionRes = await getSplitPaymentSessionAction('split_session_99');
      expect(sessionRes.success).toBe(true);
      expect(sessionRes.data?.remainingSeconds).toBe(600);

      const payRes = await payIndividualSeatAction({
        sessionId: 'split_session_99',
        seatNumber: 'VIP-C2',
        paymentMethod: 'CRYPTO_USDC',
        amountILS: 60,
      });
      expect(payRes.success).toBe(true);
      expect(payRes.data?.seatAllocations.find((s) => s.seatNumber === 'VIP-C2')?.isPaid).toBe(true);
    });
  });

  describe('🔮 Sprint 101: Gemini Live Bio-Sensory Flavor & Mood Predictor', () => {
    it('predicts mood and flavor recommendations based on biometric sliders', async () => {
      const res = await predictMoodAndFlavorsAction({
        energy: 85,
        valence: 70,
        intensity: 90,
      });
      expect(res.success).toBe(true);
      expect(res.data?.predictedMoodName).toBeTruthy();
      expect(res.data?.recommendedMovieTitle).toBeTruthy();
      expect(res.data?.recommendedSnackName).toBeTruthy();
    });
  });
});
