import CinemaShowcase from '@/components/home/CinemaShowcase';
import TextScrollReveal from '@/components/home/TextScrollReveal';
import CinemaExperienceScrolly from '@/components/home/CinemaExperienceScrolly';
import HolographicBackground from '@/components/ui/HolographicBackground';

export default function VisionPage() {
  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden [transform:translateZ(0)]" dir="rtl">
      <HolographicBackground />
      <div className="relative z-10 pt-16">
        <h1 className="text-white text-4xl md:text-5xl font-outfit font-black tracking-tight text-center mb-8" style={{ textShadow: "0 0 30px rgba(255,255,255,0.4)" }}>
          החזון הסינמטי שלנו
        </h1>
        <CinemaShowcase />
        <TextScrollReveal />
        <CinemaExperienceScrolly />
      </div>
    </div>
  );
}
