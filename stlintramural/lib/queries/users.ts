import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@/types/database";

const CURRENT_USER_COLUMNS =
  "id, auth_id, first_name, last_name, role, points_balance, qr_code_token, created_at" as const;

export async function fetchCurrentUser(
  supabase: SupabaseClient,
): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select(CURRENT_USER_COLUMNS)
    .eq("auth_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
