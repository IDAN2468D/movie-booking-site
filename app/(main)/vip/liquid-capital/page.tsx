import { BrainOrb } from "@/components/liquid-capital/BrainOrb";
import { LiquidFlowPredictor } from "@/components/liquid-capital/LiquidFlowPredictor";
import { AssetRefractionGrid } from "@/components/liquid-capital/AssetRefractionGrid";
import { SeatAuctions } from "@/components/liquid-capital/SeatAuctions";
import { getActiveAuctions } from "@/lib/actions/auctions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Dashboard() {
  const auctionsRes = await getActiveAuctions();
  const initialAuctions = (auctionsRes.success ? auctionsRes.data : []) as any;

  return (
    <div className="liquid-glass-theme" dir="rtl">
      <div className="min-h-screen p-4 md:p-8 overflow-hidden bg-[#050505] text-white selection:bg-[#F5A623] selection:text-black">
        {/* Background ambient lighting */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#F5A623] blur-[180px] opacity-10" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#F5A623] blur-[180px] opacity-5" />
        </div>

        <main className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10 pt-4 md:pt-8">
          <header className="flex justify-between items-end pb-6 border-b border-white/10">
            <div>
              <Link href="/vip" className="inline-flex items-center gap-2 text-white/50 hover:text-[#F5A623] transition-colors mb-4 text-sm font-medium">
                <ArrowRight size={16} /> חזרה לעמוד ה-VIP
              </Link>
              <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                Liquid <span className="text-gold-gradient">Capital</span>
              </h1>
              <p className="text-white/50 text-lg">מרכז ניהול הון חכם - פרימיום</p>
            </div>
            <div className="hidden md:flex gap-4">
              <button 
                className="glass-panel px-6 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
              >
                הורד דוח
              </button>
              <Link 
                href="/checkout"
                className="bg-[#F5A623] text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#FFD700] transition-colors shadow-[0_0_20px_rgba(245,166,35,0.4)] cursor-pointer flex items-center"
              >
                הפקדה חדשה
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Right Column (RTL) - Main Content */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold">הנכסים שלך (Asset Refraction)</h2>
                  <a href="#" className="text-sm text-[#F5A623] hover:underline">צפה בכל הנכסים</a>
                </div>
                <AssetRefractionGrid />
              </section>
              
              <section className="mt-4">
                <LiquidFlowPredictor />
              </section>
            </div>

            {/* Left Column (RTL) - Sidebar / AI */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="glass-panel p-6 flex flex-col items-center justify-start gap-8 min-h-[480px]">
                <div className="text-center w-full mt-2">
                  <h3 className="font-bold text-2xl mb-1 text-gold-gradient">Liquid AI Insights</h3>
                  <p className="text-sm text-white/50">מנתח סנטימנט שוק בזמן אמת</p>
                </div>
                
                <div className="my-4">
                  <BrainOrb sentiment="greed" />
                </div>
                
                <div className="text-sm leading-relaxed text-right text-white/80 bg-white/5 p-5 rounded-xl border border-white/10 mt-auto w-full">
                  <strong className="text-[#F5A623] block mb-2 text-base">המלצת המערכת:</strong> 
                  רמת ה"חמדנות" בשוק הקריפטו נמצאת בשיא של חודשיים. המערכת מזהה הזדמנות פוטנציאלית למימוש רווחים. אנו ממליצים לשקול נעילת רווח של 15% מהפוזיציה ב-Solana.
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8 border-t border-white/10 pt-12 pb-24">
            <SeatAuctions initialAuctions={initialAuctions} />
          </section>
        </main>
      </div>
    </div>
  );
}
