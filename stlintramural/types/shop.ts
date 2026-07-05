import type { ShopItemWithSeller } from "./database";

export type ShopCategory =
  | "All Items"
  | "Apparel"
  | "Accessories"
  | "Experiences"
  | "Food & Drink";

export type ShopSortOption = "featured" | "price-asc" | "price-desc" | "newest";

/** UI-facing shop item — extends the database shape with display-only fields. */
export interface ShopItemDisplay extends ShopItemWithSeller {
  icon: string;
  imageUrl?: string;
  category: Exclude<ShopCategory, "All Items">;
}
