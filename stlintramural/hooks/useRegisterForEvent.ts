"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  EventRegistrationError,
  registerForEvent,
} from "@/lib/queries/events";
import { invalidateAfterRegistration } from "@/lib/queries/cache";
import { getMutationErrorMessage } from "@/lib/mutation-errors";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function useRegisterForEvent() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) {
        throw new Error("You must be signed in to register.");
      }

      return registerForEvent(supabase, {
        userId: user.id,
        eventId,
      });
    },
    onSuccess: () => invalidateAfterRegistration(queryClient),
  });
}

export function getRegistrationErrorMessage(error: unknown): string | null {
  return getMutationErrorMessage(error, {
    DomainError: EventRegistrationError,
    fallback: "Registration failed. Please try again.",
    mapDomainError: (error) =>
      error.code === "already_registered" ? "Already registered" : null,
  });
}
