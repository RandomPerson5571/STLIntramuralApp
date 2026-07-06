"use client";

import { motion } from "framer-motion";
import CreateEventPanel from "@/components/events/CreateEventPanel";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { useCreateEventPanel } from "@/hooks/useCreateEventPanel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { canCreateEvents } from "@/lib/permissions";

export default function AdminCreateEventTrigger() {
  const { data: user, isPending } = useCurrentUser();
  const { handleOpen, panelProps } = useCreateEventPanel();

  if (isPending || !canCreateEvents(user)) {
    return null;
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={handleOpen}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-surface-container-lowest to-secondary/[0.06] px-4 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-primary shadow-[0_2px_12px_rgba(0,48,174,0.12)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_6px_24px_rgba(0,48,174,0.2)] active:scale-[0.98] motion-reduce:transform-none"
      >
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          aria-hidden
        />
        <MaterialSymbol
          icon="add_circle"
          className="text-base transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none"
        />
        Create Event
      </motion.button>

      <CreateEventPanel {...panelProps} />
    </>
  );
}
