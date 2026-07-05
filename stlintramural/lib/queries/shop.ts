import type { SupabaseClient } from "@supabase/supabase-js";

export interface ShopItemDisplay {
  id: string;
  name: string;
  pointsCost: number;
  icon: string;
}

const SHOP_ITEM_COLUMNS = "id, title, cost, stock, created_at" as const;

function shopItemIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("hoodie") || t.includes("shirt") || t.includes("jersey")) {
    return "checkroom";
  }
  if (t.includes("water") || t.includes("bottle")) {
    return "water_drop";
  }
  if (t.includes("hat") || t.includes("cap")) {
    return "styler";
  }
  if (t.includes("bag") || t.includes("backpack")) {
    return "backpack";
  }
  return "redeem";
}

function mapShopItem(row: {
  id: string;
  title: string;
  cost: number;
}): ShopItemDisplay {
  return {
    id: row.id,
    name: row.title,
    pointsCost: row.cost,
    icon: shopItemIcon(row.title),
  };
}

export async function fetchFeaturedShopItems(
  supabase: SupabaseClient,
): Promise<ShopItemDisplay[]> {
  const { data, error } = await supabase
    .from("shop_items")
    .select(SHOP_ITEM_COLUMNS)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(2);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapShopItem);
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

  if (error) {
    throw error;
  }

  return data?.cost ?? null;
}
