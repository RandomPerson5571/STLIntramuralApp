"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { ShopItemDisplay } from "@/types/shop";

interface ShopItemCardProps {
  item: ShopItemDisplay;
  index: number;
  userPoints: number;
}

const ACCENT = {
  primary: {
    card: "border-primary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.14)]",
    hover:
      "hover:shadow-[0_4px_12px_rgba(26,28,31,0.06),0_16px_40px_-8px_rgba(0,48,174,0.2)] hover:border-primary/20",
    glow: "from-primary/[0.07] via-primary/[0.02] to-transparent",
    badge: "bg-primary/[0.08] text-primary ring-primary/10",
    price: "bg-primary/[0.08] text-primary",
    button:
      "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] hover:bg-primary-fixed-variant hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)]",
  },
  secondary: {
    card: "border-secondary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,102,136,0.14)]",
    hover:
      "hover:shadow-[0_4px_12px_rgba(26,28,31,0.06),0_16px_40px_-8px_rgba(0,102,136,0.2)] hover:border-secondary/20",
    glow: "from-secondary/[0.07] via-secondary/[0.02] to-transparent",
    badge: "bg-secondary/[0.08] text-secondary ring-secondary/10",
    price: "bg-secondary/[0.08] text-secondary",
    button:
      "bg-gradient-to-r from-secondary to-secondary-container text-on-secondary shadow-[0_4px_14px_rgba(0,102,136,0.25)] hover:opacity-95 hover:shadow-[0_6px_18px_rgba(0,102,136,0.32)]",
  },
} as const;

function getAccent(index: number) {
  return index % 2 === 0 ? ACCENT.primary : ACCENT.secondary;
}

export default function ShopItemCard({ item, index, userPoints }: ShopItemCardProps) {
  const shade = getAccent(index);
  const isOutOfStock = item.stock === 0;
  const canAfford = userPoints >= item.cost;
  const sellerName = `${item.seller.first_name} ${item.seller.last_name}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group/card relative flex flex-col overflow-hidden rounded-2xl border bg-surface-container-lowest/95 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 ${shade.card} ${shade.hover} ${isOutOfStock ? "opacity-75" : ""}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
        aria-hidden
      />

      <div className="relative h-44 overflow-hidden sm:h-48">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container">
            <MaterialSymbol icon={item.icon} className="text-display-xl text-outline-variant" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 via-transparent to-transparent" />

        {isOutOfStock ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl border border-surface-variant/60 bg-surface-container-lowest/90 px-2.5 py-1 text-label-sm font-label-sm uppercase text-on-surface-variant backdrop-blur-sm">
            <MaterialSymbol icon="block" className="text-sm" />
            Sold Out
          </div>
        ) : item.stock <= 10 ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl bg-secondary px-2.5 py-1 text-label-sm font-label-sm uppercase text-on-secondary shadow-[0_4px_12px_rgba(0,102,136,0.35)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-secondary" />
            Low Stock
          </div>
        ) : null}

        <div
          className={`absolute right-3 top-3 rounded-xl px-2.5 py-1 text-label-sm font-label-sm uppercase backdrop-blur-sm ${shade.price}`}
        >
          {item.cost.toLocaleString()} pts
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-sm sm:p-md">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-label-sm font-label-sm uppercase ring-1 ${shade.badge}`}
          >
            <MaterialSymbol icon={item.icon} className="text-sm" />
            {item.category}
          </span>
          <span className="text-label-sm font-label-sm uppercase text-on-surface-variant">
            {item.stock} left
          </span>
        </div>

        <h3 className="mb-1 text-headline-md font-headline-md uppercase text-on-surface">
          {item.title}
        </h3>

        {item.description && (
          <p className="mb-sm line-clamp-2 flex-1 text-body-md text-on-surface-variant">
            {item.description}
          </p>
        )}

        <div className="mb-sm flex items-center gap-2 text-body-md text-on-surface-variant">
          <MaterialSymbol icon="storefront" className="text-base text-outline" />
          <span className="truncate">{sellerName}</span>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            disabled={isOutOfStock}
            className={`flex-1 rounded-xl py-2 text-label-sm font-label-sm uppercase transition-[transform,opacity,box-shadow,background-color] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
              isOutOfStock
                ? "border-2 border-outline-variant bg-surface-container-low text-on-surface-variant"
                : canAfford
                  ? shade.button
                  : "border-2 border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-secondary hover:text-secondary"
            }`}
          >
            {isOutOfStock ? "Unavailable" : canAfford ? "Redeem" : "Need More Pts"}
          </button>
          <button
            type="button"
            aria-label={`View details for ${item.title}`}
            className="flex items-center justify-center rounded-xl border-2 border-outline-variant px-3 text-on-surface transition-[transform,border-color,color] duration-200 hover:border-primary hover:text-primary active:scale-[0.98]"
          >
            <MaterialSymbol icon="info" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
