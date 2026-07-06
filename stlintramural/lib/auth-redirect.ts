function getAppOrigin(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/** Absolute URL for Supabase email links (signup confirm, password reset). */
export function getAuthCallbackUrl(next = "/dashboard"): string {
  const safeNext = next.startsWith("/") ? next : "/dashboard";
  const origin = getAppOrigin();
  return `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
}
