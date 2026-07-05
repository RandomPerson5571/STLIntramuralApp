"use client";

import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { useWeeklyActivity } from "@/hooks/useDashboard";

export default function WeeklyActivityWidget({ index }: { index: number }) {
  const { data: activity, isPending, isError, refetch } = useWeeklyActivity();

  const days = activity ?? [];
  const maxGames = Math.max(...days.map((d) => d.games), 1);
  const totalGames = days.reduce((sum, d) => sum + d.games, 0);

  return (
    <DashboardWidget
      title="This Week"
      icon="bar_chart"
      accentColor="tertiary"
      index={index}
      isLoading={isPending}
      isError={isError}
      errorMessage="Could not load weekly activity."
      onRetry={() => void refetch()}
    >
      <div className="flex h-20 items-end justify-between gap-1.5">
        {days.map((day, i) => {
          const height = day.games === 0 ? 8 : (day.games / maxGames) * 100;

          return (
            <div key={`${day.day}-${i}`} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-14 w-full items-end justify-center">
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${
                    day.games > 0
                      ? day.isToday
                        ? "bg-gradient-to-t from-primary to-primary-fixed-variant shadow-[0_2px_8px_rgba(0,48,174,0.25)]"
                        : "bg-gradient-to-t from-secondary/70 to-secondary-container/80"
                      : "bg-surface-container-high"
                  }`}
                  style={{ height: `${height}%`, minHeight: day.games === 0 ? "8px" : undefined }}
                />
              </div>
              <span
                className={`text-label-sm font-label-sm uppercase ${
                  day.isToday ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-sm text-body-md text-on-surface-variant">
        <span className="font-semibold text-on-surface">{totalGames}</span> games played this week
      </p>
    </DashboardWidget>
  );
}
