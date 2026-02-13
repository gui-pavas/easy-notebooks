import { authProxy } from "@/lib/middleware/auth-middleware";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return authProxy(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
