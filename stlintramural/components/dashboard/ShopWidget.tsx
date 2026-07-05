"use client";

import Link from "next/link";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { useFeaturedShopItems } from "@/hooks/useDashboard";

export default function ShopWidget({ index }: { index: number }) {
  const { data: items, isPending, isError, refetch } = useFeaturedShopItems();

  return (
    <DashboardWidget
      title="Shop"
      icon="storefront"
      accentColor="secondary"
      index={index}
      isLoading={isPending}
      isError={isError}
      errorMessage="Could not load shop items."
      onRetry={() => void refetch()}
    >
      {items && items.length === 0 ? (
        <p className="py-4 text-center text-body-md text-on-surface-variant">
          No items in stock right now.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {(items ?? []).map((item) => (
            <li
              key={item.id}
              className="group flex items-center justify-between gap-sm rounded-xl border border-surface-variant/60 bg-surface-container-low/60 p-2 transition-[transform,background-color,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-secondary/20 hover:bg-surface-container hover:shadow-[0_4px_14px_rgba(0,102,136,0.08)] sm:p-2.5"
            >
              <div className="flex min-w-0 items-center gap-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/[0.1] ring-1 ring-secondary/10">
                  <MaterialSymbol icon={item.icon} className="text-secondary" />
                </div>
                <span className="truncate text-body-md text-on-surface">{item.name}</span>
              </div>
              <span className="shrink-0 rounded-lg bg-secondary/[0.08] px-2 py-0.5 text-label-sm font-label-sm uppercase text-secondary">
                {item.pointsCost} pts
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/shop"
        className="mt-sm block w-full rounded-xl bg-gradient-to-r from-secondary to-secondary-container py-2 text-center text-label-sm font-label-sm uppercase text-on-secondary shadow-[0_4px_14px_rgba(0,102,136,0.25)] transition-[transform,opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_18px_rgba(0,102,136,0.32)] active:scale-[0.98]"
      >
        Browse Shop
      </Link>
    </DashboardWidget>
  );
}
