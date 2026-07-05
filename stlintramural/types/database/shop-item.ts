import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

import type { User } from "./user";

export type ShopItem = Tables<"shop_items">;
export type NewShopItem = TablesInsert<"shop_items">;
export type ShopItemUpdate = TablesUpdate<"shop_items">;

export interface ShopItemWithSeller extends ShopItem {
  seller: Pick<User, "id" | "first_name" | "last_name" | "role">;
}
