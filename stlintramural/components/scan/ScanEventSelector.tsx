"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { ScanEventOption } from "@/lib/scan-data";

interface ScanEventSelectorProps {
  events: ScanEventOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ScanEventSelector({
  events,
  selectedId,
  onSelect,
}: ScanEventSelectorProps) {
  const selected = events.find((event) => event.id === selectedId) ?? events[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-surface-variant/50 bg-surface-container-lowest/95 p-md shadow-[0_2px_8px_rgba(26,28,31,0.04)]"
    >
      <div className="mb-sm flex items-center justify-between gap-2">
        <div>
          <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
            Active event
          </p>
          <h2 className="text-headline-md font-headline-md uppercase text-on-surface">
            Select session
          </h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.1] text-primary">
          <MaterialSymbol icon="event" className="text-xl" filled />
        </div>
      </div>

      <label htmlFor="scan-event-select" className="sr-only">
        Select event to scan for
      </label>
      <div className="relative">
        <select
          id="scan-event-select"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none rounded-xl border border-surface-variant/70 bg-surface-container-low px-4 py-3 pr-12 text-body-md text-on-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[border-color,box-shadow] duration-200 focus:border-secondary/40 focus:outline-none focus:ring-2 focus:ring-secondary/20"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
        <MaterialSymbol
          icon="expand_more"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
      </div>

      {selected && (
        <div className="mt-sm space-y-2 rounded-xl border border-surface-variant/40 bg-surface-container-low/70 p-sm">
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <MaterialSymbol icon="sports_basketball" className="text-base text-secondary" />
            {selected.sport} · {selected.dateTime}
          </div>
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <MaterialSymbol icon="location_on" className="text-base text-primary" />
            {selected.location}
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/[0.1] px-2.5 py-1 text-label-sm font-label-sm uppercase text-secondary">
              <MaterialSymbol icon="stars" className="text-sm" filled />
              {selected.pointsAwarded} pts / scan
            </span>
            <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
              {selected.checkedIn}/{selected.registered} in
            </span>
          </div>
        </div>
      )}
    </motion.section>
  );
}
