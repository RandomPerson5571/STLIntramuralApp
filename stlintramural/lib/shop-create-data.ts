import {
  isShopItemCategory,
  type ShopItemCategory,
  type ShopItemDraft,
} from "@/types/shop";

export type { ShopItemDraft } from "@/types/shop";

export const EMPTY_SHOP_ITEM_DRAFT: ShopItemDraft = {
  title: "",
  description: "",
  cost: 100,
  stock: 10,
  category: "Accessories",
  icon: "redeem",
  imageUrl: "",
};

const SHOP_META_PREFIX = "<!-- stl-shop-meta:";
const SHOP_META_SUFFIX = " -->";

export function buildShopItemDescription(draft: ShopItemDraft): string | null {
  const parts: string[] = [];
  const meta = JSON.stringify({ category: draft.category, icon: draft.icon });
  parts.push(`${SHOP_META_PREFIX}${meta}${SHOP_META_SUFFIX}`);

  const description = draft.description.trim();
  if (description) {
    parts.push(description);
  }

  const imageUrl = draft.imageUrl.trim();
  if (imageUrl && !description.includes(imageUrl)) {
    parts.push(imageUrl);
  }

  return parts.join("\n\n");
}

export function parseShopItemDescription(description: string | null): {
  category?: ShopItemCategory;
  icon?: string;
  body: string;
} {
  if (!description) {
    return { body: "" };
  }

  if (!description.startsWith(SHOP_META_PREFIX)) {
    return { body: description };
  }

  const metaEnd = description.indexOf(SHOP_META_SUFFIX);
  if (metaEnd === -1) {
    return { body: description };
  }

  const metaJson = description.slice(
    SHOP_META_PREFIX.length,
    metaEnd,
  );

  let category: ShopItemCategory | undefined;
  let icon: string | undefined;

  try {
    const meta = JSON.parse(metaJson) as {
      category?: string;
      icon?: string;
    };

    if (meta.category && isShopItemCategory(meta.category)) {
      category = meta.category;
    }

    if (typeof meta.icon === "string" && meta.icon.trim()) {
      icon = meta.icon.trim();
    }
  } catch {
    return { body: description };
  }

  const body = description.slice(metaEnd + SHOP_META_SUFFIX.length).trim();
  return { category, icon, body };
}
