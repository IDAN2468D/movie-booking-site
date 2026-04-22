import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import RightPanel from "@/components/layout/RightPanel";
import MobileNav from "@/components/layout/MobileNav";
import MovieChatBot from "@/components/chat/MovieChatBot";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      {/* Right Sidebar - Responsive */}
      <Sidebar />

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Left Panel - Live Cinema / Booking */}
      <RightPanel />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* AI Chat Bot */}
      <MovieChatBot />
    </div>
  );
}
