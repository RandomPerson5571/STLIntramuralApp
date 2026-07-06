"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateAfterCheckIn } from "@/lib/queries/cache";
import {
  recordEventCheckIn,
  type CheckInResult,
} from "@/lib/queries/scan";
import { queryKeys } from "@/lib/queries/keys";

export function useScanCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordEventCheckIn,
    onSuccess: (_result, variables) => {
      void invalidateAfterCheckIn(queryClient);
      void queryClient.invalidateQueries({ queryKey: queryKeys.scan.events });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.scan.recent(variables.eventId),
      });
    },
  });
}

export type { CheckInResult };
