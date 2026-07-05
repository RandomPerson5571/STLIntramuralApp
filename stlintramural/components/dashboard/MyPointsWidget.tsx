"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { useCheapestShopItemCost } from "@/hooks/useDashboard";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function MyPointsWidget({ index }: { index: number }) {
  const {
    data: user,
    isPending: userPending,
    isError: userError,
    refetch: refetchUser,
  } = useCurrentUser();
  const {
    data: cheapestCost,
    isPending: costPending,
    isError: costError,
    refetch: refetchCost,
  } = useCheapestShopItemCost();

  const isLoading = userPending || costPending;
  const isError = userError || costError;
  const points = user?.points_balance ?? 0;
  const nextReward = cheapestCost ?? null;
  const progress = nextReward ? Math.min((points / nextReward) * 100, 100) : 0;
  const remaining = nextReward ? Math.max(nextReward - points, 0) : 0;

  return (
    <DashboardWidget
      title="My Points"
      icon="stars"
      accentColor="primary"
      variant="featured"
      index={index}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Could not load your points balance."
      onRetry={() => {
        void refetchUser();
        void refetchCost();
      }}
    >
      <div className="flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">
            Current Balance
          </p>
          <p className="text-[clamp(2.75rem,7vw,4rem)] font-display-xl leading-none text-on-surface">
            {points.toLocaleString()}
            <span className="ml-1 text-headline-md font-headline-md text-on-surface-variant">
              pts
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-xl border border-primary/10 bg-primary/[0.06] px-3 py-2 text-center">
            <p className="text-label-sm font-label-sm uppercase text-primary">To reward</p>
            <p className="text-headline-md font-headline-md text-on-surface">{remaining}</p>
          </div>
          <div className="rounded-xl border border-secondary/10 bg-secondary/[0.06] px-3 py-2 text-center">
            <p className="text-label-sm font-label-sm uppercase text-secondary">Progress</p>
            <p className="text-headline-md font-headline-md text-on-surface">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>

      <div className="mt-sm space-y-1.5">
        <div className="flex justify-between text-label-sm font-label-sm uppercase text-on-surface-variant">
          <span>
            {cheapestCost != null
              ? `Next reward at ${cheapestCost.toLocaleString()} pts`
              : "No shop rewards available yet"}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary-container shadow-[0_0_12px_rgba(0,48,174,0.35)] transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-sm flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-outline-variant py-2 text-label-sm font-label-sm uppercase text-on-surface transition-[transform,border-color,color] duration-200 hover:border-primary hover:text-primary active:scale-[0.98] sm:w-auto sm:px-md"
      >
        <MaterialSymbol icon="history" className="text-base" />
        View History
      </button>
    </DashboardWidget>
  );
}
