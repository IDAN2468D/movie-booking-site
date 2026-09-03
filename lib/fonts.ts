import { Inter, Anton, Rubik, Assistant, Outfit } from "next/font/google";

export const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});

export const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  variable: '--font-rubik',
  weight: ['400', '500', '700', '900'],
});

export const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
});

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '700', '900'],
});

export const fontVariables = `${inter.variable} ${anton.variable} ${rubik.variable} ${assistant.variable} ${outfit.variable}`;
