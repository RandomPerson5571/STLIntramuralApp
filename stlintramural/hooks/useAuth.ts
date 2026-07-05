"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";
import {
  getSession,
  resetPassword,
  signIn,
  signOut,
  signUp,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "@/lib/queries/auth";
import { invalidateSessionAndUser, queryCache } from "@/lib/queries/cache";
import { queryKeys } from "@/lib/queries/keys";

function useSupabase() {
  return createClient();
}

export function useSession() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => getSession(supabase),
    ...queryCache.session,
  });
}

export function useSignIn() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignInInput) => signIn(supabase, input),
    onSuccess: () => invalidateSessionAndUser(queryClient),
  });
}

export function useSignUp() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignUpInput) => signUp(supabase, input),
    onSuccess: (data) => {
      if (data.session) {
        return invalidateSessionAndUser(queryClient);
      }
    },
  });
}

export function useSignOut() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOut(supabase),
    onSuccess: () => invalidateSessionAndUser(queryClient),
  });
}

export function useResetPassword() {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(supabase, input),
  });
}

export function useAuthErrorMessage(error: unknown) {
  return error ? getAuthErrorMessage(error) : null;
}
