import type { UserPublic, UserRole } from "@/types/database/user";

export type LeaderboardTrend = "up" | "down" | "same";

export interface LeaderboardEntry extends UserPublic {
  rank: number;
  trend: LeaderboardTrend;
  /** Placeholder for future weekly point deltas — not wired to backend yet. */
  points_this_week: number;
}

export type LeaderboardRoleFilter = "all" | UserRole;

/** Mock current user — replace with session user when auth is wired. */
export const CURRENT_USER_ID = "usr-0007";

const MOCK_USERS: Omit<LeaderboardEntry, "rank">[] = [
  {
    id: "usr-0001",
    first_name: "Marcus",
    last_name: "Chen",
    role: "student",
    points_balance: 2840,
    trend: "up",
    points_this_week: 320,
  },
  {
    id: "usr-0002",
    first_name: "Aisha",
    last_name: "Patel",
    role: "student",
    points_balance: 2610,
    trend: "same",
    points_this_week: 180,
  },
  {
    id: "usr-0003",
    first_name: "Jordan",
    last_name: "Williams",
    role: "student",
    points_balance: 2485,
    trend: "up",
    points_this_week: 245,
  },
  {
    id: "usr-0004",
    first_name: "Elena",
    last_name: "Rodriguez",
    role: "teacher",
    points_balance: 2190,
    trend: "down",
    points_this_week: 90,
  },
  {
    id: "usr-0005",
    first_name: "Tyler",
    last_name: "Brooks",
    role: "student",
    points_balance: 2055,
    trend: "up",
    points_this_week: 210,
  },
  {
    id: "usr-0006",
    first_name: "Sofia",
    last_name: "Nguyen",
    role: "student",
    points_balance: 1920,
    trend: "same",
    points_this_week: 120,
  },
  {
    id: "usr-0007",
    first_name: "Alex",
    last_name: "Griffin",
    role: "student",
    points_balance: 1240,
    trend: "up",
    points_this_week: 160,
  },
  {
    id: "usr-0008",
    first_name: "Devon",
    last_name: "Hayes",
    role: "student",
    points_balance: 1180,
    trend: "down",
    points_this_week: 45,
  },
  {
    id: "usr-0009",
    first_name: "Morgan",
    last_name: "Lee",
    role: "student",
    points_balance: 1095,
    trend: "up",
    points_this_week: 130,
  },
  {
    id: "usr-0010",
    first_name: "Chris",
    last_name: "Dalton",
    role: "teacher",
    points_balance: 980,
    trend: "same",
    points_this_week: 60,
  },
  {
    id: "usr-0011",
    first_name: "Riley",
    last_name: "Foster",
    role: "student",
    points_balance: 875,
    trend: "down",
    points_this_week: 30,
  },
  {
    id: "usr-0012",
    first_name: "Jamie",
    last_name: "Okonkwo",
    role: "student",
    points_balance: 760,
    trend: "up",
    points_this_week: 95,
  },
  {
    id: "usr-0013",
    first_name: "Sam",
    last_name: "Rivera",
    role: "admin",
    points_balance: 640,
    trend: "same",
    points_this_week: 0,
  },
  {
    id: "usr-0014",
    first_name: "Casey",
    last_name: "Mitchell",
    role: "student",
    points_balance: 520,
    trend: "up",
    points_this_week: 75,
  },
  {
    id: "usr-0015",
    first_name: "Dana",
    last_name: "Kim",
    role: "student",
    points_balance: 410,
    trend: "down",
    points_this_week: 20,
  },
];

function assignRanks(
  users: Omit<LeaderboardEntry, "rank">[],
): LeaderboardEntry[] {
  return [...users]
    .sort((a, b) => b.points_balance - a.points_balance)
    .map((user, index) => ({ ...user, rank: index + 1 }));
}

export const LEADERBOARD: LeaderboardEntry[] = assignRanks(MOCK_USERS);

export const LEADERBOARD_TOTAL = LEADERBOARD.length;

export function getLeaderboardByRole(
  filter: LeaderboardRoleFilter,
): LeaderboardEntry[] {
  const filtered =
    filter === "all"
      ? LEADERBOARD
      : LEADERBOARD.filter((entry) => entry.role === filter);

  return filtered
    .sort((a, b) => b.points_balance - a.points_balance)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function getCurrentUserEntry(): LeaderboardEntry | undefined {
  return LEADERBOARD.find((entry) => entry.id === CURRENT_USER_ID);
}

export function formatDisplayName(entry: Pick<UserPublic, "first_name" | "last_name">) {
  return `${entry.first_name} ${entry.last_name.charAt(0)}.`;
}

export function formatFullName(entry: Pick<UserPublic, "first_name" | "last_name">) {
  return `${entry.first_name} ${entry.last_name}`;
}
