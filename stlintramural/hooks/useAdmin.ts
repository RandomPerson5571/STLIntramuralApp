"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { queryCache } from "@/lib/queries/cache";
import {
  fetchAdminEvents,
  fetchAdminRecentActivity,
  fetchAdminStats,
  fetchAdminUserDetail,
  fetchAdminUsers,
} from "@/lib/queries/admin";
import { queryKeys } from "@/lib/queries/keys";
import { useAdminQuery } from "@/hooks/useSupabaseQuery";

export function useAdminStats() {
  return useAdminQuery(
    queryKeys.admin.stats,
    (supabase) => fetchAdminStats(supabase),
    queryCache.admin,
  );
}

export function useAdminRecentActivity() {
  return useAdminQuery(
    queryKeys.admin.recentActivity,
    (supabase) => fetchAdminRecentActivity(supabase),
    queryCache.admin,
  );
}

export function useAdminEvents(page: number) {
  return useAdminQuery(
    queryKeys.admin.events(page),
    (supabase) => fetchAdminEvents(supabase, page),
    { placeholderData: keepPreviousData, ...queryCache.admin },
  );
}

export function useAdminUsers(page: number) {
  return useAdminQuery(
    queryKeys.admin.users(page),
    (supabase) => fetchAdminUsers(supabase, page),
    { placeholderData: keepPreviousData, ...queryCache.admin },
  );
}

export function useAdminUserDetail(userId: string | null) {
  return useAdminQuery(
    queryKeys.admin.userDetail(userId ?? ""),
    (supabase) => fetchAdminUserDetail(supabase, userId!),
    { enabled: !!userId, ...queryCache.admin },
  );
}
