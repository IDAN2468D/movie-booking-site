"use client";

import { useSession, signIn, signOut } from "next-auth/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useBookingStore } from '@/lib/store';
import { PremiumLogo } from "@/components/ui/PremiumLogo";
import { Container } from "../ui/Container";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { KineticText } from "../effects/KineticText";
import { MagneticButton } from "../ui/MagneticButton";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl saturate-[200%] brightness-110 bg-black/10 border-b border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.1)] font-inter">
      <Container className="h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <PremiumLogo size="sm" />
        </Link>

        <nav className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm font-bold text-white px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <MagneticButton
              onClick={() => {
                console.log("Sign in clicked");
                signIn();
              }}
              className="text-sm font-bold text-black px-5 py-2 rounded-full bg-white hover:bg-[#FAFAF7] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Sign In
            </MagneticButton>
          )}
        </nav>
      </Container>
    </header>
  );
};
