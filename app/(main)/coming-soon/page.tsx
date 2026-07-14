import { getUpcomingMoviesAction } from "@/app/actions/movieActions";
import { ComingSoonClient } from "./ComingSoonClient";
import { Suspense } from "react";

export const metadata = {
  title: "בקרוב בקולנוע | תגלית",
  description: "הסרטים שעומדים לצאת בקרוב. צפו בטריילרים והגדירו תזכורות.",
};

export default async function ComingSoonPage() {
  const result = await getUpcomingMoviesAction();
  
  // We handle errors gracefully, passing empty array if failed
  const movies = result.success && result.data ? result.data : [];

  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ComingSoonClient initialMovies={movies} />
    </Suspense>
  );
}
