"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { invalidateAfterAdminUserChange } from "@/lib/queries/cache";
import {
  adjustAdminUserPoints,
  deleteAdminUser,
  type AdminUserUpdateInput,
  updateAdminUser,
} from "@/lib/queries/admin";
import { canManageUsers } from "@/lib/permissions";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function assertAdmin(user: ReturnType<typeof useCurrentUser>["data"]) {
  if (!canManageUsers(user)) {
    throw new Error("Only admins can manage users.");
  }
}

export function useUpdateAdminUser() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async ({
      userId,
      input,
    }: {
      userId: string;
      input: AdminUserUpdateInput;
    }) => {
      assertAdmin(user);
      return updateAdminUser(supabase, userId, input);
    },
    onSuccess: (_data, { userId }) =>
      invalidateAfterAdminUserChange(queryClient, userId),
  });
}

export function useDeleteAdminUser() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (userId: string) => {
      assertAdmin(user);
      return deleteAdminUser(supabase, userId);
    },
    onSuccess: () => invalidateAfterAdminUserChange(queryClient),
  });
}

export function useAdjustAdminUserPoints() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async ({
      userId,
      delta,
      description,
    }: {
      userId: string;
      delta: number;
      description: string;
    }) => {
      assertAdmin(user);
      return adjustAdminUserPoints(supabase, userId, delta, description);
    },
    onSuccess: (_data, { userId }) =>
      invalidateAfterAdminUserChange(queryClient, userId),
  });
}
