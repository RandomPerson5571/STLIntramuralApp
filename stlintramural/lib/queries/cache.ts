import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/keys";

/** React Query cache timings (plan § React Query Caching Strategy). */
export const queryCache = {
  session: { staleTime: 5 * 60_000, gcTime: 10 * 60_000 },
  currentUser: { staleTime: 5 * 60_000, gcTime: 10 * 60_000 },
  events: { staleTime: 30_000, gcTime: 5 * 60_000 },
  weeklyActivity: { staleTime: 2 * 60_000, gcTime: 10 * 60_000 },
  shop: { staleTime: 5 * 60_000, gcTime: 10 * 60_000 },
  leaderboard: { staleTime: 2 * 60_000, gcTime: 10 * 60_000 },
  admin: { staleTime: 60_000, gcTime: 5 * 60_000 },
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
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me }),
    queryClient.invalidateQueries({ queryKey: queryKeys.events.myAttendances }),
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
  ]);
}

export function invalidateAfterCheckIn(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me }),
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.recentActivity }),
    queryClient.invalidateQueries({
      queryKey: ["admin", "point-transactions"],
    }),
  ]);
}

export function invalidateAfterPurchase(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["shop"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me }),
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard", "league-rank"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.recentActivity }),
  ]);
}

export function invalidateAfterEventCreate(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["events"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.recentActivity }),
    queryClient.invalidateQueries({ queryKey: ["admin", "events"] }),
  ]);
}

export function invalidateAfterEventDelete(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["events"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.recentActivity }),
    queryClient.invalidateQueries({ queryKey: ["admin", "events"] }),
  ]);
}

export function invalidateAfterShopItemCreate(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["shop"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.recentActivity }),
  ]);
}

export function invalidateAfterAdminUserChange(
  queryClient: QueryClient,
  userId?: string,
) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.recentActivity }),
    queryClient.invalidateQueries({
      queryKey: ["admin", "point-transactions"],
    }),
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
    ...(userId
      ? [
          queryClient.invalidateQueries({
            queryKey: queryKeys.admin.userDetail(userId),
          }),
        ]
      : []),
  ]);
}
