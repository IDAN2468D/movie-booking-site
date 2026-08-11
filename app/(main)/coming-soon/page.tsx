import { getUpcomingMoviesAction } from "@/app/actions/movieActions";
import { ComingSoonClient } from "./ComingSoonClient";
import { Suspense } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

export const metadata = {
  title: "בקרוב בקולנוע | תגלית",
  description: "הסרטים שעומדים לצאת בקרוב. צפו בטריילרים והגדירו תזכורות.",
};

export default async function ComingSoonPage() {
  const result = await getUpcomingMoviesAction();
  
  // We handle errors gracefully, passing empty array if failed
  const movies = result.success && result.data ? result.data : [];

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <LoadingIndicator variant="orbit" size="lg" label="טוען סרטים בקרוב..." />
        <p className="text-slate-400 font-bold text-sm animate-pulse">טוען סרטים בקרוב...</p>
      </div>
    }>
      <ComingSoonClient initialMovies={movies} />
    </Suspense>
  );
}

