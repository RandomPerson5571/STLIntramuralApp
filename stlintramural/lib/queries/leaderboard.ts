import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  LeaderboardEntry,
  LeaderboardTrend,
} from "@/lib/constants/leaderboard";

const USER_COLUMNS =
  "id, first_name, last_name, role, points_balance, graduation_year" as const;

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const weekday = d.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  d.setDate(d.getDate() + mondayOffset);
  return d;
}

function getTrend(pointsThisWeek: number): LeaderboardTrend {
  if (pointsThisWeek > 0) return "up";
  return "same";
}

export async function fetchLeaderboard(
  supabase: SupabaseClient,
): Promise<Omit<LeaderboardEntry, "rank">[]> {
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(USER_COLUMNS)
    .eq("role", "student")
    .order("points_balance", { ascending: false });

  if (usersError) {
    throw usersError;
  }

  const weekStart = startOfWeek(new Date());
  const userIds = (users ?? []).map((user) => user.id);

  const weeklyPoints = new Map<string, number>();

  if (userIds.length > 0) {
    const { data: transactions, error: txError } = await supabase
      .from("point_transactions")
      .select("user_id, points")
      .in("user_id", userIds)
      .gte("created_at", weekStart.toISOString());

    if (txError) {
      throw txError;
    }

    for (const row of transactions ?? []) {
      weeklyPoints.set(
        row.user_id,
        (weeklyPoints.get(row.user_id) ?? 0) + row.points,
      );
    }
  }

  return (users ?? []).map((user) => {
    const pointsThisWeek = weeklyPoints.get(user.id) ?? 0;

    return {
      ...user,
      trend: getTrend(pointsThisWeek),
      points_this_week: pointsThisWeek,
    };
  });
}

export interface LeagueRank {
  rank: number;
  total: number;
}

export async function fetchLeagueRank(
  supabase: SupabaseClient,
  userId: string,
): Promise<LeagueRank> {
  const [{ data: user, error: userError }, { count: total, error: totalError }] =
    await Promise.all([
      supabase
        .from("users")
        .select("points_balance, role")
        .eq("id", userId)
        .single(),
      supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "student"),
    ]);

  if (userError) {
    throw userError;
  }

  if (totalError) {
    throw totalError;
  }

  if (user.role !== "student") {
    return { rank: 0, total: total ?? 0 };
  }

  const { count: higherCount, error: rankError } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "student")
    .gt("points_balance", user.points_balance);

  if (rankError) {
    throw rankError;
  }

  return {
    rank: (higherCount ?? 0) + 1,
    total: total ?? 0,
  };
}
