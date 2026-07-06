import type { ShopItemWithSeller } from "./database";

export const SHOP_ITEM_CATEGORIES = [
  "Apparel",
  "Accessories",
  "Experiences",
  "Food & Drink",
] as const;

export type ShopItemCategory = (typeof SHOP_ITEM_CATEGORIES)[number];

export type ShopCategory = "All Items" | ShopItemCategory;

export const SHOP_CATEGORIES: ShopCategory[] = [
  "All Items",
  ...SHOP_ITEM_CATEGORIES,
];

export type ShopSortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface ShopItemDraft {
  title: string;
  description: string;
  cost: number;
  stock: number;
  category: ShopItemCategory;
  icon: string;
  imageUrl: string;
}

/** UI-facing shop item — extends the database shape with display-only fields. */
export interface ShopItemDisplay extends ShopItemWithSeller {
  icon: string;
  imageUrl?: string;
  category: ShopItemCategory;
}

export function isShopItemCategory(value: string): value is ShopItemCategory {
  return (SHOP_ITEM_CATEGORIES as readonly string[]).includes(value);
}
