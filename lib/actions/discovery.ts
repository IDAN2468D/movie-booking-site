"use server";

import clientPromise from "@/lib/mongodb";
import { DiscoveryQuerySchema } from "@/lib/validations/discovery";

/**
 * 🎫 Server Action: Neural Discovery Catalog
 * Implements Server-Side Pagination Boundary & Edge Validation
 */
export async function discoverMoviesAction(rawQuery: any) {
  try {
    // 1. Zod Validation (Edge Boundary)
    const query = DiscoveryQuerySchema.parse(rawQuery);
    
    // 2. Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('moviebook');
    
    const { bubbles, page, limit } = query;
    const skip = (page - 1) * limit;
    
    // 3. Construct Match Query from Neural Bubbles
    const matchQuery: any = {};
    
    if (bubbles && bubbles.length > 0) {
      bubbles.forEach((bubble) => {
        if (bubble.type === "genre") {
          if (!matchQuery.genre_ids) matchQuery.genre_ids = { $all: [] };
          matchQuery.genre_ids.$all.push(bubble.value);
        } else if (bubble.type === "runtime") {
          // Assume bubble.value is max runtime
          matchQuery.runtime = { $lte: Number(bubble.value) };
        } else if (bubble.type === "rating") {
          // Assume bubble.value is min rating
          matchQuery.vote_average = { $gte: Number(bubble.value) };
        } else if (bubble.type === "mood" || bubble.type === "tension") {
          // Custom mapping for neural concepts
          if (!matchQuery.tags) matchQuery.tags = { $in: [] };
          matchQuery.tags.$in.push(bubble.label);
        }
      });
    }

    // 4. Aggregation Pipeline
    const pipeline = [
      { $match: matchQuery },
      { $sort: { popularity: -1, release_date: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const movies = await db.collection("movies").aggregate(pipeline).toArray();
    
    // Fallback if movies collection doesn't exist or is empty 
    // (Ideally we sync TMDB to MongoDB. If empty, return TMDB proxy logic)
    if (!movies || movies.length === 0) {
      const { discoverMovies } = await import('@/lib/tmdb');
      
      const tmdbParams: any = { page };
      
      if (bubbles && bubbles.length > 0) {
        bubbles.forEach((bubble) => {
          if (bubble.type === "genre") {
            tmdbParams.genre = Number(bubble.value);
          } else if (bubble.type === "rating") {
            tmdbParams.rating = Number(bubble.value);
          } else if (bubble.type === "runtime") {
            tmdbParams.maxRuntime = Number(bubble.value);
          }
        });
      }
      
      const tmdbMovies = await discoverMovies(tmdbParams);
      
      return {
        success: true,
        data: {
          movies: JSON.parse(JSON.stringify(tmdbMovies)),
          pagination: {
            page,
            limit: 20, // TMDB page size
            total: 10000, // TMDB generic mock total
            totalPages: 500
          }
        }
      };
    }
    
    const totalCount = await db.collection("movies").countDocuments(matchQuery);
    
    return { 
      success: true, 
      data: {
        movies: JSON.parse(JSON.stringify(movies)),
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      } 
    };

  } catch (error: any) {
    console.error('Discovery query error:', error);
    return { success: false, error: error.message };
  }
}
