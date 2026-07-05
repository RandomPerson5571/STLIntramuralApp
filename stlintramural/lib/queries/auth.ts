import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";
import {
  parseYcdsbSignupEmail,
  type YcdsbSignupRole,
} from "@/lib/ycdsb-email";

export { getAuthErrorMessage } from "@/lib/auth-errors";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  role: YcdsbSignupRole;
}

export interface ResetPasswordInput {
  email: string;
  redirectTo: string;
}

export async function getSession(
  supabase: SupabaseClient,
): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function signIn(
  supabase: SupabaseClient,
  { email, password }: SignInInput,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUp(
  supabase: SupabaseClient,
  { email, password, role }: SignUpInput,
) {
  const parsedEmail = parseYcdsbSignupEmail(email, role);

  if (!parsedEmail.success) {
    throw new Error(parsedEmail.error);
  }

  const { firstName, lastName } = parsedEmail.data;

  const userMetadata =
    parsedEmail.data.role === "admin"
      ? {
          first_name: firstName,
          last_name: lastName,
          role: "admin" as const,
        }
      : {
          first_name: firstName,
          last_name: lastName,
          role: "student" as const,
          graduation_year: parsedEmail.data.graduationYear,
          grade: parsedEmail.data.grade,
        };

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: userMetadata,
      emailRedirectTo: getAuthCallbackUrl("/dashboard"),
    },
  });

  if (error) {
    throw error;
  }

  if (data.user?.identities?.length === 0) {
    throw new Error("User already registered");
  }

  return data;
}

export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function resetPassword(
  supabase: SupabaseClient,
  { email, redirectTo }: ResetPasswordInput,
) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
}
