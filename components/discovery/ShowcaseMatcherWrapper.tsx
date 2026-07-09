'use client';

import MovieSwipeDeck from "./MovieSwipeDeck";
import { useState } from "react";

export default function ShowcaseMatcherWrapper({ movies }: { movies: any[] }) {
  const [deckEmpty, setDeckEmpty] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto" dir="ltr">
      {deckEmpty ? (
        <div className="text-center p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
          <h2 className="text-xl text-emerald-400 font-bold mb-2">נמצאה התאמה מושלמת!</h2>
          <p className="text-white/70">מעביר אותך לבחירת מושבים...</p>
        </div>
      ) : (
        <MovieSwipeDeck 
          initialMovies={movies.slice(0, 10)}
          onDeckEmpty={() => setDeckEmpty(true)}
          sessionId="mock-session-123"
        />
      )}
    </div>
  );
}
