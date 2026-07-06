"use client";

import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { useLeagueRank } from "@/hooks/useDashboard";

export default function LeagueRankWidget({ index }: { index: number }) {
  const { data: leagueRank, isPending, isError, refetch } = useLeagueRank();

  const rank = leagueRank?.rank ?? 0;
  const total = leagueRank?.total ?? 0;
  const percentile =
    total > 0 ? Math.round(((total - rank + 1) / total) * 100) : 0;

  return (
    <DashboardWidget
      title="League Rank"
      icon="leaderboard"
      accentColor="primary"
      variant="dark"
      index={index}
      isLoading={isPending}
      isError={isError}
      errorMessage="Could not load your league rank."
      onRetry={() => void refetch()}
    >
      <div className="flex items-baseline gap-1">
        <span className="text-[clamp(2.5rem,6vw,3.5rem)] font-display-xl leading-none text-on-primary">
          #{rank || "—"}
        </span>
        {total > 0 && (
          <span className="text-body-md text-on-primary/70">/ {total}</span>
        )}
      </div>
      {total > 0 && (
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
      )}
    </DashboardWidget>
  );
}
