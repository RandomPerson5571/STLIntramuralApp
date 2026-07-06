"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import LeaderboardFilterBar from "@/components/leaderboard/LeaderboardFilterBar";
import LeaderboardPodium from "@/components/leaderboard/LeaderboardPodium";
import LeaderboardRow from "@/components/leaderboard/LeaderboardRow";
import LeaderboardYourRank from "@/components/leaderboard/LeaderboardYourRank";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import QueryErrorBlock from "@/components/ui/QueryErrorBlock";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import {
  applyLeaderboardFilters,
  type LeaderboardGradeFilter,
  type LeaderboardSortOrder,
} from "@/lib/constants/leaderboard";
import { STAT_SHADE } from "@/lib/constants/stat-shade";

export default function LeaderboardContent() {
  const [activeGrade, setActiveGrade] = useState<LeaderboardGradeFilter>("all");
  const [sortOrder, setSortOrder] = useState<LeaderboardSortOrder>("desc");
  const { data: user } = useCurrentUser();
  const {
    data: entries = [],
    isPending,
    isError,
    error,
    refetch,
  } = useLeaderboard();

  const filteredEntries = useMemo(
    () => applyLeaderboardFilters(entries, activeGrade, sortOrder),
    [entries, activeGrade, sortOrder],
  );

  const currentUser = useMemo(() => {
    if (!user) return undefined;
    return filteredEntries.find((entry) => entry.id === user.id);
  }, [user, filteredEntries]);

  const topPoints =
    filteredEntries.length > 0
      ? Math.max(...filteredEntries.map((entry) => entry.points_balance))
      : 0;
  const avgPoints =
    filteredEntries.length > 0
      ? Math.round(
          filteredEntries.reduce((sum, entry) => sum + entry.points_balance, 0) /
            filteredEntries.length,
        )
      : 0;

  const stats = [
    {
      icon: "school",
      label: "Students",
      value: isPending ? "…" : String(filteredEntries.length),
      suffix: "ranked",
      accent: "primary" as const,
    },
    {
      icon: "emoji_events",
      label: "Top Score",
      value: isPending ? "…" : topPoints.toLocaleString(),
      suffix: "pts",
      accent: "secondary" as const,
    },
    {
      icon: "analytics",
      label: "Average",
      value: isPending ? "…" : avgPoints.toLocaleString(),
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

  const showPodium = sortOrder === "desc" && filteredEntries.length >= 3;
  const listEntries = showPodium ? filteredEntries.slice(3) : filteredEntries;

  return (
    <div className="relative mx-auto max-w-7xl px-lg py-lg">
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
        className="mb-md grid grid-cols-4 gap-sm"
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
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br px-sm py-3 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 ${shade.bg} ${shade.shadow} ${shade.hover} ${shade.border}`}
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
        <div className="mb-md">
          <LeaderboardYourRank
            entry={currentUser}
            totalPlayers={filteredEntries.length}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-md overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/95 p-md shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.1)] backdrop-blur-sm"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.03]"
          aria-hidden
        />
        <div className="relative">
          <LeaderboardFilterBar
            activeGrade={activeGrade}
            onGradeChange={setActiveGrade}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </div>
      </motion.div>

      {isPending ? (
        <ContentSkeleton variant="table-rows" />
      ) : isError ? (
        <QueryErrorBlock
          title="Could not load leaderboard."
          detail={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          {showPodium && (
            <div className="mb-md">
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
                {filteredEntries.length} students
              </span>
            </div>

            {filteredEntries.length === 0 ? (
              <EmptyState
                icon="leaderboard"
                title="No students match this filter yet."
              />
            ) : listEntries.length === 0 ? (
              <p className="rounded-2xl border border-surface-variant/60 bg-surface-container-low/40 px-sm py-md text-center text-body-md font-body-md text-on-surface-variant">
                Top three shown above — no additional students in this filter.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {listEntries.map((entry, i) => (
                  <LeaderboardRow key={entry.id} entry={entry} index={i} />
                ))}
              </ul>
            )}
          </motion.section>
        </>
      )}
    </div>
  );
}
