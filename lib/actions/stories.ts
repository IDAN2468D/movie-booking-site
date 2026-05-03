"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Story from "@/lib/models/Story";
import { revalidatePath } from "next/cache";
import { getTrendingMovies } from "@/lib/tmdb";

export async function getStories() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  try {
    let stories = await Story.find().sort({ createdAt: -1 }).lean();
    
    if (stories.length === 0) {
      // Seed some initial stories from TMDB for the dashboard
      const trending = await getTrendingMovies();
      if (trending && trending.length > 0) {
        const initialStories = trending.slice(0, 5).map((movie: any) => ({
          movieId: movie.id.toString(),
          title: movie.displayTitle || movie.title,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          duration: 5000,
          viewedBy: []
        }));
        await Story.insertMany(initialStories);
        stories = await Story.find().sort({ createdAt: -1 }).lean();
      }
    }
    
    return stories.map((story: any) => {
      // Determine if the current user has viewed this story
      const hasViewed = session?.user?.email 
        ? story.viewedBy.includes(session.user.email) 
        : false;
        
      return {
        _id: story._id.toString(),
        movieId: story.movieId,
        title: story.title,
        posterUrl: story.posterUrl,
        duration: story.duration,
        viewedBy: story.viewedBy,
        hasViewed,
      };
    });
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return [];
  }
}

export async function markStoryAsViewed(storyId: string) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return { success: false, message: "Story not found" };
    }

    if (!story.viewedBy.includes(session.user.email)) {
      story.viewedBy.push(session.user.email);
      await story.save();
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark story as viewed:", error);
    return { success: false, message: "Server error" };
  }
}
