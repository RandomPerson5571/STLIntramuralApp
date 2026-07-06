"use client";

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { canManageUsers } from "@/lib/permissions";
import { useSession } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type SupabaseClient = ReturnType<typeof createClient>;

type SupabaseQueryOptions<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryKey" | "queryFn" | "enabled"
> & {
  /** Extra gate merged with session (and admin) checks. Defaults to true. */
  enabled?: boolean;
};

export function useAuthenticatedQuery<TData, TError = Error>(
  queryKey: QueryKey,
  queryFn: (supabase: SupabaseClient) => Promise<TData>,
  options?: SupabaseQueryOptions<TData, TError>,
) {
  const supabase = createClient();
  const { data: session } = useSession();
  const { enabled: extraEnabled = true, ...rest } = options ?? {};

  return useQuery({
    queryKey,
    queryFn: () => queryFn(supabase),
    enabled: !!session && extraEnabled,
    ...rest,
  });
}

export function useAdminQuery<TData, TError = Error>(
  queryKey: QueryKey,
  queryFn: (supabase: SupabaseClient) => Promise<TData>,
  options?: SupabaseQueryOptions<TData, TError>,
) {
  const supabase = createClient();
  const { data: session } = useSession();
  const { data: user } = useCurrentUser();
  const { enabled: extraEnabled = true, ...rest } = options ?? {};

  return useQuery({
    queryKey,
    queryFn: () => queryFn(supabase),
    enabled: !!session && canManageUsers(user) && extraEnabled,
    ...rest,
  });
}
