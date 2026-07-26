const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '993de0b76b63e6f4a2d6abfef0df66ce';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Story schema
const StorySchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  posterUrl: { type: String, required: true },
  duration: { type: Number, default: 5000 },
  viewedBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Story = mongoose.models.Story || mongoose.model('Story', StorySchema);

async function seedMoreStories() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    return;
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB successfully!");

  try {
    const existingCount = await Story.countDocuments();
    console.log(`Current number of stories in DB: ${existingCount}`);

    // Fetch popular/trending movies from TMDB to get fresh content
    console.log("Fetching movies from TMDB...");
    const moviesRes = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=he-IL&page=1`);
    if (!moviesRes.ok) {
      throw new Error(`TMDB API returned status ${moviesRes.status}`);
    }
    const moviesData = await moviesRes.json();
    const tmdbMovies = moviesData.results || [];

    if (tmdbMovies.length === 0) {
      console.log("No movies found on TMDB.");
      return;
    }

    // Get list of already seeded movie IDs
    const existingStories = await Story.find({}, 'movieId').lean();
    const existingMovieIds = new Set(existingStories.map(s => s.movieId));

    // Select movies that aren't already in the stories list
    const newMoviesToSeed = tmdbMovies
      .filter(movie => movie.poster_path && !existingMovieIds.has(movie.id.toString()))
      .slice(0, 6); // Add 6 new stories

    if (newMoviesToSeed.length === 0) {
      console.log("No new movies to add. All fetched popular movies are already in the DB.");
      return;
    }

    const newStories = newMoviesToSeed.map(movie => ({
      movieId: movie.id.toString(),
      title: movie.title || movie.original_title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      duration: 5000,
      viewedBy: []
    }));

    console.log(`Inserting ${newStories.length} new movie stories:`);
    newStories.forEach(s => console.log(` - ${s.title} (ID: ${s.movieId})`));

    const result = await Story.insertMany(newStories);
    console.log(`Successfully added ${result.length} new stories!`);
    
    const totalCount = await Story.countDocuments();
    console.log(`Total stories in DB now: ${totalCount}`);

  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedMoreStories();
