import { describe, it, expect } from 'vitest';
import { DirectorsAudioSchema } from '../lib/validations/directorsAudio';
import { getDirectorsTriviaAction } from '../app/actions/getDirectorsTriviaActions';

describe("Sprint 52: AI Director's Companion & Audio Isolator", () => {
  it('validates audio mode schema properly', () => {
    const valid = DirectorsAudioSchema.safeParse({
      movieId: 'dune-2',
      timestampSeconds: 45,
      audioMode: 'bass_drop',
    });
    expect(valid.success).toBe(true);

    const invalid = DirectorsAudioSchema.safeParse({
      movieId: 'dune-2',
      timestampSeconds: -10, // negative timestamp
    });
    expect(invalid.success).toBe(false);
  });

  it('returns timestamped trivia and correct frequency filters', async () => {
    const res = await getDirectorsTriviaAction({
      movieId: 'dune-2',
      timestampSeconds: 15,
      audioMode: 'dialogue_boost',
    });

    expect(res.success).toBe(true);
    expect(res.data?.activeTrivia).toBeDefined();
    expect(res.data?.filterConfig.highPassFreq).toBe(1000);
  });
});
