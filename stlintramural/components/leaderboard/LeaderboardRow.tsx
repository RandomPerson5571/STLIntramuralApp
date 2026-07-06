"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  formatDisplayName,
  type LeaderboardEntry,
} from "@/lib/constants/leaderboard";
import type { UserRole } from "@/types/database/user";

const ROLE_STYLES: Record<UserRole, { badge: string; dot: string }> = {
  student: {
    badge: "bg-primary/[0.08] text-primary border-primary/15",
    dot: "bg-primary",
  },
  teacher: {
    badge: "bg-secondary/[0.08] text-secondary border-secondary/15",
    dot: "bg-secondary",
  },
  admin: {
    badge: "bg-tertiary/[0.08] text-tertiary border-tertiary/15",
    dot: "bg-tertiary",
  },
};

const TREND_CONFIG = {
  up: { icon: "trending_up", className: "text-secondary" },
  down: { icon: "trending_down", className: "text-error" },
  same: { icon: "trending_flat", className: "text-outline" },
} as const;

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  index: number;
}

export default function LeaderboardRow({ entry, index }: LeaderboardRowProps) {
  const { data: user } = useCurrentUser();
  const isCurrentUser = entry.id === user?.id;
  const roleStyle = ROLE_STYLES[entry.role];
  const trend = TREND_CONFIG[entry.trend];

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.04 + index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative flex items-center gap-3 rounded-2xl border px-3 py-3 transition-[transform,box-shadow,border-color,background-color] duration-300 sm:gap-4 sm:px-4 sm:py-3.5 ${
        isCurrentUser
          ? "border-primary/25 bg-gradient-to-r from-primary/[0.06] to-surface-container-lowest shadow-[0_4px_16px_rgba(0,48,174,0.12)]"
          : "border-surface-variant/60 bg-surface-container-lowest/80 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-[0_4px_16px_rgba(26,28,31,0.06)]"
      }`}
    >
      {isCurrentUser && (
        <span
          className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
          aria-hidden
        />
      )}

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-headline-md font-headline-md tabular-nums sm:h-11 sm:w-11 ${
          entry.rank <= 3
            ? "bg-primary text-on-primary shadow-[0_2px_8px_rgba(0,48,174,0.2)]"
            : "bg-surface-container text-on-surface-variant"
        }`}
      >
        {entry.rank}
      </div>

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-surface-container-high to-surface-container sm:h-11 sm:w-11 ${
          isCurrentUser ? "ring-2 ring-primary/20" : ""
        }`}
      >
        <span className="text-body-md font-body-md text-on-surface">
          {entry.first_name.charAt(0)}
          {entry.last_name.charAt(0)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-body-md font-body-md text-on-surface">
            {formatDisplayName(entry)}
            {isCurrentUser && (
              <span className="ml-2 text-label-sm font-label-sm uppercase text-primary">
                You
              </span>
            )}
          </p>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-label-sm uppercase tracking-wide ${roleStyle.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`} aria-hidden />
            {entry.role}
          </span>
          <span className="hidden text-label-sm font-label-sm text-on-surface-variant sm:inline">
            +{entry.points_this_week} this week
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <p className="text-headline-md font-headline-md tabular-nums text-on-surface">
          {entry.points_balance.toLocaleString()}
        </p>
        <div className={`flex items-center gap-0.5 ${trend.className}`}>
          <MaterialSymbol icon={trend.icon} className="text-sm" />
          <span className="text-label-sm font-label-sm uppercase">pts</span>
        </div>
      </div>
    </motion.li>
  );
}
