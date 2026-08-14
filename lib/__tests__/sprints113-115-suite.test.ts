import { describe, it, expect, beforeEach } from 'vitest';
import { useTrailerStore } from '@/lib/store/trailer-store';
import { AIMoodRecommendationSchema } from '@/lib/validations/aiRecommendationValidation';
import {
  GetUserCineStatsSchema,
  ClaimAchievementBadgeSchema,
} from '@/lib/validations/cineStatsValidation';

describe('Sprint 113: Floating Trailer Store', () => {
  beforeEach(() => {
    useTrailerStore.getState().closeTrailer();
  });

  it('should initialize with default closed state', () => {
    const state = useTrailerStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.isMinimized).toBe(false);
    expect(state.ambientGlow).toBe(true);
    expect(state.spatialAudio).toBe(true);
  });

  it('should open trailer with provided movie details', () => {
    useTrailerStore.getState().openTrailer({
      movieId: '101',
      movieTitle: 'Dune: Part Two',
      trailerKey: 'Way9Dexny3w',
    });

    const state = useTrailerStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.movieId).toBe('101');
    expect(state.movieTitle).toBe('Dune: Part Two');
    expect(state.trailerKey).toBe('Way9Dexny3w');
    expect(state.isMinimized).toBe(false);
  });

  it('should toggle minimize, ambient glow, and spatial audio', () => {
    useTrailerStore.getState().toggleMinimize();
    expect(useTrailerStore.getState().isMinimized).toBe(true);

    useTrailerStore.getState().toggleAmbientGlow();
    expect(useTrailerStore.getState().ambientGlow).toBe(false);

    useTrailerStore.getState().toggleSpatialAudio();
    expect(useTrailerStore.getState().spatialAudio).toBe(false);
  });

  it('should close trailer and reset key properties', () => {
    useTrailerStore.getState().openTrailer({
      movieId: '101',
      movieTitle: 'Dune: Part Two',
      trailerKey: 'Way9Dexny3w',
    });

    useTrailerStore.getState().closeTrailer();
    const state = useTrailerStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.trailerKey).toBe('');
  });

  it('should support reopening with fallback values', () => {
    const store = useTrailerStore.getState();
    store.openTrailer({
      movieId: '693134',
      movieTitle: 'חולית: חלק 2',
      trailerKey: 'Way9Dexny3w',
    });
    expect(useTrailerStore.getState().isOpen).toBe(true);
    expect(useTrailerStore.getState().movieTitle).toBe('חולית: חלק 2');
  });

  it('should support multi-video list and video switching', () => {
    useTrailerStore.getState().openTrailer({
      movieId: '101',
      movieTitle: 'Dune: Part Two',
      trailerKey: 'key-1',
      videoList: [
        { id: '1', key: 'key-1', name: 'Trailer 1' },
        { id: '2', key: 'key-2', name: 'Trailer 2' },
      ],
    });

    const state = useTrailerStore.getState();
    expect(state.videoList.length).toBe(2);
    expect(state.activeVideoIndex).toBe(0);

    useTrailerStore.getState().selectVideoIndex(1);
    expect(useTrailerStore.getState().activeVideoIndex).toBe(1);
    expect(useTrailerStore.getState().trailerKey).toBe('key-2');

    useTrailerStore.getState().setAudioEnhanceMode('sub-bass');
    expect(useTrailerStore.getState().audioEnhanceMode).toBe('sub-bass');
  });
});

describe('Sprint 114: AI Mood Recommendation Validation', () => {
  it('should validate valid mood inputs', () => {
    const valid = AIMoodRecommendationSchema.safeParse({
      mood: 'אדרנלין ואקשן שיא',
      limit: 4,
    });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.mood).toBe('אדרנלין ואקשן שיא');
      expect(valid.data.limit).toBe(4);
    }
  });

  it('should validate custom prompts', () => {
    const valid = AIMoodRecommendationSchema.safeParse({
      mood: 'custom',
      customPrompt: 'סרט מתח קלאסי עם טוויסט',
    });
    expect(valid.success).toBe(true);
  });

  it('should reject empty mood', () => {
    const invalid = AIMoodRecommendationSchema.safeParse({
      mood: '',
    });
    expect(invalid.success).toBe(false);
  });
});

describe('Sprint 115: CineStats & Badges Validation', () => {
  it('should validate optional userId in stats query', () => {
    const validEmpty = GetUserCineStatsSchema.safeParse({});
    expect(validEmpty.success).toBe(true);

    const validWithUser = GetUserCineStatsSchema.safeParse({ userId: 'user-123' });
    expect(validWithUser.success).toBe(true);
  });

  it('should validate badge claim inputs', () => {
    const valid = ClaimAchievementBadgeSchema.safeParse({ badgeId: 'first_screening' });
    expect(valid.success).toBe(true);

    const invalid = ClaimAchievementBadgeSchema.safeParse({ badgeId: '' });
    expect(invalid.success).toBe(false);
  });
});
