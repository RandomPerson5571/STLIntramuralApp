"use client";

import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/hooks/useAuth";
import { queryCache } from "@/lib/queries/cache";
import { queryKeys } from "@/lib/queries/keys";
import { fetchQrCodePayload } from "@/lib/queries/qrcode";

export function useQrCodePayload() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.users.qrPayload,
    queryFn: fetchQrCodePayload,
    enabled: !!session,
    ...queryCache.currentUser,
  });
}
