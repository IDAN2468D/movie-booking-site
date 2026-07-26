const API_KEY = '993de0b76b63e6f4a2d6abfef0df66ce';
const movies = [
  { id: 1, title: 'חולית: חלק שני', search: 'Dune: Part Two' },
  { id: 2, title: 'אופנהיימר', search: 'Oppenheimer' },
  { id: 3, title: 'בלייד ראנר 2049', search: 'Blade Runner 2049' },
  { id: 4, title: 'בין כוכבים', search: 'Interstellar' },
  { id: 5, title: 'אווטאר: דרכם של המים', search: 'Avatar: The Way of Water' },
  { id: 6, title: 'התחלה (Inception)', search: 'Inception' },
  { id: 7, title: 'ספיידרמן: מעבר לממדי העכביש', search: 'Spider-Man: Across the Spider-Verse' },
  { id: 8, title: 'האביר האפל', search: 'The Dark Knight' },
  { id: 9, title: 'טרון: המורשת', search: 'TRON: Legacy' },
  { id: 10, title: 'לה לה לנד', search: 'La La Land' }
];

async function verify() {
  const results = [];
  for (const item of movies) {
    const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(item.search)}`);
    const searchData = await searchRes.json();
    const movie = searchData.results?.[0];
    if (movie) {
      const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
      const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : null;
      
      // verify HTTP status of both
      const bRes = backdrop ? await fetch(backdrop, { method: 'HEAD' }) : { status: 404 };
      const pRes = poster ? await fetch(poster, { method: 'HEAD' }) : { status: 404 };
      
      results.push({
        id: item.id,
        title: item.title,
        backdropUrl: backdrop,
        backdropStatus: bRes.status,
        posterUrl: poster,
        posterStatus: pRes.status
      });
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

verify();
