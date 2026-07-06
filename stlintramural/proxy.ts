import { NextResponse, type NextRequest } from "next/server";

import { isGeoAllowed } from "@/lib/geo";
import {
  copySessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = ["/", "/events"];
const AUTH_ROUTES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isGeoAllowed(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/geo-blocked";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const { response, user } = await updateSession(request);

  if (!user && (PROTECTED_ROUTES.includes(pathname) || pathname === "/scan")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    copySessionCookies(response, redirectResponse);
    return redirectResponse;
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(url);
    copySessionCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|geo-blocked|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
