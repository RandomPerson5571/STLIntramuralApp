"use client";

import type { SportFilter } from "@/types/event";
import { SPORT_FILTERS } from "@/lib/constants/event-filters";
import { FilterPill, FilterPillGroup } from "@/components/ui/FilterPill";

interface SportFilterBarProps {
  activeFilter: SportFilter;
  onFilterChange: (filter: SportFilter) => void;
}

export default function SportFilterBar({
  activeFilter,
  onFilterChange,
}: SportFilterBarProps) {
  return (
    <FilterPillGroup className="w-full gap-1.5 md:w-auto">
      {SPORT_FILTERS.map((sport) => (
        <FilterPill
          key={sport}
          active={activeFilter === sport}
          onClick={() => onFilterChange(sport)}
        >
          {sport}
        </FilterPill>
      ))}
    </FilterPillGroup>
  );
}
