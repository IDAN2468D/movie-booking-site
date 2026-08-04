'use server';

import { MovieOption } from '@/types/seatingGame';

// Hebrew genre mapping for TMDB genre_ids
const GENRE_HEBREW: Record<number, string> = {
  28: 'אקשן', 12: 'הרפתקאות', 16: 'אנימציה', 35: 'קומדיה',
  80: 'פשע', 99: 'דוקומנטרי', 18: 'דרמה', 10751: 'משפחה',
  14: 'פנטזיה', 36: 'היסטוריה', 27: 'אימה', 10402: 'מוזיקה',
  9648: 'מסתורין', 10749: 'רומנטיקה', 878: 'מדע בדיוני',
  53: 'מתח', 10752: 'מלחמה', 37: 'מערבון',
};

// Generate realistic showtimes per movie
function generateShowtimes(idx: number): string[] {
  const allSlots = [
    ['16:00', '18:30', '21:00'],
    ['17:00', '19:30', '22:00'],
    ['16:30', '19:00', '21:30'],
    ['17:30', '20:00', '22:30'],
    ['18:00', '20:30', '23:00'],
  ];
  return allSlots[idx % allSlots.length];
}

// Generate a price bracket based on movie popularity
function generatePrice(voteAvg: number): number {
  if (voteAvg >= 8) return 55;
  if (voteAvg >= 7) return 48;
  if (voteAvg >= 6) return 42;
  return 38;
}

export async function getSeatingGameMovies(): Promise<{
  success: boolean;
  data: MovieOption[];
  error?: string;
}> {
  try {
    const { getPopularMovies, getNowPlayingMovies, getImageUrl } = await import('../tmdb');
    const [popular, nowPlaying] = await Promise.all([
      getPopularMovies().catch(() => []),
      getNowPlayingMovies().catch(() => []),
    ]);

    const combined = [...popular, ...nowPlaying];
    const uniqueMap = new Map<string, MovieOption>();

    combined.forEach((m, idx) => {
      const idStr = String(m.id);
      if (uniqueMap.has(idStr)) return;

      const genreLabels = (m.genre_ids || [])
        .map((gid: number) => GENRE_HEBREW[gid])
        .filter(Boolean)
        .slice(0, 2);

      const genre = genreLabels.length > 0
        ? genreLabels.join(' / ')
        : 'דרמה / הרפתקאות';

      uniqueMap.set(idStr, {
        id: idStr,
        title: m.title || m.name || 'Unknown',
        hebrewTitle: m.displayTitle || m.title || m.name || 'סרט ללא שם',
        poster: getImageUrl(m.poster_path, 'w500'),
        genre,
        duration: `${90 + Math.floor(Math.random() * 80)} דקות`,
        pricePerTicket: generatePrice(m.vote_average || 7),
        showtimes: generateShowtimes(idx),
      });
    });

    return { success: true, data: Array.from(uniqueMap.values()) };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, data: [], error: err.message };
  }
}
