"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import LeaderboardFilterBar from "@/components/leaderboard/LeaderboardFilterBar";
import LeaderboardPodium from "@/components/leaderboard/LeaderboardPodium";
import LeaderboardRow from "@/components/leaderboard/LeaderboardRow";
import LeaderboardYourRank from "@/components/leaderboard/LeaderboardYourRank";
import {
  CURRENT_USER_ID,
  getCurrentUserEntry,
  getLeaderboardByRole,
  LEADERBOARD,
  type LeaderboardRoleFilter,
} from "@/lib/leaderboard-data";

const STAT_SHADE = {
  primary: {
    bg: "from-primary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,48,174,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,48,174,0.18)]",
    icon: "text-primary bg-primary/[0.1]",
    border: "border-primary/10 hover:border-primary/20",
  },
  secondary: {
    bg: "from-secondary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,102,136,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,102,136,0.18)]",
    icon: "text-secondary bg-secondary/[0.1]",
    border: "border-secondary/10 hover:border-secondary/20",
  },
};

export default function LeaderboardContent() {
  const [activeFilter, setActiveFilter] = useState<LeaderboardRoleFilter>("all");

  const filteredEntries = useMemo(
    () => getLeaderboardByRole(activeFilter),
    [activeFilter],
  );

  const currentUser = useMemo(() => {
    const globalEntry = getCurrentUserEntry();
    if (!globalEntry) return undefined;

    if (activeFilter === "all") return globalEntry;

    return filteredEntries.find((entry) => entry.id === CURRENT_USER_ID);
  }, [activeFilter, filteredEntries]);

  const topPoints = LEADERBOARD[0]?.points_balance ?? 0;
  const avgPoints = Math.round(
    LEADERBOARD.reduce((sum, entry) => sum + entry.points_balance, 0) /
      LEADERBOARD.length,
  );

  const stats = [
    {
      icon: "groups",
      label: "Players",
      value: String(filteredEntries.length),
      suffix: "ranked",
      accent: "primary" as const,
    },
    {
      icon: "emoji_events",
      label: "Top Score",
      value: topPoints.toLocaleString(),
      suffix: "pts",
      accent: "secondary" as const,
    },
    {
      icon: "analytics",
      label: "Average",
      value: avgPoints.toLocaleString(),
      suffix: "pts",
      accent: "primary" as const,
    },
    {
      icon: "leaderboard",
      label: "Your Rank",
      value: currentUser ? `#${currentUser.rank}` : "—",
      suffix: currentUser ? "place" : "",
      accent: "secondary" as const,
    },
  ];

  const listEntries = filteredEntries.slice(3);

  return (
    <div className="relative mx-auto max-w-7xl px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 left-0 h-56 w-56 rounded-full bg-secondary/[0.05] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-sm grid grid-cols-2 gap-xs sm:mb-md sm:grid-cols-4 sm:gap-sm"
      >
        {stats.map((stat, i) => {
          const shade = STAT_SHADE[stat.accent];

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.04 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br px-sm py-2.5 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 sm:py-3 ${shade.bg} ${shade.shadow} ${shade.hover} ${shade.border}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${shade.icon}`}
                >
                  <MaterialSymbol icon={stat.icon} className="text-base" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                    {stat.label}
                  </p>
                  <p className="truncate text-headline-md font-headline-md uppercase leading-tight text-on-surface">
                    {stat.value}
                    {stat.suffix && (
                      <span className="ml-1 text-label-sm font-label-sm normal-case text-on-surface-variant">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {currentUser && (
        <div className="mb-sm sm:mb-md">
          <LeaderboardYourRank entry={currentUser} />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-sm overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/95 p-sm shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.1)] backdrop-blur-sm sm:mb-md sm:p-md"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.03]"
          aria-hidden
        />
        <div className="relative">
          <LeaderboardFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </motion.div>

      {filteredEntries.length >= 3 && (
        <div className="mb-sm sm:mb-md">
          <LeaderboardPodium entries={filteredEntries} />
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Full rankings"
      >
        <div className="mb-sm flex items-center justify-between">
          <h2 className="text-headline-md font-headline-md uppercase text-on-surface">
            Full Rankings
          </h2>
          <span className="text-label-sm font-label-sm uppercase text-on-surface-variant">
            {filteredEntries.length} players
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-variant/80 bg-surface-container-low/50 px-sm py-xl text-center">
            <MaterialSymbol
              icon="leaderboard"
              className="mx-auto mb-2 text-3xl text-outline"
            />
            <p className="text-body-md font-body-md text-on-surface-variant">
              No players match this filter yet.
            </p>
          </div>
        ) : listEntries.length === 0 ? (
          <p className="rounded-2xl border border-surface-variant/60 bg-surface-container-low/40 px-sm py-md text-center text-body-md font-body-md text-on-surface-variant">
            Top three shown above — no additional players in this filter.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {listEntries.map((entry, i) => (
              <LeaderboardRow key={entry.id} entry={entry} index={i} />
            ))}
          </ul>
        )}
      </motion.section>
    </div>
  );
}
