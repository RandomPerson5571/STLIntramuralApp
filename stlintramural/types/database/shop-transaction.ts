import type { Tables, TablesInsert } from "@/types/database.types";

import type { ShopItem } from "./shop-item";

export type ShopTransaction = Tables<"shop_transactions">;
export type NewShopTransaction = TablesInsert<"shop_transactions">;

export interface ShopTransactionWithItem extends ShopTransaction {
  shop_item: Pick<ShopItem, "id" | "title" | "cost"> | null;
}
