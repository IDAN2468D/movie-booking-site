"use client";

import { useEffect, useState } from "react";
import { useVoiceWaveform } from "@/lib/hooks/useVoiceWaveform";
import { SynapticAvatar } from "@/components/social/SynapticAvatar";

interface CoViewingLobbyProps {
  userId: string;
  userName: string;
  peers: { id: string; name: string; colorHex: string }[];
}

export function CoViewingLobby({ userId, userName, peers }: CoViewingLobbyProps) {
  const { amplitude } = useVoiceWaveform(true);
  const [peerAmplitudes, setPeerAmplitudes] = useState<Record<string, number>>({});

  // Broadcast our amplitude
  useEffect(() => {
    const broadcast = async () => {
      // Don't spam the server if we are quiet, but send occasionally to keep alive
      try {
        await fetch('/api/coviewing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amplitude })
        });
      } catch (err) {
        console.error("Failed to broadcast amplitude", err);
      }
    };
    
    // Throttle the broadcast to 10fps
    const interval = setInterval(broadcast, 100);
    return () => clearInterval(interval);
  }, [amplitude, userId]);

  // Poll for peers amplitude
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/coviewing');
        const data = await res.json();
        if (data.success) {
          setPeerAmplitudes(data.data);
        }
      } catch (err) {
        console.error("Failed to poll amplitudes", err);
      }
    };

    const interval = setInterval(poll, 200); // 5fps for peers to save bandwidth in this simulated environment
    return () => clearInterval(interval);
  }, []);

  return (
    <div dir="rtl" className="w-full p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-2xl flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <h2 className="text-white font-outfit text-2xl font-bold mb-8 tracking-wide">
        לובי צפייה משותפת
      </h2>

      <div className="flex flex-wrap justify-center gap-12 mt-4">
        {/* Local User */}
        <SynapticAvatar 
          name={userName} 
          amplitude={amplitude} 
          colorHex="#ec4899" // Pink
        />

        {/* Peers */}
        {peers.map((peer) => (
          <SynapticAvatar
            key={peer.id}
            name={peer.name}
            amplitude={peerAmplitudes[peer.id] || 0}
            colorHex={peer.colorHex}
          />
        ))}
      </div>
      
      <p className="mt-12 text-white/50 font-inter text-sm text-center">
        המיקרופון שלך פועל. צליל מומר לאדוות ויזואליות בזמן אמת.
      </p>
    </div>
  );
}
