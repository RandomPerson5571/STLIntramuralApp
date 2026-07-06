import type { SupabaseClient } from "@supabase/supabase-js";

import { mapShopItemToDisplay, shopItemIcon } from "@/lib/mappers/shop";
import {
  buildShopItemDescription,
  type ShopItemDraft,
} from "@/lib/shop-create-data";
import { throwIfError } from "@/lib/queries/utils";
import type { ShopItemWithSeller } from "@/types/database";
import type { ShopItemDisplay as ShopPageItem } from "@/types/shop";

export class ShopItemCreateError extends Error {
  constructor(
    message: string,
    public readonly code: "missing_title" | "invalid_cost" | "invalid_stock" | "unknown",
  ) {
    super(message);
    this.name = "ShopItemCreateError";
  }
}

export interface ShopItemSummary {
  id: string;
  name: string;
  pointsCost: number;
  icon: string;
}

const SHOP_ITEM_COLUMNS = "id, title, cost, stock, created_at" as const;
const SHOP_ITEM_WITH_SELLER =
  "*, seller:users!seller_id(id, first_name, last_name, role)" as const;

function mapFeaturedShopItem(row: {
  id: string;
  title: string;
  cost: number;
}): ShopItemSummary {
  return {
    id: row.id,
    name: row.title,
    pointsCost: row.cost,
    icon: shopItemIcon(row.title),
  };
}

export async function fetchShopItems(
  supabase: SupabaseClient,
): Promise<ShopPageItem[]> {
  const { data, error } = await supabase
    .from("shop_items")
    .select(SHOP_ITEM_WITH_SELLER)
    .order("created_at", { ascending: false });

  throwIfError(error);

  return (data ?? []).map((row) =>
    mapShopItemToDisplay(row as ShopItemWithSeller),
  );
}

export async function fetchFeaturedShopItems(
  supabase: SupabaseClient,
): Promise<ShopItemSummary[]> {
  const { data, error } = await supabase
    .from("shop_items")
    .select(SHOP_ITEM_COLUMNS)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(2);

  throwIfError(error);

  return (data ?? []).map(mapFeaturedShopItem);
}

export async function fetchCheapestShopItemCost(
  supabase: SupabaseClient,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("shop_items")
    .select("cost")
    .gt("stock", 0)
    .order("cost", { ascending: true })
    .limit(1)
    .maybeSingle();

  throwIfError(error);

  return data?.cost ?? null;
}

export async function createShopItem(
  supabase: SupabaseClient,
  input: { sellerId: string; draft: ShopItemDraft },
): Promise<string> {
  const title = input.draft.title.trim();
  if (!title) {
    throw new ShopItemCreateError("Item title is required.", "missing_title");
  }

  if (!Number.isFinite(input.draft.cost) || input.draft.cost <= 0) {
    throw new ShopItemCreateError(
      "Point cost must be greater than zero.",
      "invalid_cost",
    );
  }

  if (!Number.isFinite(input.draft.stock) || input.draft.stock < 0) {
    throw new ShopItemCreateError(
      "Stock cannot be negative.",
      "invalid_stock",
    );
  }

  const { data, error } = await supabase
    .from("shop_items")
    .insert({
      seller_id: input.sellerId,
      title,
      description: buildShopItemDescription(input.draft),
      cost: input.draft.cost,
      stock: input.draft.stock,
    })
    .select("id")
    .single();

  throwIfError(error);

  if (!data) {
    throw new Error("Expected shop item row after insert");
  }

  return data.id;
}
