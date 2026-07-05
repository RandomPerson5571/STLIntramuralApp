"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { ShopCategory, ShopSortOption } from "@/types/shop";

const CATEGORIES: ShopCategory[] = [
  "All Items",
  "Apparel",
  "Accessories",
  "Experiences",
  "Food & Drink",
];

const SORT_OPTIONS: { value: ShopSortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

interface ShopFilterBarProps {
  activeCategory: ShopCategory;
  onCategoryChange: (category: ShopCategory) => void;
  sortOption: ShopSortOption;
  onSortChange: (sort: ShopSortOption) => void;
}

export default function ShopFilterBar({
  activeCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
}: ShopFilterBarProps) {
  return (
    <div className="flex flex-col gap-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`shrink-0 rounded-xl px-3 py-2 text-label-sm font-label-sm uppercase transition-[transform,background-color,color,box-shadow] duration-200 active:scale-[0.98] ${
                isActive
                  ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
                  : "border border-surface-variant/70 bg-surface-container-lowest/80 text-on-surface-variant hover:border-primary/20 hover:text-on-surface"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="relative shrink-0">
        <MaterialSymbol
          icon="sort"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as ShopSortOption)}
          aria-label="Sort shop items"
          className="w-full appearance-none rounded-xl border border-surface-variant/70 bg-surface-container-lowest/80 py-2 pl-10 pr-8 text-label-sm font-label-sm uppercase text-on-surface transition-[border-color,box-shadow] duration-200 hover:border-secondary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 lg:w-auto"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <MaterialSymbol
          icon="expand_more"
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
      </div>
    </div>
  );
}
