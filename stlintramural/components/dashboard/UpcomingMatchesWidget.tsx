"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { UPCOMING_MATCHES } from "@/lib/dashboard-data";

const ACCENT_MAP = {
  primary: {
    badge: "bg-primary/[0.08] text-primary ring-primary/10",
    dot: "bg-primary",
  },
  secondary: {
    badge: "bg-secondary/[0.08] text-secondary ring-secondary/10",
    dot: "bg-secondary",
  },
} as const;

export default function UpcomingMatchesWidget({ index }: { index: number }) {
  return (
    <DashboardWidget
      title="Upcoming Matches"
      icon="sports"
      accentColor="secondary"
      index={index}
    >
      <ul className="divide-y divide-surface-variant/50">
        {UPCOMING_MATCHES.map((match) => {
          const accent = ACCENT_MAP[match.accentColor];

          return (
            <li
              key={match.id}
              className="group flex flex-col gap-2 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-md sm:py-3"
            >
              <div className="flex min-w-0 flex-1 items-start gap-sm">
                <div
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${accent.dot} shadow-[0_0_8px_currentColor]`}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-lg px-2 py-0.5 text-label-sm font-label-sm uppercase ring-1 ${accent.badge}`}
                    >
                      {match.sport}
                    </span>
                    <span className="text-headline-md font-headline-md uppercase text-on-surface">
                      vs {match.opponent}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-md gap-y-0.5 text-body-md text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <MaterialSymbol icon="event" className="text-base text-outline" />
                      {match.dateTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MaterialSymbol icon="location_on" className="text-base text-outline" />
                      {match.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border-2 border-outline-variant px-3 py-1.5 text-label-sm font-label-sm uppercase text-on-surface transition-[transform,border-color,color] duration-200 hover:border-primary hover:text-primary active:scale-[0.98] sm:ml-auto"
              >
                Details
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="mt-sm w-full rounded-xl bg-primary px-md py-2 text-label-sm font-label-sm uppercase text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary-fixed-variant hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)] active:scale-[0.98] sm:w-auto sm:self-end"
      >
        View Schedule
      </button>
    </DashboardWidget>
  );
}
