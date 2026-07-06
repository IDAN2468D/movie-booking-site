import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getNowPlayingMovies } from "@/lib/tmdb";
import SwipeMatcher from "@/components/movies/SwipeMatcher";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Movie Matcher | MovieBook",
  description: "Find your perfect movie for tonight",
};

export default async function MatchPage() {
  const session = await getServerSession(authOptions);
  
  // Require login to use the matcher because it needs a userId
  if (!session || !session.user) {
    redirect("/login");
  }

  const movies = await getNowPlayingMovies();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-['Outfit'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-500 mb-4">
          Movie Matcher
        </h1>
        <p className="text-lg text-neutral-400 font-['Inter'] max-w-md mx-auto">
          החלק ימינה כדי לאהוב, שמאלה כדי להעביר. אנחנו נמצא עבורך את ההקרנה המושלמת להיום!
        </p>
      </div>

      <div className="w-full max-w-2xl relative">
        <SwipeMatcher movies={movies} userId={session.user.id} />
      </div>
    </div>
  );
}
