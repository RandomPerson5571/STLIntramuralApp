import type { SupabaseClient } from "@supabase/supabase-js";

export interface WeeklyActivityDay {
  day: string;
  games: number;
  isToday: boolean;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

function getLast7Days(): { key: string; day: string; isToday: boolean }[] {
  const today = startOfDay(new Date());
  const todayKey = dateKey(today);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const key = dateKey(date);

    return {
      key,
      day: DAY_LABELS[date.getDay()],
      isToday: key === todayKey,
    };
  });
}

export async function fetchWeeklyActivity(
  supabase: SupabaseClient,
  userId: string,
): Promise<WeeklyActivityDay[]> {
  const days = getLast7Days();
  const rangeStart = new Date(days[0].key);
  rangeStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("event_attendances")
    .select("attended_at")
    .eq("user_id", userId)
    .not("attended_at", "is", null)
    .gte("attended_at", rangeStart.toISOString());

  if (error) {
    throw error;
  }

  const counts = new Map<string, number>();

  for (const row of data ?? []) {
    if (!row.attended_at) continue;
    const key = dateKey(new Date(row.attended_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return days.map(({ key, day, isToday }) => ({
    day,
    games: counts.get(key) ?? 0,
    isToday,
  }));
}

export async function fetchCheckInsThisMonth(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count, error } = await supabase
    .from("event_attendances")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("attended_at", "is", null)
    .gte("attended_at", startOfMonth.toISOString());

  if (error) {
    throw error;
  }

  return count ?? 0;
}
