import type { SupabaseClient } from "@supabase/supabase-js";
import { throwIfError } from "@/lib/queries/utils";
import type { User } from "@/types/database";

const CURRENT_USER_COLUMNS =
  "id, auth_id, first_name, last_name, role, is_admin, points_balance, qr_code_token, created_at, graduation_year" as const;

export async function fetchCurrentUser(
  supabase: SupabaseClient,
): Promise<User | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  throwIfError(sessionError);

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select(CURRENT_USER_COLUMNS)
    .eq("auth_id", user.id)
    .maybeSingle();

  throwIfError(error);

  return data;
}
