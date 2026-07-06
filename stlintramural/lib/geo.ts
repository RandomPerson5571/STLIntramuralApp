import type { NextRequest } from "next/server";

const ALLOWED_COUNTRIES = new Set(["US", "CA"]);

function getRequestCountryCode(request: NextRequest): string | null {
  return request.headers.get("x-vercel-ip-country");
}

export function isGeoAllowed(request: NextRequest): boolean {
  const country = getRequestCountryCode(request);

  if (!country) {
    return process.env.NODE_ENV === "development";
  }

  return ALLOWED_COUNTRIES.has(country.toUpperCase());
}
