"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { EventCreateError } from "@/lib/event-create-data";
import type { CreateEventDraft } from "@/lib/event-create-data";
import { createEvent } from "@/lib/queries/events";
import { invalidateAfterEventCreate } from "@/lib/queries/cache";
import { getMutationErrorMessage } from "@/lib/mutation-errors";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function useCreateEvent() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (draft: CreateEventDraft) => {
      if (!user) {
        throw new Error("You must be signed in to create an event.");
      }

      return createEvent(supabase, {
        hostId: user.id,
        draft,
      });
    },
    onSuccess: () => invalidateAfterEventCreate(queryClient),
  });
}

export function getCreateEventErrorMessage(error: unknown): string | null {
  return getMutationErrorMessage(error, {
    DomainError: EventCreateError,
    fallback: "Could not create event. Please try again.",
  });
}
