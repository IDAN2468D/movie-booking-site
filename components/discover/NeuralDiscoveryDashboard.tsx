"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { getNeuralMovies } from "@/app/actions/neuralDiscoveryActions";

interface MovieNode {
  id: string;
  title: string;
  match: number;
  collection: string;
  image: string;
}

export function NeuralDiscoveryDashboard({ userId }: { userId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mood, setMood] = useState("");
  const [tension, setTension] = useState(50);
  const [pace, setPace] = useState(50);
  const [directorMode, setDirectorMode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sensoryFocus, setSensoryFocus] = useState("");
  const [dosage, setDosage] = useState("");
  const [liveFeed, setLiveFeed] = useState<string[]>([]);
  
  const [results, setResults] = useState<MovieNode[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    const interval = setInterval(() => {
      const users = ["User_7X", "CinePhile99", "Neo", "Trinity", "Morpheus_22"];
      const movies = ["מטריקס", "התחלה", "בין כוכבים", "חולית 2", "ספרות זולה"];
      const user = users[Math.floor(Math.random() * users.length)];
      const movie = movies[Math.floor(Math.random() * movies.length)];
      setLiveFeed(prev => {
        const next = [...prev, `${user} התחבר עכשיו ל-'${movie}'`];
        if (next.length > 3) next.shift();
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleBiometricScan = () => {
    if (isPending) return;
    setIsScanning(true);
    setTimeout(() => {
      setTension(Math.floor(Math.random() * 100));
      setPace(Math.floor(Math.random() * 100));
      setMood(moods[Math.floor(Math.random() * moods.length)]);
      setIsScanning(false);
    }, 2000);
  };

  const handleCopySignature = () => {
    navigator.clipboard.writeText(`NRL-${Math.floor(Math.random() * 9000) + 1000}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSearch = () => {
    startTransition(async () => {
      setErrorMsg(null);
      const res = await getNeuralMovies(userId, { searchQuery, mood, tension, pace, directorMode, sensoryFocus, dosage });
      if (res.success && res.data) {
        setResults(res.data);
      } else if (res.error) {
        setErrorMsg(res.error);
        setResults([]);
      }
    });
  };

  const moods = ["אינטנסיבי ומהיר", "מחשבתי ועתידני", "מרגש ואופטימי"];

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-['Assistant',_'Rubik',_sans-serif] p-8 overflow-hidden" dir="rtl">
      
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold leading-relaxed mb-4 text-transparent bg-clip-text bg-gradient-to-l from-[#00F0FF] to-blue-500 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          מנוע תגליות נוירוני
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed py-1">
          הזן פרמטרים או מצב רוח והמערכת תרכיב עבורך מסלול קולנועי מותאם אישית.
        </p>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 backdrop-blur-md leading-relaxed py-1">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Widget A: AI Mood Engine & Variable Sliders */}
        <section className="lg:col-span-4 flex flex-col space-y-8 backdrop-blur-xl bg-slate-900/30 border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-bold text-[#00F0FF] leading-relaxed py-1">מסנני תודעה</h2>
          
          <div>
            <label className="block mb-4 text-sm font-medium text-gray-300 leading-relaxed py-1">חיפוש חופשי (אופציונלי)</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF] transition-colors"
              placeholder="חפש נושא או קונספט..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={handleBiometricScan}
            disabled={isScanning || isPending}
            className="relative overflow-hidden w-full py-4 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 hover:bg-[#00F0FF]/10 text-[#00F0FF] font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] group flex items-center justify-center space-x-3 space-x-reverse"
          >
            {isScanning && <div className="absolute inset-0 bg-[#00F0FF]/20 animate-pulse" />}
            <svg className={`w-6 h-6 z-10 ${isScanning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
            <span className="leading-relaxed py-1 z-10">{isScanning ? 'סורק מדדים ביומטריים...' : 'סנכרון ביומטרי אוטומטי'}</span>
          </button>

          <div>
            <label className="block mb-4 text-sm font-medium text-gray-300 leading-relaxed py-1">מצב רוח נוכחי</label>
            <div className="flex flex-wrap gap-3">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mood === m ? 'bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-4 text-sm font-medium text-gray-300 leading-relaxed py-1">מיזוג מוחות (במאים)</label>
            <div className="flex flex-wrap gap-3">
              {["כריסטופר נולאן", "קוונטין טרנטינו", "דני וילנב"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDirectorMode(d === directorMode ? "" : d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${directorMode === d ? 'bg-purple-500/20 border border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-4 text-sm font-medium text-gray-300 leading-relaxed py-1">עקיפה חושית (Sensory Override)</label>
            <div className="flex flex-wrap gap-3">
              {["מופע חזותי", "סאונד עוטף", "עלילה פסיכולוגית"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSensoryFocus(s === sensoryFocus ? "" : s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${sensoryFocus === s ? 'bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'bg-black/40 border border-white/10 hover:border-white/30 text-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-4 text-sm font-medium text-gray-300 leading-relaxed py-1">מינון קולנועי (Dosage)</label>
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
              {["Micro-Dose", "Standard Dose", "Deep Dive"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDosage(d)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${dosage === d ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300 leading-relaxed py-1">מתח (Tension)</label>
                <span className="text-xs text-[#00F0FF] font-mono">{tension}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={tension} 
                onChange={(e) => setTension(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300 leading-relaxed py-1">קצב (Pace)</label>
                <span className="text-xs text-[#00F0FF] font-mono">{pace}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={pace} 
                onChange={(e) => setPace(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>
          </div>

          <button 
            onClick={handleSearch}
            disabled={isPending}
            className="w-full py-4 mt-4 rounded-xl bg-gradient-to-l from-[#00F0FF] to-blue-600 text-black font-bold text-lg hover:saturate-150 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
          >
            {isPending ? "מסנכרן תודעה..." : "אתחל סריקה"}
          </button>
        </section>

        {/* Widgets B & C Container */}
        <section className="lg:col-span-8 flex flex-col space-y-8">
          
          {/* Widget B: Interactive Neural Relationship Graph Node */}
          <div className="relative h-64 w-full backdrop-blur-xl bg-slate-900/30 border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00F0FF]/10 via-[#05070B]/50 to-[#05070B] z-0"></div>
            
            {/* Collective Unconscious Live Feed */}
            <div className="absolute top-4 left-4 z-20 flex flex-col items-start space-y-2 pointer-events-none" dir="ltr">
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[10px] text-emerald-400 font-bold tracking-wider">LIVE NODE ACTIVITY</span>
              </div>
              <div className="flex flex-col space-y-2 items-start" dir="rtl">
                {liveFeed.map((msg, idx) => (
                  <div key={idx} className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs text-gray-300 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-md">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            
            {results.length === 0 ? (
              <div className="z-10 text-center text-gray-500 leading-relaxed py-1">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                ממתין לפקודת סריקה...
              </div>
            ) : (
              <div className="z-10 flex flex-wrap justify-center items-center gap-8 p-4">
                {/* Node visualization */}
                {results.map((movie) => (
                  <div key={`node-${movie.id}`} className="flex flex-col items-center space-y-3 relative group">
                    <div className="w-20 h-20 rounded-full border-2 border-[#00F0FF] flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(0,240,255,0.5)] overflow-hidden relative">
                      <Image src={movie.image} alt="Node" fill className="object-cover opacity-60" />
                      <span className="z-20 font-mono text-sm font-bold text-white drop-shadow-md">{movie.match}%</span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#00F0FF] font-medium leading-relaxed py-1 drop-shadow-sm">{movie.match}% התאמה נוירונית</p>
                      <p className="text-sm font-semibold truncate w-24 text-gray-200 leading-relaxed py-1">{movie.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Widget C: Personalized Neural Playlist Row */}
          {results.length > 0 && (
            <div className="backdrop-blur-xl bg-slate-900/30 border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white leading-relaxed py-1">
                  אוספים שנוצרו עבורך
                </h2>
                <button 
                  onClick={handleCopySignature}
                  className="px-4 py-2 rounded-lg border border-[#00F0FF]/30 text-[#00F0FF] text-sm font-medium hover:bg-[#00F0FF]/10 transition-colors flex items-center space-x-2 space-x-reverse shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  <span className="leading-relaxed py-1">{copiedLink ? 'הועתק בהצלחה!' : 'הפק חותם תודעתי'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(movie => (
                  <div key={movie.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                    <Image src={movie.image} alt={movie.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
                      <span className="px-3 py-1 bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[#00F0FF] text-xs font-bold rounded-full w-max mb-3 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                        {movie.collection}
                      </span>
                      <h3 className="text-xl font-bold text-white leading-relaxed py-1">{movie.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
