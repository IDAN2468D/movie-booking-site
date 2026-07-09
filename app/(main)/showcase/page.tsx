import ShowcaseMatcherWrapper from "@/components/discovery/ShowcaseMatcherWrapper";
import SwipeMatcher from "@/components/movies/SwipeMatcher";
import { getPopularMovies } from "@/lib/tmdb";

export default async function ShowcasePage() {
  const movies = await getPopularMovies();

  return (
    <div className="min-h-screen bg-black/95 p-10 flex flex-col justify-center items-center gap-32 pt-24" dir="rtl">
      <div className="w-full">
        <h1 className="text-white text-4xl mb-10 font-outfit font-bold tracking-tight text-center" style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}>
          מטריצת התאמות החדשה (Liquid Glass 4.0)
        </h1>
        <ShowcaseMatcherWrapper movies={movies} />
      </div>

      <div className="w-full relative z-10">
        <h1 className="text-white text-4xl mb-10 font-outfit font-bold tracking-tight text-center" style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}>
          מטריצת התאמות הישנה (Swipe Matcher)
        </h1>
        <div className="relative w-full h-[600px]">
          <SwipeMatcher movies={movies} userId="showcase-user" />
        </div>
      </div>
    </div>
  );
}
