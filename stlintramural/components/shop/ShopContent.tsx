"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import ShopFilterBar from "@/components/shop/ShopFilterBar";
import ShopItemCard from "@/components/shop/ShopItemCard";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import QueryErrorBlock from "@/components/ui/QueryErrorBlock";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useShopItems } from "@/hooks/useShop";
import { STAT_SHADE } from "@/lib/constants/stat-shade";
import type { ShopCategory, ShopItemDisplay, ShopSortOption } from "@/types/shop";

function sortItems(items: ShopItemDisplay[], sort: ShopSortOption) {
  const sorted = [...items];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.cost - b.cost);
    case "price-desc":
      return sorted.sort((a, b) => b.cost - a.cost);
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    default:
      return sorted;
  }
}

export default function ShopContent() {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("All Items");
  const [sortOption, setSortOption] = useState<ShopSortOption>("featured");
  const { data: user, isPending: userPending } = useCurrentUser();
  const { data: shopItems, isPending, isError, error, refetch } = useShopItems();
  const userPoints = user?.points_balance ?? 0;

  const items = shopItems ?? [];

  const filteredItems = useMemo(() => {
    const categoryFiltered =
      activeCategory === "All Items"
        ? items
        : items.filter((item) => item.category === activeCategory);

    return sortItems(categoryFiltered, sortOption);
  }, [activeCategory, sortOption, items]);

  const affordableCount = items.filter(
    (item) => item.stock > 0 && item.cost <= userPoints,
  ).length;
  const inStockCount = items.filter((item) => item.stock > 0).length;

  const stats = [
    {
      icon: "account_balance_wallet",
      label: "Your Balance",
      value: userPending ? "…" : userPoints.toLocaleString(),
      suffix: "pts",
      accent: "secondary" as const,
    },
    {
      icon: "inventory_2",
      label: "Available",
      value: isPending ? "…" : String(inStockCount),
      suffix: "items",
      accent: "primary" as const,
    },
    {
      icon: "redeem",
      label: "Affordable",
      value: isPending ? "…" : String(affordableCount),
      suffix: "now",
      accent: "secondary" as const,
    },
    {
      icon: "category",
      label: "Showing",
      value: isPending ? "…" : String(filteredItems.length),
      suffix: "results",
      accent: "primary" as const,
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-lg py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-secondary/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-primary/[0.05] blur-3xl" />
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-md overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/95 p-md shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,102,136,0.1)] backdrop-blur-sm"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/[0.04] via-transparent to-primary/[0.03]"
          aria-hidden
        />
        <div className="relative">
          <ShopFilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </div>
      </motion.div>

      {isPending ? (
        <ContentSkeleton
          variant="card-grid"
          gridClassName="grid grid-cols-3 gap-md"
        />
      ) : isError ? (
        <QueryErrorBlock
          title="Could not load shop items."
          detail={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
        />
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-md">
          {filteredItems.map((item, index) => (
            <ShopItemCard key={item.id} item={item} index={index} userPoints={userPoints} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search_off"
          title="No items found"
          description="Try a different category or check back later for new rewards."
          animated
        />
      )}
    </div>
  );
}
