import { NextRequest, NextResponse } from "next/server";
import { SoundtrackCatalogSchema, SoundtrackItem } from "@/lib/schemas/soundtrack";

const DEMO_SOUNDTRACKS: SoundtrackItem[] = [
  {
    id: "ost-interstellar-1",
    movieId: 157336,
    movieTitle: "Interstellar",
    songTitle: "Cornfield Chase",
    artist: "Hans Zimmer",
    album: "Interstellar (Original Motion Picture Soundtrack)",
    year: 2014,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    duration: "6:12",
    genre: "Sci-Fi / Ambient"
  },
  {
    id: "ost-dune-1",
    movieId: 438631,
    movieTitle: "Dune",
    songTitle: "Paul's Dream",
    artist: "Hans Zimmer",
    album: "Dune (Original Motion Picture Soundtrack)",
    year: 2021,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    duration: "7:05",
    genre: "Epic Orchestral"
  },
  {
    id: "ost-oppenheimer-1",
    movieId: 872585,
    movieTitle: "Oppenheimer",
    songTitle: "Can You Hear The Music",
    artist: "Ludwig Göransson",
    album: "Oppenheimer (Original Motion Picture Soundtrack)",
    year: 2023,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
    duration: "5:44",
    genre: "Dramatic Violin"
  },
  {
    id: "ost-darkknight-1",
    movieId: 155,
    movieTitle: "The Dark Knight",
    songTitle: "Why So Serious?",
    artist: "Hans Zimmer & James Newton Howard",
    album: "The Dark Knight Soundtrack",
    year: 2008,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    duration: "5:02",
    genre: "Dark Action / Hybrid"
  },
  {
    id: "ost-inception-1",
    movieId: 27205,
    movieTitle: "Inception",
    songTitle: "Time",
    artist: "Hans Zimmer",
    album: "Inception OST",
    year: 2010,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    duration: "4:35",
    genre: "Cinematic Crescendo"
  },
  {
    id: "ost-gladiator-1",
    movieId: 98,
    movieTitle: "Gladiator",
    songTitle: "Now We Are Free",
    artist: "Hans Zimmer & Lisa Gerrard",
    album: "Gladiator OST",
    year: 2000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    duration: "4:14",
    genre: "Vocal Orchestral"
  },
  {
    id: "ost-avatar-1",
    movieId: 19995,
    movieTitle: "Avatar: The Way of Water",
    songTitle: "Into The Water",
    artist: "Simon Franglen",
    album: "Avatar Soundtrack",
    year: 2022,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    coverImage: "https://images.unsplash.com/photo-1518676599602-2170e3d7597c?auto=format&fit=crop&w=600&q=80",
    duration: "3:02",
    genre: "Fantasy World"
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieIdParam = searchParams.get("movieId");
    const queryParam = searchParams.get("query");

    let list = [...DEMO_SOUNDTRACKS];

    if (movieIdParam) {
      const mid = parseInt(movieIdParam, 10);
      list = list.filter(item => item.movieId === mid);

      if (list.length === 0) {
        list = [
          {
            id: `ost-dyn-${mid}`,
            movieId: mid,
            movieTitle: `סרט #${mid}`,
            songTitle: "Theme & Main Title Score",
            artist: "TMTB Cinematic Ensemble",
            album: "Official Soundtrack Collection",
            year: 2026,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
            duration: "6:12",
            genre: "Original Motion Picture Score"
          }
        ];
      }
    }

    if (queryParam) {
      const q = queryParam.toLowerCase();
      list = list.filter(item => 
        item.movieTitle.toLowerCase().includes(q) ||
        item.songTitle.toLowerCase().includes(q) ||
        item.artist.toLowerCase().includes(q) ||
        (item.genre && item.genre.toLowerCase().includes(q))
      );
    }

    const output = SoundtrackCatalogSchema.parse({
      soundtracks: list,
      totalCount: list.length
    });

    return NextResponse.json({ success: true, data: output });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
