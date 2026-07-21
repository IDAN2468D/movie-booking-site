import { CoViewingLobby } from "@/components/social/CoViewingLobby";

export default function CoviewingDemoPage() {
  const peers = [
    { id: "peer1", name: "Alex", colorHex: "#3b82f6" }, // Blue
    { id: "peer2", name: "Jordan", colorHex: "#10b981" }, // Green
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <CoViewingLobby 
          userId="local-user-id" 
          userName="Me" 
          peers={peers} 
        />
      </div>
    </div>
  );
}
