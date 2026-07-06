"use client";

import { useState } from "react";
import {
  getCreateEventErrorMessage,
  useCreateEvent,
} from "@/hooks/useCreateEvent";
import {
  DEFAULT_CREATE_EVENT_DRAFT,
  type CreateEventDraft,
} from "@/lib/event-create-data";

export function useCreateEventPanel() {
  const createEvent = useCreateEvent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CreateEventDraft>(DEFAULT_CREATE_EVENT_DRAFT);

  const handleOpen = () => {
    createEvent.reset();
    setOpen(true);
  };

  const handleClose = () => {
    if (createEvent.isPending) return;
    setOpen(false);
  };

  const handleDraftChange = (updates: Partial<CreateEventDraft>) => {
    setDraft((current) => ({ ...current, ...updates }));
  };

  const handleReset = () => setDraft(DEFAULT_CREATE_EVENT_DRAFT);

  const handleSubmit = async () => {
    try {
      await createEvent.mutateAsync(draft);
      setDraft(DEFAULT_CREATE_EVENT_DRAFT);
      setOpen(false);
    } catch {
      // Error surfaces via createEvent.error.
    }
  };

  return {
    open,
    handleOpen,
    handleClose,
    panelProps: {
      open,
      onClose: handleClose,
      draft,
      onDraftChange: handleDraftChange,
      onReset: handleReset,
      onSubmit: () => void handleSubmit(),
      isSubmitting: createEvent.isPending,
      submitError: getCreateEventErrorMessage(createEvent.error),
    },
  };
}
