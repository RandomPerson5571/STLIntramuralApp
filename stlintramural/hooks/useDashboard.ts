"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryCache } from "@/lib/queries/cache";
import {
  fetchCheckInsThisMonth,
  fetchWeeklyActivity,
} from "@/lib/queries/dashboard";
import { queryKeys } from "@/lib/queries/keys";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSession } from "@/hooks/useAuth";
import {
  fetchCheapestShopItemCost,
  fetchFeaturedShopItems,
} from "@/lib/queries/shop";

function useSupabase() {
  return createClient();
}

export function useWeeklyActivity() {
  const supabase = useSupabase();
  const { data: session } = useSession();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.dashboard.weeklyActivity(user?.id ?? ""),
    queryFn: () => fetchWeeklyActivity(supabase, user!.id),
    enabled: !!session && !!user?.id,
    ...queryCache.weeklyActivity,
  });
}

export function useCheckInsThisMonth() {
  const supabase = useSupabase();
  const { data: session } = useSession();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.dashboard.checkInsThisMonth(user?.id ?? ""),
    queryFn: () => fetchCheckInsThisMonth(supabase, user!.id),
    enabled: !!session && !!user?.id,
    ...queryCache.weeklyActivity,
  });
}

export function useFeaturedShopItems() {
  const supabase = useSupabase();
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.shop.featured,
    queryFn: () => fetchFeaturedShopItems(supabase),
    enabled: !!session,
    ...queryCache.shop,
  });
}

export function useCheapestShopItemCost() {
  const supabase = useSupabase();
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.shop.cheapestCost,
    queryFn: () => fetchCheapestShopItemCost(supabase),
    enabled: !!session,
    ...queryCache.shop,
  });
}
