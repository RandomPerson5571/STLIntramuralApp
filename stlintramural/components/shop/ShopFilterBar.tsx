"use client";

import SortSelect from "@/components/ui/SortSelect";
import { FilterPill, FilterPillGroup } from "@/components/ui/FilterPill";
import { SHOP_CATEGORIES, type ShopCategory, type ShopSortOption } from "@/types/shop";

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
      <FilterPillGroup className="-mx-1 px-1">
        {SHOP_CATEGORIES.map((category) => (
          <FilterPill
            key={category}
            active={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </FilterPill>
        ))}
      </FilterPillGroup>

      <SortSelect
        value={sortOption}
        onChange={onSortChange}
        options={SORT_OPTIONS}
        ariaLabel="Sort shop items"
        fullWidth
      />
    </div>
  );
}
