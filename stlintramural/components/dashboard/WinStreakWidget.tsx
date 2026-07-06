"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { WIN_STREAK } from "@/lib/constants/dashboard";

export default function WinStreakWidget({ index }: { index: number }) {
  return (
    <DashboardWidget
      title="Win Streak"
      icon="local_fire_department"
      accentColor="secondary"
      variant="featured"
      index={index}
    >
      <div className="flex items-center gap-sm">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 to-secondary-container/30 blur-sm" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary-container shadow-[0_4px_16px_rgba(0,102,136,0.35)]">
            <MaterialSymbol icon="local_fire_department" filled className="text-on-secondary text-2xl" />
          </div>
        </div>
        <div>
          <p className="text-[clamp(2rem,5vw,2.75rem)] font-display-xl leading-none text-on-surface">
            {WIN_STREAK}
          </p>
          <p className="mt-0.5 text-label-sm font-label-sm uppercase tracking-wider text-secondary">
            Games in a row
          </p>
        </div>
      </div>
      <p className="mt-sm text-body-md text-on-surface-variant leading-snug">
        Keep it going — one more win unlocks a bonus badge.
      </p>
    </DashboardWidget>
  );
}
