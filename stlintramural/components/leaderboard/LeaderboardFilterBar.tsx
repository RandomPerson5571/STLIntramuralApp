"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { LeaderboardRoleFilter } from "@/lib/leaderboard-data";

const FILTERS: { value: LeaderboardRoleFilter; label: string; icon: string }[] = [
  { value: "all", label: "All Players", icon: "groups" },
  { value: "student", label: "Students", icon: "school" },
  { value: "teacher", label: "Teachers", icon: "co_present" },
  { value: "admin", label: "Admins", icon: "admin_panel_settings" },
];

interface LeaderboardFilterBarProps {
  activeFilter: LeaderboardRoleFilter;
  onFilterChange: (filter: LeaderboardRoleFilter) => void;
}

export default function LeaderboardFilterBar({
  activeFilter,
  onFilterChange,
}: LeaderboardFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={`group flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-label-sm font-label-sm uppercase tracking-wide transition-[transform,background-color,box-shadow,border-color,color] duration-200 active:scale-[0.98] ${
              isActive
                ? "border-primary/20 bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
                : "border-surface-variant/70 bg-surface-container-lowest/80 text-on-surface-variant hover:border-primary/15 hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <MaterialSymbol
              icon={filter.icon}
              filled={isActive}
              className={`text-base ${isActive ? "text-on-primary" : "text-on-surface-variant group-hover:text-primary"}`}
            />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
