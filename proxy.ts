import { NextRequest, NextFetchEvent, NextMiddleware } from "next/server";
import { withAuth } from "next-auth/middleware";

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
}) as NextMiddleware;

// Next.js 16 requires the function name to be 'proxy'
export function proxy(req: NextRequest, event: NextFetchEvent) {
  return authMiddleware(req, event);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|manifest.webmanifest|icon.svg|apple-icon.png|login|register|rewards|tickets|movie|branches|stories|splash|$).*)",
  ],
};
