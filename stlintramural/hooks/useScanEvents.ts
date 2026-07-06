"use client";

import { useAuthenticatedQuery } from "@/hooks/useSupabaseQuery";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { queryCache } from "@/lib/queries/cache";
import { queryKeys } from "@/lib/queries/keys";
import { fetchRecentScans, fetchScanEvents } from "@/lib/queries/scan";
import { canScanCheckIn } from "@/lib/permissions";

export function useScanEvents() {
  const { data: user } = useCurrentUser();

  return useAuthenticatedQuery(
    queryKeys.scan.events,
    (supabase) => {
      if (!user) throw new Error("Not signed in");
      return fetchScanEvents(supabase, user);
    },
    {
      enabled: canScanCheckIn(user),
      ...queryCache.events,
    },
  );
}

export function useRecentScans(eventId: string, pointsAwarded: number) {
  const { data: user } = useCurrentUser();

  return useAuthenticatedQuery(
    queryKeys.scan.recent(eventId),
    (supabase) => fetchRecentScans(supabase, eventId, pointsAwarded),
    {
      enabled: !!eventId && canScanCheckIn(user),
      staleTime: 15_000,
      gcTime: 5 * 60_000,
    },
  );
}
