import React from "react";
import { DiscoveryCatalog } from "@/components/discovery/DiscoveryCatalog";
import { getPopularMovies } from "@/lib/tmdb";

export const metadata = {
  title: "Discovery Catalog | MovieBook",
  description: "Neural movie discovery engine",
};

export default async function DiscoveryPage() {
  // We can seed the initial trending movies
  const initialTrending = await getPopularMovies();
  
  return (
    <main className="w-full">
      <DiscoveryCatalog initialTrending={initialTrending} />
    </main>
  );
}
