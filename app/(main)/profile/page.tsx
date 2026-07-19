import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserDashboardData } from "@/lib/actions/user-dashboard";
import ProfileClient from "./ProfileClient";
import CinematicAura from "@/components/profile/CinematicAura";
import { OfflineSyncCylinder } from "@/components/settings/OfflineSyncCylinder";

export const metadata = {
  title: "Profile | MovieBook",
  description: "Your digital tickets and history",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const dashboardData = await getUserDashboardData(session.user.id);
  
  const data = dashboardData.success ? dashboardData.data : null;
  const activeTickets = data?.activeTickets || [];
  const history = data?.history || [];
  const activeMatches = data?.activeMatches || [];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-2 drop-shadow-lg">
          שלום, {session.user.name || "משתמש"}
        </h1>
        <p className="text-neutral-400 font-['Inter'] text-lg">
          הנה כל הכרטיסים וההתאמות שלך.
        </p>
      </div>

      <div className="mb-10">
        <CinematicAura userId={session.user.id} />
      </div>

      <div className="mb-10">
        <OfflineSyncCylinder />
      </div>

      <ProfileClient 
        activeTickets={activeTickets} 
        history={history} 
        activeMatches={activeMatches} 
      />
    </div>
  );
}
