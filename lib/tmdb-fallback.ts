import { type Movie } from '@/lib/tmdb';

export function getFallbackMovies(): Movie[] {
  const createMock = (id: number, title: string): Movie => ({
    id,
    title,
    displayTitle: title,
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.5,
    release_date: '2024-01-01',
    overview: 'Mock movie for testing purposes.',
    genre_ids: [28, 12]
  });

  return [
    createMock(1, 'חולית: חלק 2'),
    createMock(2, 'אופנהיימר'),
    createMock(3, 'ברבי')
  ];
}
