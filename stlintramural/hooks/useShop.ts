"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryCache } from "@/lib/queries/cache";
import { fetchShopItems } from "@/lib/queries/shop";
import { queryKeys } from "@/lib/queries/keys";
import { useSession } from "@/hooks/useAuth";

export function useShopItems() {
  const supabase = createClient();
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.shop.items,
    queryFn: () => fetchShopItems(supabase),
    enabled: !!session,
    ...queryCache.shop,
  });
}
