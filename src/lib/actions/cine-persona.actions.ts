'use server';

import { PersonaPromptSchema, PersonaResponse } from '../validations/cine-persona.schema';
import { ActionResult } from './crowd-heatmap.actions';

export async function askCinePersonaAction(
  rawInput: unknown
): Promise<ActionResult<PersonaResponse>> {
  try {
    const input = PersonaPromptSchema.parse(rawInput);

    const mockResponse: PersonaResponse = {
      personaName: 'Aura AI Concierge',
      dialogueText: `מבוסס על מצב הרוח שלך ("${input.userPrompt}"), המלצתי הקולנועית הנבחרת מציעה חוויה ויזואלית ואקוסטית יוצאת דופן.`,
      recommendedMovieTitle: 'Dune: Part Two (IMAX 3D Spatial)',
      moodColorHex: '#8A5CFF',
      audioPitchHz: 520,
    };

    return {
      success: true,
      data: mockResponse,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to interact with Cine-Persona Avatar',
    };
  }
}
