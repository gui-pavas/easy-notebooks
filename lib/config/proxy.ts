import { AUTH_PUBLIC_ROUTES } from "@/lib/config/routes";

export const proxyMatcher = ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"];

export function isPublicRoute(pathname: string): boolean {
  return AUTH_PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
