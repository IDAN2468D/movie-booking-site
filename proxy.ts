import { withAuth } from "next-auth/middleware";

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

// Next.js 16 requires the function name to be 'proxy'
export function proxy(req: any, event: any) {
  return (authMiddleware as any)(req, event);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|rewards|tickets|movie|branches|$).*)",
  ],
};
