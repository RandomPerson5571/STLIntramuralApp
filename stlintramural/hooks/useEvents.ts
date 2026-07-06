"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryCache } from "@/lib/queries/cache";
import { createClient } from "@/lib/supabase/client";
import {
  DEFAULT_EVENTS_PAGE_SIZE,
  fetchEvents,
  fetchMyEventAttendances,
} from "@/lib/queries/events";
import { queryKeys } from "@/lib/queries/keys";
import type { SportFilter, TimePeriod } from "@/types/event";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export interface UseEventsFilters {
  sport: SportFilter;
  period: TimePeriod;
  page: number;
}

export function useMyEventAttendances() {
  const supabase = createClient();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.events.myAttendances,
    queryFn: () => fetchMyEventAttendances(supabase, user!.id),
    enabled: !!user,
    ...queryCache.events,
  });
}

export function useEvents(filters: UseEventsFilters) {
  const supabase = createClient();
  const { data: user } = useCurrentUser();
  const {
    data: registeredEventIds,
    isFetched: attendancesFetched,
  } = useMyEventAttendances();

  const canFetchEvents = !user || attendancesFetched;

  return useQuery({
    queryKey: queryKeys.events.all({
      sport: filters.sport,
      period: filters.period,
      page: filters.page,
    }),
    queryFn: () =>
      fetchEvents(supabase, {
        sport: filters.sport,
        period: filters.period,
        page: filters.page,
        pageSize: DEFAULT_EVENTS_PAGE_SIZE,
        registeredEventIds: registeredEventIds ?? new Set(),
      }),
    enabled: canFetchEvents,
    ...queryCache.events,
    placeholderData: keepPreviousData,
  });
}
