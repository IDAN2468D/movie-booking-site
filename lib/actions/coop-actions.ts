'use server';

import { CoopVoteSchema, CoopMatchResult } from '../validations/coop-schema';

// In-memory Co-op session match store for instant zero-latency syncing
const sessionVotesStore: Record<string, Record<string, Record<string, 'like' | 'dislike'>>> = {};
const sessionMovieInfo: Record<string, { title: string; poster: string }> = {};

export async function submitCoopVote(input: unknown) {
  try {
    const validated = CoopVoteSchema.parse(input);
    const { sessionId, playerId, movieId, movieTitle, posterPath, vote } = validated;

    if (!sessionVotesStore[sessionId]) {
      sessionVotesStore[sessionId] = {};
    }
    if (!sessionVotesStore[sessionId][movieId]) {
      sessionVotesStore[sessionId][movieId] = {};
    }

    sessionVotesStore[sessionId][movieId][playerId] = vote;
    if (movieTitle) {
      sessionMovieInfo[movieId] = { title: movieTitle, poster: posterPath || '' };
    }

    // Check if both players voted "like" on the same movie
    const movieVotes = sessionVotesStore[sessionId][movieId];
    const playerIds = Object.keys(movieVotes);

    if (playerIds.length >= 2) {
      const allLiked = Object.values(movieVotes).every((v) => v === 'like');
      if (allLiked) {
        const result: CoopMatchResult = {
          isMatch: true,
          matchedMovieId: movieId,
          matchedMovieTitle: movieTitle,
          matchedPosterPath: posterPath,
        };
        return { success: true, data: result };
      }
    }

    return {
      success: true,
      data: { isMatch: false } as CoopMatchResult,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function checkCoopSessionStatus(sessionId: string) {
  try {
    const session = sessionVotesStore[sessionId];
    if (!session) {
      return { success: true, data: { isMatch: false } };
    }

    for (const [movieId, votes] of Object.entries(session)) {
      if (Object.keys(votes).length >= 2 && Object.values(votes).every((v) => v === 'like')) {
        const info = sessionMovieInfo[movieId] || { title: 'Matched Movie', poster: '' };
        return {
          success: true,
          data: {
            isMatch: true,
            matchedMovieId: movieId,
            matchedMovieTitle: info.title,
            matchedPosterPath: info.poster,
          } as CoopMatchResult,
        };
      }
    }

    return { success: true, data: { isMatch: false } };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}
