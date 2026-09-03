'use client';

import React from 'react';
import FloatingTrailerPlayer from "@/components/media/FloatingTrailerPlayer";
import KeyboardShortcutsModal from "@/components/ui/KeyboardShortcutsModal";
import TrailerPickerModal from "@/components/trailer/TrailerPickerModal";
import { StealthTrayOverlay } from "@/components/concessions/StealthTrayOverlay";
import { WhisperTrackBar } from "@/components/audio/WhisperTrackBar";
import { CinePulseOrb } from "@/components/ai/CinePulseOrb";

export default function GlobalCinemaOverlays() {
  return (
    <>
      <FloatingTrailerPlayer />
      <KeyboardShortcutsModal />
      <TrailerPickerModal />
      <StealthTrayOverlay />
      <WhisperTrackBar />
      <CinePulseOrb />
    </>
  );
}
