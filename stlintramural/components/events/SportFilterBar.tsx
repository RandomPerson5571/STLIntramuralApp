"use client";

import type { SportFilter } from "@/types/event";
import { SPORT_FILTERS } from "@/lib/events-data";

interface SportFilterBarProps {
  activeFilter: SportFilter;
  onFilterChange: (filter: SportFilter) => void;
}

export default function SportFilterBar({
  activeFilter,
  onFilterChange,
}: SportFilterBarProps) {
  return (
    <div className="scrollbar-hide flex w-full gap-1.5 overflow-x-auto pb-1 md:w-auto">
      {SPORT_FILTERS.map((sport) => {
        const isActive = activeFilter === sport;

        return (
          <button
            key={sport}
            type="button"
            onClick={() => onFilterChange(sport)}
            className={`whitespace-nowrap rounded-xl px-3 py-2 text-label-sm font-label-sm uppercase transition-[transform,background-color,box-shadow,color] duration-200 active:scale-[0.98] ${
              isActive
                ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
                : "border border-surface-variant/60 bg-surface-container-low/80 text-on-surface-variant hover:border-primary/20 hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            {sport}
          </button>
        );
      })}
    </div>
  );
}
