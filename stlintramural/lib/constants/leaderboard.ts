import { calculateGrade } from "@/lib/ycdsb-email";
import type { UserPublic } from "@/types/database/user";

export type LeaderboardTrend = "up" | "down" | "same";

export type LeaderboardGradeFilter = "all" | 9 | 10 | 11 | 12;

export type LeaderboardSortOrder = "desc" | "asc";

export interface LeaderboardEntry extends UserPublic {
  graduation_year: number | null;
  rank: number;
  trend: LeaderboardTrend;
  points_this_week: number;
}

export const LEADERBOARD_GRADE_FILTERS: {
  value: LeaderboardGradeFilter;
  label: string;
}[] = [
  { value: "all", label: "All Grades" },
  { value: 9, label: "Grade 9" },
  { value: 10, label: "Grade 10" },
  { value: 11, label: "Grade 11" },
  { value: 12, label: "Grade 12" },
];

export const LEADERBOARD_SORT_OPTIONS: {
  value: LeaderboardSortOrder;
  label: string;
}[] = [
  { value: "desc", label: "Most to Least Points" },
  { value: "asc", label: "Least to Most Points" },
];

export function getStudentGrade(
  graduationYear: number | null | undefined,
  referenceDate: Date = new Date(),
): number | null {
  if (graduationYear == null) {
    return null;
  }

  return calculateGrade(graduationYear, referenceDate);
}

export function applyLeaderboardFilters(
  entries: Omit<LeaderboardEntry, "rank">[],
  gradeFilter: LeaderboardGradeFilter,
  sortOrder: LeaderboardSortOrder,
  referenceDate: Date = new Date(),
): LeaderboardEntry[] {
  const filtered =
    gradeFilter === "all"
      ? entries
      : entries.filter(
          (entry) => getStudentGrade(entry.graduation_year, referenceDate) === gradeFilter,
        );

  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "desc"
      ? b.points_balance - a.points_balance
      : a.points_balance - b.points_balance,
  );

  return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function formatDisplayName(
  entry: Pick<UserPublic, "first_name" | "last_name">,
) {
  return `${entry.first_name} ${entry.last_name.charAt(0)}.`;
}

export function formatFullName(
  entry: Pick<UserPublic, "first_name" | "last_name">,
) {
  return `${entry.first_name} ${entry.last_name}`;
}
