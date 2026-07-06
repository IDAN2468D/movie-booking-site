import { getMovieDetails, getMovieVideos, getImageUrl } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { movieId: string } }) {
  const { movieId } = await params;
  const movie = await getMovieDetails(Number(movieId));
  return { title: `שידור חי: ${movie?.title} | MovieBook` };
}

export default async function LiveCinemaPage({ params }: { params: { movieId: string } }) {
  const { movieId } = await params;
  const id = Number(movieId);
  if (isNaN(id)) notFound();

  const [movie, videos] = await Promise.all([
    getMovieDetails(id),
    getMovieVideos(id),
  ]);

  if (!movie) notFound();

  const trailer = videos.find(v => v.type === 'Trailer' || v.type === 'Teaser');
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex flex-col" dir="rtl">
      
      {/* Immersive Background Fallback / Loader */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover opacity-20 blur-2xl saturate-[200%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Header Overlay */}
      <header className="relative z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <h1 className="text-red-500 font-bold tracking-widest uppercase text-sm">Live Broadcast</h1>
          </div>
          <h2 className="text-3xl font-['Outfit'] font-bold text-white mt-2 drop-shadow-lg">{movie.title}</h2>
          <p className="text-gray-400 font-['Inter'] mt-1 max-w-xl line-clamp-1">{movie.overview}</p>
        </div>
        
        <Link href="/match" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold backdrop-blur-md transition-all text-white">
          סגור שידור
        </Link>
      </header>

      {/* Main Broadcast Frame */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative group">
          {trailer ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Image 
                src={backdropUrl}
                alt={movie.title}
                fill
                className="object-cover opacity-50"
              />
              <div className="z-10 text-center">
                <span className="text-6xl mb-4 block">📡</span>
                <h3 className="text-2xl font-bold">השידור יתחיל בקרוב...</h3>
                <p className="text-gray-400 mt-2">מחכים לחיבור ללוויין</p>
              </div>
            </div>
          )}
          
          {/* Glass Overlay Borders for Cinematic Feel */}
          <div className="absolute inset-0 border-[1px] border-white/10 rounded-3xl pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-none" />
        </div>
      </main>

      {/* Footer / Meta Overlay */}
      <footer className="relative z-20 p-6 bg-gradient-to-t from-black to-transparent flex justify-between items-end">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase">זמן ריצה</span>
            <span className="font-bold">{movie.runtime} דק'</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase">דירוג קוונטי</span>
            <span className="font-bold text-emerald-400">{movie.vote_average.toFixed(1)}/10</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {movie.genres?.slice(0, 3).map(g => (
            <span key={g.id} className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300">
              {g.name}
            </span>
          ))}
        </div>
      </footer>

    </div>
  );
}
