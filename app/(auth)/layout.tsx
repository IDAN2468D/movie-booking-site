import React from 'react';
import { PremiumLogo } from "@/components/ui/PremiumLogo";
import { AuthParallaxContainer } from "@/components/auth/AuthParallaxContainer";
import { getPopularMovies, getImageUrl } from "@/lib/tmdb";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let images: string[] = [];
  try {
    const movies = await getPopularMovies();
    if (movies && movies.length > 0) {
      images = movies.slice(0, 20).map(m => getImageUrl(m.backdrop_path || m.poster_path, 'original'));
    }
  } catch (error) {
    console.error("Failed to fetch movies for auth layout:", error);
  }

  return (
    <AuthParallaxContainer images={images}>
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center p-8 lg:p-20 font-inter max-w-7xl mx-auto gap-12 lg:gap-24 relative z-10 pointer-events-none">
        
        {/* Left Side: Cinematic Info */}
        <div className="hidden lg:flex flex-col justify-center text-right h-full flex-1 pointer-events-none">
          <div className="flex items-center gap-3 mb-8 justify-end w-full" dir="ltr">
            <PremiumLogo size="lg" />
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6 tracking-tighter font-outfit drop-shadow-2xl">
            המקום בו כל <span className="text-[#FF9F0A]">פריים</span> מספר סיפור
          </h1>
          <p className="text-xl text-slate-300 font-medium drop-shadow-lg max-w-lg ml-auto">
            הצטרפו לאלפי חובבי קולנוע וקבלו גישה להקרנות בלעדיות, 
            מושבי פרימיום ומשלוחי אוכל גורמה עד למושב.
          </p>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex flex-col items-center justify-center relative w-full lg:w-auto flex-1 pointer-events-none">
          <div className="absolute -top-24 right-0 lg:hidden pointer-events-none z-10">
            <PremiumLogo size="sm" />
          </div>
          
          <div className="w-full max-w-md pointer-events-auto relative z-10">
            {children}
          </div>
          
          <div className="absolute -bottom-24 text-slate-400 text-xs font-bold uppercase tracking-widest text-center font-outfit pointer-events-none w-full">
            © 2026 MOVIEBOOK • חווית קולנוע פרימיום
          </div>
        </div>
      </div>
    </AuthParallaxContainer>
  );
}
