"use client";

import SortSelect from "@/components/ui/SortSelect";
import { FilterPill, FilterPillGroup } from "@/components/ui/FilterPill";
import {
  LEADERBOARD_GRADE_FILTERS,
  LEADERBOARD_SORT_OPTIONS,
  type LeaderboardGradeFilter,
  type LeaderboardSortOrder,
} from "@/lib/constants/leaderboard";

interface LeaderboardFilterBarProps {
  activeGrade: LeaderboardGradeFilter;
  onGradeChange: (grade: LeaderboardGradeFilter) => void;
  sortOrder: LeaderboardSortOrder;
  onSortChange: (sort: LeaderboardSortOrder) => void;
}

export default function LeaderboardFilterBar({
  activeGrade,
  onGradeChange,
  sortOrder,
  onSortChange,
}: LeaderboardFilterBarProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-md">
      <FilterPillGroup variant="wrap">
        {LEADERBOARD_GRADE_FILTERS.map((filter) => (
          <FilterPill
            key={String(filter.value)}
            active={activeGrade === filter.value}
            onClick={() => onGradeChange(filter.value)}
            icon={filter.value === "all" ? "groups" : "school"}
            filledIcon
            shape="2xl"
          >
            {filter.label}
          </FilterPill>
        ))}
      </FilterPillGroup>

      <SortSelect
        value={sortOrder}
        onChange={onSortChange}
        options={LEADERBOARD_SORT_OPTIONS}
        ariaLabel="Sort leaderboard by points"
      />
    </div>
  );
}
