import React from "react";
import { ChronoAcousticPortalContainer } from "@/components/resonance/ChronoAcousticPortalContainer";
import { HapticTelepathicVaultContainer } from "@/components/haptic/HapticTelepathicVaultContainer";
import { SynestheticFluidMatrixContainer } from "@/components/fx/SynestheticFluidMatrixContainer";
import { SpatialEchoLobbyContainer } from "@/components/nexus/SpatialEchoLobbyContainer";
import { BioAcousticConcessionContainer } from "@/components/concessions/BioAcousticConcessionContainer";

export const metadata = {
  title: "Sensory Horizon | Quantum-Acoustic Cinema Suite",
  description: "Quantum-Acoustic Sensory Ecosystem featuring 5 revolutionary hyper-sensory cinema components.",
};

export default function SensoryHorizonPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-neutral-950 py-12 px-4 text-white font-['Outfit'] space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
          🌌 האופק התחושתי: The Quantum-Acoustic Sensory Ecosystem
        </h1>
        <p className="text-neutral-400 font-['Inter'] text-sm">
          סוויטת חוויות הקולנוע המתקדמת: מסע בזמן קולי, כספת טלפתית הפטית, נוזל סאונד סינסתטי, לובי מרחבי ותדר ביו-אקוסטי למזנון.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        <ChronoAcousticPortalContainer />
        <HapticTelepathicVaultContainer />
        <SynestheticFluidMatrixContainer />
        <SpatialEchoLobbyContainer />
        <BioAcousticConcessionContainer />
      </div>
    </main>
  );
}
