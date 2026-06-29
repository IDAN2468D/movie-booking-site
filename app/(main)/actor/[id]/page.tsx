import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { getActorProfile } from "@/app/actions/actorActions";

interface ActorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActorPage({ params }: ActorPageProps) {
  const { id } = await params;
  
  const response = await getActorProfile(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const profile = response.data;

  return (
    <div className="min-h-screen bg-[#05070B] text-right font-['Assistant',_'Rubik',_sans-serif]" dir="rtl">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <Image 
          src={profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=1200&q=80"}
          alt={profile.name}
          fill
          priority
          className="object-cover object-center opacity-100 saturate-[1.1]"
          sizes="100vw"
        />
        {/* Gradients to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[#05070B]/30 z-10"></div>

        {/* Back Button */}
        <div className="absolute top-8 end-8 z-30">
           {/* Can use router.back() or Link. We'll use a link to go home or to movies, but technically window.history.back() works in client. Since it's server, let's just go home. */}
          <Link
            href="/"
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl"
          >
            <ArrowRight size={24} />
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 start-0 end-0 p-8 md:p-16 z-20 flex flex-col items-start md:flex-row md:items-end gap-8 max-w-7xl mx-auto">
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_40px_rgba(0,240,255,0.3)] flex-shrink-0 group">
            <Image 
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"}
              alt={profile.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 128px, 192px"
            />
          </div>
          
          <div className="flex-1">
            {profile.trending && (
              <div className="inline-flex items-center space-x-2 space-x-reverse mb-4 bg-[#FFB800]/20 border border-[#FFB800]/50 rounded-full px-4 py-1.5 shadow-[0_0_15px_rgba(255,184,0,0.2)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse shadow-[0_0_8px_#FFB800]"></span>
                <span className="text-[#FFB800] text-sm font-black tracking-widest uppercase">שחקן מבוקש</span>
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
              {profile.name}
            </h1>
            <div className="flex flex-wrap gap-4 mt-4 text-sm md:text-base font-bold text-gray-300">
              <span className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                גיל: {profile.age}
              </span>
              <span className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                מקום לידה: {profile.birthPlace}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 md:px-16 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Biography Panel */}
        <div className="lg:col-span-2">
          <div className="p-8 md:p-12 rounded-[2rem] bg-slate-900/30 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <Sparkles className="text-[#00F0FF]" />
              הסיפור האישי
            </h2>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed text-justify whitespace-pre-wrap">
              {profile.biography}
            </p>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-8">
          {/* Notable Roles */}
          {profile.notableRoles && profile.notableRoles.length > 0 && (
            <div className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-black text-white mb-6 border-b border-white/10 pb-4">
                תפקידים בולטים
              </h3>
              <ul className="space-y-4">
                {profile.notableRoles.map((role: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-4 group cursor-default">
                    <div className="w-2 h-2 rounded-full bg-[#00F0FF]/50 group-hover:bg-[#00F0FF] transition-colors shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
                    <span className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors">
                      {role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Links Card */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#00F0FF]/10 to-transparent border border-[#00F0FF]/30 text-center">
            <h3 className="text-xl font-black text-white mb-3">סרטים נוספים</h3>
            <p className="text-sm text-[#00F0FF]/80 leading-relaxed mb-6">
              גלה יצירות קולנועיות נוספות בהשתתפות {profile.name} במערכת.
            </p>
            <Link 
              href="/"
              className="inline-block w-full py-3 rounded-xl bg-black/40 border border-[#00F0FF]/50 text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-all font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              הצג קטלוג קולנוע
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
