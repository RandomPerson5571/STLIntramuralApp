import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/keys";

/** React Query cache timings (plan § React Query Caching Strategy). */
export const queryCache = {
  session: { staleTime: 5 * 60_000, gcTime: 10 * 60_000 },
  currentUser: { staleTime: 5 * 60_000, gcTime: 10 * 60_000 },
  events: { staleTime: 30_000, gcTime: 5 * 60_000 },
  weeklyActivity: { staleTime: 2 * 60_000, gcTime: 10 * 60_000 },
  shop: { staleTime: 5 * 60_000, gcTime: 10 * 60_000 },
} as const;

export function invalidateSessionAndUser(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.session }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me }),
  ]);
}

export function invalidateAfterRegistration(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["events"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard", "weekly-activity"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me }),
    queryClient.invalidateQueries({ queryKey: queryKeys.events.myAttendances }),
  ]);
}

export function invalidateAfterCheckIn(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["dashboard", "weekly-activity"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard", "check-ins-month"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me }),
  ]);
}

export function invalidateAfterPurchase(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["shop"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me }),
  ]);
}
