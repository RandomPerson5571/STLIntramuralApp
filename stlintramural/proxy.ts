import { NextResponse, type NextRequest } from "next/server";

import {
  copySessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = ["/", "/events"];
const AUTH_ROUTES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!user && PROTECTED_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    copySessionCookies(response, redirectResponse);
    return redirectResponse;
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    const redirectResponse = NextResponse.redirect(url);
    copySessionCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/", "/events", "/login", "/signup"],
};
