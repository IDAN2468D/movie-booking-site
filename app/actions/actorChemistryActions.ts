"use server";

import { getActorMovieCredits, getMovieCredits, getImageUrl } from "@/lib/tmdb";

export interface CoStarRelation {
  actorId: string;
  name: string;
  avatarUrl: string;
  chemistryScore: number;
  collaborations: {
    movieId: string;
    title: string;
    posterUrl: string;
    characterName: string;
    coStarCharacterName: string;
  }[];
}

const KEANU_RELATIONS: CoStarRelation[] = [
  {
    actorId: "tmdb-2970",
    name: "לורנס פישבורן",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    chemistryScore: 95,
    collaborations: [
      { movieId: "603", title: "המטריקס", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200", characterName: "ניאו", coStarCharacterName: "מורפיוס" }
    ]
  },
  {
    actorId: "tmdb-18277",
    name: "סנדרה בולוק",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    chemistryScore: 85,
    collaborations: [
      { movieId: "1637", title: "ספיד", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200", characterName: "ג'ק טראבן", coStarCharacterName: "אנני פורטר" }
    ]
  },
  {
    actorId: "tmdb-530",
    name: "קארי-אן מוס",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=80",
    chemistryScore: 92,
    collaborations: [
      { movieId: "603", title: "המטריקס", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200", characterName: "ניאו", coStarCharacterName: "טריניטי" }
    ]
  }
];

const BALE_RELATIONS: CoStarRelation[] = [
  {
    actorId: "tmdb-1810",
    name: "הית' לדג'ר",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    chemistryScore: 98,
    collaborations: [
      { movieId: "155", title: "האביר האפל", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200", characterName: "באטמן", coStarCharacterName: "הג'וקר" }
    ]
  },
  {
    actorId: "tmdb-6968",
    name: "יו ג'קמן",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    chemistryScore: 88,
    collaborations: [
      { movieId: "1124", title: "יוקרה", posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200", characterName: "אלפרד בורדן", coStarCharacterName: "רוברט אנג'ייר" }
    ]
  }
];

export async function getActorChemistry(actorId: string): Promise<{ success: boolean; data?: CoStarRelation[]; error?: string }> {
  try {
    if (actorId === "actor-keanu") return { success: true, data: KEANU_RELATIONS };
    if (actorId === "actor-bale") return { success: true, data: BALE_RELATIONS };

    const tmdbId = parseInt(actorId.replace("tmdb-", ""), 10);
    if (isNaN(tmdbId)) return { success: false, error: "מזהה שחקן לא תקין" };

    const credits = await getActorMovieCredits(tmdbId);
    const topMovies = credits.slice(0, 3); // Fetch from top 3 movies
    const relationsMap: Record<number, CoStarRelation> = {};

    await Promise.all(
      topMovies.map(async (movie) => {
        const movieCredits = await getMovieCredits(movie.id);
        const topCoStars = movieCredits.cast
          .filter((c) => c.id !== tmdbId && c.profile_path)
          .slice(0, 2);

        for (const coStar of topCoStars) {
          if (!relationsMap[coStar.id]) {
            relationsMap[coStar.id] = {
              actorId: `tmdb-${coStar.id}`,
              name: coStar.name,
              avatarUrl: getImageUrl(coStar.profile_path, "w500") || "",
              chemistryScore: 60,
              collaborations: [],
            };
          }

          relationsMap[coStar.id].collaborations.push({
            movieId: `${movie.id}`,
            title: movie.title,
            posterUrl: getImageUrl(movie.poster_path, "w500") || "",
            characterName: movie.character,
            coStarCharacterName: coStar.character,
          });

          relationsMap[coStar.id].chemistryScore = Math.min(
            100,
            relationsMap[coStar.id].chemistryScore + 20
          );
        }
      })
    );

    return { success: true, data: Object.values(relationsMap) };
  } catch (error: unknown) {
    console.error("Failed to fetch actor chemistry:", error);
    return { success: false, error: "שגיאה בחישוב קשרי שחקנים" };
  }
}
