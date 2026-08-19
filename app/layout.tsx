import type { Metadata } from "next";
import { Inter, Anton, Rubik, Assistant, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { CinematicFX } from "@/components/fx/CinematicFX";
import { ScreenSaverListener } from "@/components/effects/ScreenSaverListener";
import { CinematicScreenSaver } from "@/components/effects/CinematicScreenSaver";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  variable: '--font-rubik',
  weight: ['400', '500', '700', '900'],
});

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '700', '900'],
});

const siteUrl = process.env.NEXTAUTH_URL || 'https://cinepulse.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CinePulse | חווית קולנוע פרימיום ורכישת כרטיסים חכמה",
  description: "חווית קולנוע עתידנית, סאונד מרחבי 120Hz, כרטיסים ביומטריים והמלצות AI עם CinePulse",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CinePulse | חווית קולנוע פרימיום",
    description: "הזמנת כרטיסי קולנוע פרימיום עם סאונד מרחבי וטכנולוגיית הקרנה מתקדמת",
    url: siteUrl,
    siteName: 'CinePulse',
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CinePulse | הזמנת כרטיסי קולנוע פרימיום',
    description: 'חווית קולנוע עתידנית, סאונד מרחבי והזמנת כרטיסים חכמה',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

import AmbientThemeProvider from "@/src/components/providers/AmbientThemeProvider";
import { DayNightProvider } from "@/components/providers/DayNightProvider";
import { BiometricSplash } from "@/components/splash/BiometricSplash";
import TimeShiftProactiveAgent from "@/components/concierge/TimeShiftProactiveAgent";
import { GlobalTabAudioController } from "@/components/effects/GlobalTabAudioController";

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "MovieTheater",
  "name": "CinePulse Cinemas",
  "description": "מתחם בתי קולנוע יוקרתי עם סאונד מרחבי והקרנות לייזר מתקדמות",
  "url": siteUrl,
  "currenciesAccepted": "ILS",
  "paymentAccepted": "Credit Card, Apple Pay, Google Pay",
  "priceRange": "₪₪₪",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${anton.variable} ${rubik.variable} ${assistant.variable} ${outfit.variable} antialiased bg-[var(--bg-main,#0A0A0A)] text-[var(--text-primary,#FAFAF7)] font-body transition-colors duration-700`}>
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
      </body>
    </html>
  );
}
