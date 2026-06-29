"use client";

import React from 'react';
import { CastMember, getImageUrl } from '@/lib/tmdb';
import { CastHorizonRow, ICastMember } from '@/components/movies/CastHorizonRow';

interface Props {
  cast: CastMember[];
}

export default function MovieCastSection({ cast }: Props) {
  if (!cast.length) return null;

  // Map TMDB format to ICastMember. Use TMDB's ID prefixed to match our Demo IDs, 
  // but if we want demo data to appear, we can artificially map the first two to our seeded actors
  const mappedCast: ICastMember[] = cast.map((person, index) => {
    // Demo overrides for first two actors to show off the backend integration
    let actorId = `tmdb-${person.id}`;
    if (index === 0) actorId = "actor-keanu";
    if (index === 1) actorId = "actor-bale";

    return {
      actorId,
      name: person.name,
      characterName: person.character,
      avatarUrl: getImageUrl(person.profile_path, 'w500') || ""
    };
  });

  return (
    <section>
      <CastHorizonRow cast={mappedCast} />
    </section>
  );
}
