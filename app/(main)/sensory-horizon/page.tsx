import React from "react";
import { ChronoAcousticPortalContainer } from "@/components/resonance/ChronoAcousticPortalContainer";
import { HapticTelepathicVaultContainer } from "@/components/haptic/HapticTelepathicVaultContainer";
import { SynestheticFluidMatrixContainer } from "@/components/fx/SynestheticFluidMatrixContainer";
import { SpatialEchoLobbyContainer } from "@/components/nexus/SpatialEchoLobbyContainer";
import { BioAcousticConcessionContainer } from "@/components/concessions/BioAcousticConcessionContainer";
import { KineticShaderDeckContainer } from "@/components/fx/KineticShaderDeckContainer";
import { NeuralSceneGraphContainer } from "@/components/ai/NeuralSceneGraphContainer";
import { HolographicSeatPOVContainer } from "@/components/discovery/HolographicSeatPOVContainer";
import { QuantumCineCardVaultContainer } from "@/components/vip/QuantumCineCardVaultContainer";
import { BioThemeMorpherContainer } from "@/components/fx/BioThemeMorpherContainer";

export const metadata = {
  title: "Sensory Horizon | Quantum-Acoustic & Visual Cinema Suite",
  description: "Quantum-Acoustic and Multi-Sensory Visual Cinema Suite featuring Phase 33 & Phase 37 components.",
};

export default function SensoryHorizonPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-neutral-950 py-12 px-4 text-white font-['Outfit'] space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
          🌌 האופק התחושתי והויזואלי: The Multi-Sensory Cinema Ecosystem
        </h1>
        <p className="text-neutral-400 font-['Inter'] text-sm">
          סוויטת חוויות הקולנוע המתקדמת: שיידרים תלת-ממדיים, מפת עלילה עצבית AI, סימולטור POV 180°, כספת קלפי אספנות הולוגרפיים ומנוע נושאים דינמי.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        <KineticShaderDeckContainer />
        <NeuralSceneGraphContainer />
        <HolographicSeatPOVContainer />
        <QuantumCineCardVaultContainer />
        <BioThemeMorpherContainer />
        <ChronoAcousticPortalContainer />
        <HapticTelepathicVaultContainer />
        <SynestheticFluidMatrixContainer />
        <SpatialEchoLobbyContainer />
        <BioAcousticConcessionContainer />
      </div>
    </main>
  );
}
