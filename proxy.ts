import { NextRequest, NextFetchEvent, NextMiddleware } from "next/server";

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
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|rewards|tickets|movie|branches|$).*)",
  ],
};
