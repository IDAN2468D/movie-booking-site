import { discoverMovies } from '../lib/tmdb';

async function testSearch() {
  console.log('Testing Advanced Search Logic...');
  
  try {
    const actionMovies = await discoverMovies({ genre: 28, rating: 7 });
    console.log(`Found ${actionMovies.length} action movies with rating > 7`);
    
    if (actionMovies.length > 0) {
      console.log('Sample movie:', actionMovies[0].title, 'Rating:', actionMovies[0].vote_average);
    }
    
    const recentMovies = await discoverMovies({ year: 2024 });
    console.log(`Found ${recentMovies.length} movies from 2024`);
    
  } catch (error) {
    console.error('Search test failed:', error);
  }
}

testSearch();
