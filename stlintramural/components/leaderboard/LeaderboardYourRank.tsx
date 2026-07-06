"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import {
  formatFullName,
  type LeaderboardEntry,
} from "@/lib/constants/leaderboard";

interface LeaderboardYourRankProps {
  entry: LeaderboardEntry;
  totalPlayers: number;
}

export default function LeaderboardYourRank({
  entry,
  totalPlayers,
}: LeaderboardYourRankProps) {
  const percentile = Math.round(
    ((totalPlayers - entry.rank + 1) / totalPlayers) * 100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-primary-container to-primary shadow-[0_8px_32px_rgba(0,48,174,0.25)]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black/10 to-transparent"
        aria-hidden
      />

      <div className="relative flex flex-col gap-sm p-sm sm:flex-row sm:items-center sm:justify-between sm:p-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <MaterialSymbol icon="person" className="text-2xl text-on-primary" />
          </div>
          <div>
            <p className="text-label-sm font-label-sm uppercase tracking-widest text-on-primary/70">
              Your Standing
            </p>
            <p className="text-body-lg font-body-lg text-on-primary">
              {formatFullName(entry)}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-6 sm:gap-8">
          <div>
            <p className="text-label-sm font-label-sm uppercase text-on-primary/70">
              Rank
            </p>
            <p className="text-[clamp(2rem,5vw,2.75rem)] font-display-xl leading-none text-on-primary">
              #{entry.rank}
            </p>
          </div>
          <div>
            <p className="text-label-sm font-label-sm uppercase text-on-primary/70">
              Points
            </p>
            <p className="text-[clamp(2rem,5vw,2.75rem)] font-display-xl leading-none text-on-primary">
              {entry.points_balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-sm pb-sm pt-3 sm:px-md sm:pb-md">
        <div className="mb-1.5 flex justify-between text-label-sm font-label-sm uppercase text-on-primary/70">
          <span>Top {100 - percentile + 1}% of league</span>
          <span>{percentile}th percentile</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/15">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentile}%` }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-secondary-container to-on-primary"
          />
        </div>
      </div>
    </motion.div>
  );
}
