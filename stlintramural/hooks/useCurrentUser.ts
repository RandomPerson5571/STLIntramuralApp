"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryCache } from "@/lib/queries/cache";
import { fetchCurrentUser } from "@/lib/queries/users";
import { queryKeys } from "@/lib/queries/keys";
import { useSession } from "@/hooks/useAuth";

export function useCurrentUser() {
  const supabase = createClient();
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: () => fetchCurrentUser(supabase),
    enabled: !!session,
    ...queryCache.currentUser,
  });
}
