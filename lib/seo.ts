import type { Metadata } from "next";

export const siteUrl = process.env.NEXTAUTH_URL || 'https://cinepulse.co.il';

export const siteMetadata: Metadata = {
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

export const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "MovieTheater",
  "name": "CinePulse Cinemas",
  "description": "מתחם בתי קולנוע יוקרתי עם סאונד מרחבי והקרנות לייזר מתקדמות",
  "url": siteUrl,
  "currenciesAccepted": "ILS",
  "paymentAccepted": "Credit Card, Apple Pay, Google Pay",
  "priceRange": "₪₪₪",
};
