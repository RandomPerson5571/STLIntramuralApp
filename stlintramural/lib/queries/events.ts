import type { SupabaseClient } from "@supabase/supabase-js";
import { mapEventToItem, type EventQueryRow } from "@/lib/mappers/event";
import type { EventItem, SportFilter, TimePeriod } from "@/types/event";

/** All event date filters use America/Chicago (CST/CDT). */
export const EVENTS_TIMEZONE = "America/Chicago";

export const DEFAULT_EVENTS_PAGE_SIZE = 12;

export interface FetchEventsParams {
  sport: SportFilter;
  period: TimePeriod;
  page: number;
  pageSize?: number;
  registeredEventIds?: Set<string>;
}

export interface FetchEventsResult {
  events: EventItem[];
  totalCount: number;
  hasMore: boolean;
}

function getChicagoOffsetMs(date: Date): number {
  const utc = date.getTime();
  const chicagoWall = new Date(
    date.toLocaleString("en-US", { timeZone: EVENTS_TIMEZONE }),
  );
  return utc - chicagoWall.getTime();
}

function chicagoCalendarDate(reference = new Date()): Date {
  const offset = getChicagoOffsetMs(reference);
  return new Date(reference.getTime() - offset);
}

function chicagoInstant(
  year: number,
  month: number,
  day: number,
  endOfDay = false,
): string {
  const hours = endOfDay ? 23 : 0;
  const minutes = endOfDay ? 59 : 0;
  const seconds = endOfDay ? 59 : 0;
  const ms = endOfDay ? 999 : 0;

  const ref = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const offsetMs = getChicagoOffsetMs(ref);
  const instantMs =
    Date.UTC(year, month - 1, day, hours, minutes, seconds, ms) + offsetMs;

  return new Date(instantMs).toISOString();
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getPeriodRange(period: TimePeriod): {
  start: string;
  end: string;
} {
  const chicagoNow = chicagoCalendarDate();
  const year = chicagoNow.getFullYear();
  const month = chicagoNow.getMonth() + 1;
  const day = chicagoNow.getDate();
  const weekday = chicagoNow.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;

  const thisWeekStart = addDays(chicagoNow, mondayOffset);
  const thisWeekEnd = addDays(thisWeekStart, 6);

  switch (period) {
    case "This Week":
      return {
        start: chicagoInstant(
          thisWeekStart.getFullYear(),
          thisWeekStart.getMonth() + 1,
          thisWeekStart.getDate(),
        ),
        end: chicagoInstant(
          thisWeekEnd.getFullYear(),
          thisWeekEnd.getMonth() + 1,
          thisWeekEnd.getDate(),
          true,
        ),
      };
    case "Next Week": {
      const nextWeekStart = addDays(thisWeekStart, 7);
      const nextWeekEnd = addDays(nextWeekStart, 6);
      return {
        start: chicagoInstant(
          nextWeekStart.getFullYear(),
          nextWeekStart.getMonth() + 1,
          nextWeekStart.getDate(),
        ),
        end: chicagoInstant(
          nextWeekEnd.getFullYear(),
          nextWeekEnd.getMonth() + 1,
          nextWeekEnd.getDate(),
          true,
        ),
      };
    }
    case "This Month": {
      const lastDay = new Date(year, month, 0).getDate();
      return {
        start: chicagoInstant(year, month, 1),
        end: chicagoInstant(year, month, lastDay, true),
      };
    }
  }
}

export async function fetchEvents(
  supabase: SupabaseClient,
  params: FetchEventsParams,
): Promise<FetchEventsResult> {
  const pageSize = params.pageSize ?? DEFAULT_EVENTS_PAGE_SIZE;
  const { start, end } = getPeriodRange(params.period);
  const from = params.page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("events")
    .select(
      "*, host:users!host_id(id, first_name, last_name, role), attendances:event_attendances(count)",
      { count: "exact" },
    )
    .gte("start_date", start)
    .lte("start_date", end)
    .order("start_date", { ascending: true })
    .range(from, to);

  if (params.sport !== "All Sports") {
    const term = params.sport.replace(/[%_\\]/g, "\\$&");
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as EventQueryRow[];
  const registeredEventIds = params.registeredEventIds ?? new Set<string>();
  const totalCount = count ?? rows.length;

  const events = rows.map((row, index) =>
    mapEventToItem(row, {
      index: params.page * pageSize + index,
      isRegistered: registeredEventIds.has(row.id),
    }),
  );

  return {
    events,
    totalCount,
    hasMore: from + rows.length < totalCount,
  };
}

export async function fetchMyEventAttendances(
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("event_attendances")
    .select("event_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return new Set((data ?? []).map((row) => row.event_id));
}

export class EventRegistrationError extends Error {
  constructor(
    message: string,
    public readonly code: "already_registered" | "unknown",
  ) {
    super(message);
    this.name = "EventRegistrationError";
  }
}

export async function registerForEvent(
  supabase: SupabaseClient,
  input: { userId: string; eventId: string },
): Promise<void> {
  const { error } = await supabase.from("event_attendances").insert({
    user_id: input.userId,
    event_id: input.eventId,
  });

  if (error) {
    if (error.code === "23505") {
      throw new EventRegistrationError("Already registered", "already_registered");
    }
    throw error;
  }
}
