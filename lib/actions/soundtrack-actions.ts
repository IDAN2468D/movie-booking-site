'use server';

import { callGeminiWithRetry } from '../gemini';
import { SoundtrackRequestSchema, HarmonicConfigSchema, HarmonicConfig } from '../validations/soundtrack-schema';

export async function generateNeuralSoundtrack(requestData: unknown) {
  try {
    const validated = SoundtrackRequestSchema.parse(requestData);
    
    // Default fallback harmonic config
    const defaultHarmonics: HarmonicConfig = {
      rootFreq: 220,
      scaleType: 'ambient',
      reverbDecay: 3.5,
      filterCutoff: 1800,
      bpm: 75,
      mood: validated.moodPrompt || 'Cinematic Ambient',
    };

    if (!process.env.GOOGLE_AI_API_KEY) {
      return { success: true, data: defaultHarmonics };
    }

    const prompt = `Analyze the movie "${validated.title}" with genres ${validated.genres.join(', ')} and mood "${validated.moodPrompt || 'intense'}". 
Return JSON matching this schema:
{
  "rootFreq": number between 100 and 440,
  "scaleType": one of "minor" | "major" | "pentatonic" | "ambient" | "dark",
  "reverbDecay": number between 1.0 and 8.0,
  "filterCutoff": number between 400 and 4000,
  "bpm": number between 50 and 140,
  "mood": string
}`;

    const rawResponse = await callGeminiWithRetry(
      ['gemini-1.5-flash', 'gemini-1.5-pro'],
      async (model) => {
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        });
        return res.response.text();
      }
    );

    const parsed = JSON.parse(rawResponse);
    const validatedHarmonics = HarmonicConfigSchema.parse(parsed);

    return { success: true, data: validatedHarmonics };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: true,
      data: {
        rootFreq: 180,
        scaleType: 'dark',
        reverbDecay: 4.0,
        filterCutoff: 1200,
        bpm: 65,
        mood: 'Dark Cinematic Ambient',
      } as HarmonicConfig,
      fallbackError: err.message,
    };
  }
}
