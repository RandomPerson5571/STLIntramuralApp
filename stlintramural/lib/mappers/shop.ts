import { parseShopItemDescription } from "@/lib/shop-create-data";
import type { ShopItemWithSeller } from "@/types/database";
import type { ShopCategory, ShopItemDisplay } from "@/types/shop";

const IMAGE_URL_PATTERN = /\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i;

export function shopItemIcon(title: string): string {
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
  if (t.includes("smoothie") || t.includes("cafe") || t.includes("bar")) {
    return "local_cafe";
  }
  if (t.includes("pass") || t.includes("registration") || t.includes("vip")) {
    return "confirmation_number";
  }
  return "redeem";
}

function inferCategory(title: string, description: string | null): ShopItemDisplay["category"] {
  const text = `${title} ${description ?? ""}`.toLowerCase();

  if (
    text.includes("hoodie") ||
    text.includes("shirt") ||
    text.includes("jersey") ||
    text.includes("cap") ||
    text.includes("snapback")
  ) {
    return "Apparel";
  }
  if (
    text.includes("water") ||
    text.includes("bottle") ||
    text.includes("bag") ||
    text.includes("backpack") ||
    text.includes("towel")
  ) {
    return "Accessories";
  }
  if (
    text.includes("pass") ||
    text.includes("registration") ||
    text.includes("vip") ||
    text.includes("courtside")
  ) {
    return "Experiences";
  }
  if (
    text.includes("smoothie") ||
    text.includes("bar") ||
    text.includes("food") ||
    text.includes("drink") ||
    text.includes("energy")
  ) {
    return "Food & Drink";
  }

  return "Accessories";
}

function getImageUrl(description: string | null): string | undefined {
  if (!description) return undefined;

  const match = description.match(/https?:\/\/\S+/i);
  if (!match) return undefined;

  const url = match[0].replace(/[)\]},.]+$/, "");
  return IMAGE_URL_PATTERN.test(url) ? url : undefined;
}

export function mapShopItemToDisplay(row: ShopItemWithSeller): ShopItemDisplay {
  const parsed = parseShopItemDescription(row.description);

  return {
    ...row,
    icon: parsed.icon ?? shopItemIcon(row.title),
    category:
      parsed.category ?? inferCategory(row.title, parsed.body || row.description),
    imageUrl: getImageUrl(parsed.body || row.description),
  };
}
