import type { Metadata } from "next";
import { Inter, Anton, Rubik, Assistant } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { CinematicFX } from "@/components/fx/CinematicFX";

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

export const metadata: Metadata = {
  title: "MOVIEBOOK | הזמנת סרטים פרימיום",
  description: "חווית קולנוע כמו שמעולם לא חוויתם עם MOVIEBOOK",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${anton.variable} ${rubik.variable} ${assistant.variable} antialiased bg-[#0A0A0A] text-[#FAFAF7] font-body`}>
        <AuthProvider>
          <CinematicFX />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
