"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryCache } from "@/lib/queries/cache";
import { fetchLeaderboard } from "@/lib/queries/leaderboard";
import { queryKeys } from "@/lib/queries/keys";
import { useSession } from "@/hooks/useAuth";

export function useLeaderboard() {
  const supabase = createClient();
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.leaderboard.all,
    queryFn: () => fetchLeaderboard(supabase),
    enabled: !!session,
    ...queryCache.leaderboard,
  });
}
