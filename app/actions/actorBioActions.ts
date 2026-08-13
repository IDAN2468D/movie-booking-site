'use server';

import { z } from 'zod';

const ActorBioQuerySchema = z.object({
  actorName: z.string().min(1).default('Timothée Chalamet'),
});

export type ActorBioQuery = z.infer<typeof ActorBioQuerySchema>;

export async function fetchActorBioData(input: unknown) {
  try {
    const parsed = ActorBioQuerySchema.parse(input);

    return {
      success: true,
      data: {
        actorName: parsed.actorName,
        birthDate: '1995-12-27',
        knownFor: ['Dune: Part Two', 'Wonka', 'Call Me by Your Name', 'Interstellar'],
        acousticNarrationText: `${parsed.actorName} הוא שחקן קולנוע עטור פרסים. בסרט הטריילר הנוכחי הוא מגלם תפקיד מרכזי עם אקוסטיקת סאונד עוצרת נשימה.`,
        waveformAudioFreqs: [440, 520, 660, 880, 520],
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה בשליפת ביוגרפיית שחקן';
    return { success: false, error: message };
  }
}
