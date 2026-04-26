import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { CinematicFX } from "@/components/fx/CinematicFX";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased bg-[#1A1A1A] text-slate-200`}>
        <AuthProvider>
          <CinematicFX />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
