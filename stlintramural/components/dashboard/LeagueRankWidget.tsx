"use client";

import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { LEAGUE_RANK, LEAGUE_TOTAL } from "@/lib/dashboard-data";

export default function LeagueRankWidget({ index }: { index: number }) {
  const percentile = Math.round(((LEAGUE_TOTAL - LEAGUE_RANK + 1) / LEAGUE_TOTAL) * 100);

  return (
    <DashboardWidget
      title="League Rank"
      icon="leaderboard"
      accentColor="primary"
      variant="dark"
      index={index}
    >
      <div className="flex items-baseline gap-1">
        <span className="text-[clamp(2.5rem,6vw,3.5rem)] font-display-xl leading-none text-on-primary">
          #{LEAGUE_RANK}
        </span>
        <span className="text-body-md text-on-primary/70">/ {LEAGUE_TOTAL}</span>
      </div>
      <div className="mt-sm space-y-1.5">
        <div className="flex justify-between text-label-sm font-label-sm uppercase text-on-primary/70">
          <span>Top {100 - percentile + 1}%</span>
          <span>{percentile}th percentile</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary-container to-on-primary"
            style={{ width: `${percentile}%` }}
          />
        </div>
      </div>
    </DashboardWidget>
  );
}
