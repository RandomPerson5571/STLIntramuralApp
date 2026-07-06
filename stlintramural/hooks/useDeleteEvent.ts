"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { invalidateAfterEventDelete } from "@/lib/queries/cache";
import { deleteEvent } from "@/lib/queries/events";
import { canManageUsers } from "@/lib/permissions";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function useDeleteEvent() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!canManageUsers(user)) {
        throw new Error("Only admins can delete events.");
      }

      return deleteEvent(supabase, eventId);
    },
    onSuccess: () => invalidateAfterEventDelete(queryClient),
  });
}
