'use client';

import React from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import { CinematicFX } from "@/components/fx/CinematicFX";
import { ScreenSaverListener } from "@/components/effects/ScreenSaverListener";
import { CinematicScreenSaver } from "@/components/effects/CinematicScreenSaver";
import AmbientThemeProvider from "@/src/components/providers/AmbientThemeProvider";
import { DayNightProvider } from "@/components/providers/DayNightProvider";
import { BiometricSplash } from "@/components/splash/BiometricSplash";
import TimeShiftProactiveAgent from "@/components/concierge/TimeShiftProactiveAgent";
import { GlobalTabAudioController } from "@/components/effects/GlobalTabAudioController";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DayNightProvider>
        <AmbientThemeProvider>
          <GlobalTabAudioController />
          <BiometricSplash />
          <ScreenSaverListener />
          <CinematicScreenSaver />
          <CinematicFX />
          <TimeShiftProactiveAgent />
          {children}
        </AmbientThemeProvider>
      </DayNightProvider>
    </AuthProvider>
  );
}
