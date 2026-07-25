'use server';

import { MovieReminderSchema, MovieReminderInput, ActiveReminder } from '@/lib/validations/reminder';

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Simulated server-side storage for demo / persistence boundary
const inMemoryRemindersStore: Map<string, ActiveReminder> = new Map();

export async function registerMovieReminderAction(
  rawInput: MovieReminderInput
): Promise<ActionResult<ActiveReminder>> {
  try {
    const validated = MovieReminderSchema.parse(rawInput);
    const key = `${validated.email}_${validated.movieId}`;

    const reminderRecord: ActiveReminder = {
      movieId: validated.movieId,
      movieTitle: validated.movieTitle,
      email: validated.email,
      createdAt: new Date().toISOString(),
    };

    inMemoryRemindersStore.set(key, reminderRecord);

    return {
      success: true,
      data: reminderRecord,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.errors?.[0]?.message || err?.message || 'שגיאה ברשום תזכורת האימייל',
    };
  }
}

export async function removeMovieReminderAction(
  movieId: number,
  email: string
): Promise<ActionResult<{ movieId: number }>> {
  try {
    const key = `${email}_${movieId}`;
    inMemoryRemindersStore.delete(key);

    return {
      success: true,
      data: { movieId },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'שגיאה בביטול התזכורת',
    };
  }
}
