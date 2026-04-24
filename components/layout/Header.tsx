"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Container } from "../ui/Container";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-zinc-800">
      <Container className="h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-[0_0_20px_rgba(255,159,10,0.2)]">
            <Image src="/logo.png" alt="Logo" fill unoptimized className="object-cover scale-125" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white font-outfit">MOVIEBOOK</span>
        </Link>

        <nav className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-bold text-white px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-sm font-bold text-black px-5 py-2 rounded-full bg-white hover:bg-zinc-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>
      </Container>
    </header>
  );
};
