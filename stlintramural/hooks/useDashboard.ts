"use client";

import { queryCache } from "@/lib/queries/cache";
import {
  fetchUpcomingRegisteredEvents,
  fetchWeeklyActivity,
} from "@/lib/queries/dashboard";
import { queryKeys } from "@/lib/queries/keys";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthenticatedQuery } from "@/hooks/useSupabaseQuery";
import {
  fetchCheapestShopItemCost,
  fetchFeaturedShopItems,
} from "@/lib/queries/shop";
import { fetchLeagueRank } from "@/lib/queries/leaderboard";

export function useWeeklyActivity() {
  const { data: user } = useCurrentUser();

  return useAuthenticatedQuery(
    queryKeys.dashboard.weeklyActivity(user?.id ?? ""),
    (supabase) => fetchWeeklyActivity(supabase, user!.id),
    { enabled: !!user?.id, ...queryCache.weeklyActivity },
  );
}

export function useFeaturedShopItems() {
  return useAuthenticatedQuery(
    queryKeys.shop.featured,
    (supabase) => fetchFeaturedShopItems(supabase),
    queryCache.shop,
  );
}

export function useCheapestShopItemCost() {
  return useAuthenticatedQuery(
    queryKeys.shop.cheapestCost,
    (supabase) => fetchCheapestShopItemCost(supabase),
    queryCache.shop,
  );
}

export function useLeagueRank() {
  const { data: user } = useCurrentUser();

  return useAuthenticatedQuery(
    queryKeys.dashboard.leagueRank(user?.id ?? ""),
    (supabase) => fetchLeagueRank(supabase, user!.id),
    { enabled: !!user?.id, ...queryCache.leaderboard },
  );
}

export function useUpcomingRegisteredEvents() {
  const { data: user } = useCurrentUser();

  return useAuthenticatedQuery(
    queryKeys.dashboard.upcomingEvents(user?.id ?? ""),
    (supabase) => fetchUpcomingRegisteredEvents(supabase, user!.id),
    { enabled: !!user?.id, ...queryCache.events },
  );
}
