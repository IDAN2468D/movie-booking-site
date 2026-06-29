import { z } from 'zod';

export const getActorSchema = z.object({
  actorId: z.string().min(1, "מזהה השחקן אינו תקין או שהוסר מהמערכת")
});

export type GetActorInput = z.infer<typeof getActorSchema>;

// Additional message to return from DB if actor is not found:
export const ACTOR_NOT_FOUND_MSG = "לא נמצא מידע ביוגרפי עבור שחקן זה";
