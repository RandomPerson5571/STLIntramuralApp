"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import ShopFilterBar from "@/components/shop/ShopFilterBar";
import ShopItemCard from "@/components/shop/ShopItemCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SHOP_ITEMS } from "@/lib/shop-data";
import type { ShopCategory, ShopSortOption } from "@/types/shop";

const STAT_SHADE = {
  primary: {
    bg: "from-primary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,48,174,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,48,174,0.18)]",
    icon: "text-primary bg-primary/[0.1]",
    border: "border-primary/10 hover:border-primary/20",
  },
  secondary: {
    bg: "from-secondary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,102,136,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,102,136,0.18)]",
    icon: "text-secondary bg-secondary/[0.1]",
    border: "border-secondary/10 hover:border-secondary/20",
  },
};

function sortItems(items: typeof SHOP_ITEMS, sort: ShopSortOption) {
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
  const userPoints = user?.points_balance ?? 0;

  const filteredItems = useMemo(() => {
    const categoryFiltered =
      activeCategory === "All Items"
        ? SHOP_ITEMS
        : SHOP_ITEMS.filter((item) => item.category === activeCategory);

    return sortItems(categoryFiltered, sortOption);
  }, [activeCategory, sortOption]);

  const affordableCount = SHOP_ITEMS.filter(
    (item) => item.stock > 0 && item.cost <= userPoints,
  ).length;
  const inStockCount = SHOP_ITEMS.filter((item) => item.stock > 0).length;

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
      value: String(inStockCount),
      suffix: "items",
      accent: "primary" as const,
    },
    {
      icon: "redeem",
      label: "Affordable",
      value: String(affordableCount),
      suffix: "now",
      accent: "secondary" as const,
    },
    {
      icon: "category",
      label: "Showing",
      value: String(filteredItems.length),
      suffix: "results",
      accent: "primary" as const,
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-margin py-md md:px-lg md:py-lg">
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
        className="mb-sm grid grid-cols-2 gap-xs sm:mb-md sm:grid-cols-4 sm:gap-sm"
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
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br px-sm py-2.5 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 sm:py-3 ${shade.bg} ${shade.shadow} ${shade.hover} ${shade.border}`}
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
        className="relative mb-sm overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/95 p-sm shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,102,136,0.1)] backdrop-blur-sm sm:mb-md sm:p-md"
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

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2 sm:gap-md xl:grid-cols-3">
          {filteredItems.map((item, index) => (
            <ShopItemCard key={item.id} item={item} index={index} userPoints={userPoints} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-variant/80 bg-surface-container-low/50 px-md py-xl text-center"
        >
          <MaterialSymbol icon="search_off" className="mb-sm text-display-xl text-outline-variant" />
          <p className="text-headline-md font-headline-md uppercase text-on-surface">
            No items found
          </p>
          <p className="mt-1 max-w-sm text-body-md text-on-surface-variant">
            Try a different category or check back later for new rewards.
          </p>
        </motion.div>
      )}
    </div>
  );
}
