"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ShopItemDraft } from "@/lib/shop-create-data";
import {
  createShopItem,
  ShopItemCreateError,
} from "@/lib/queries/shop";
import { invalidateAfterShopItemCreate } from "@/lib/queries/cache";
import { getMutationErrorMessage } from "@/lib/mutation-errors";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function useCreateShopItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (draft: ShopItemDraft) => {
      if (!user) {
        throw new Error("You must be signed in to create a shop item.");
      }

      return createShopItem(supabase, {
        sellerId: user.id,
        draft,
      });
    },
    onSuccess: () => invalidateAfterShopItemCreate(queryClient),
  });
}

export function getCreateShopItemErrorMessage(error: unknown): string | null {
  return getMutationErrorMessage(error, {
    DomainError: ShopItemCreateError,
    fallback: "Could not create shop item. Please try again.",
  });
}
