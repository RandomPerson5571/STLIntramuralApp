"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { ScanRecentEntry } from "@/lib/scan-data";

interface ScanRecentListProps {
  entries: ScanRecentEntry[];
  isPending?: boolean;
}

export default function ScanRecentList({ entries, isPending }: ScanRecentListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-surface-variant/50 bg-surface-container-lowest/95 p-md shadow-[0_2px_8px_rgba(26,28,31,0.04)]"
    >
      <div className="mb-sm flex items-center justify-between">
        <div>
          <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
            Activity
          </p>
          <h2 className="text-headline-md font-headline-md uppercase text-on-surface">
            Recent scans
          </h2>
        </div>
        <MaterialSymbol icon="history" className="text-xl text-on-surface-variant" />
      </div>

      <ul className="space-y-2">
        {isPending && entries.length === 0 ? (
          <li className="rounded-xl border border-dashed border-surface-variant/50 px-3 py-6 text-center text-body-sm text-on-surface-variant">
            Loading recent scans…
          </li>
        ) : entries.length === 0 ? (
          <li className="rounded-xl border border-dashed border-surface-variant/50 px-3 py-6 text-center text-body-sm text-on-surface-variant">
            No check-ins yet for this event.
          </li>
        ) : (
          entries.map((entry, index) => (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.18 + index * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-surface-variant/40 bg-surface-container-low/60 px-3 py-2.5 transition-[border-color,background-color] duration-200 hover:border-surface-variant/70 hover:bg-surface-container-low">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  entry.status === "success"
                    ? "bg-secondary/[0.12] text-secondary"
                    : "bg-primary/[0.1] text-primary"
                }`}
              >
                <MaterialSymbol
                  icon={entry.status === "success" ? "check" : "replay"}
                  className="text-base"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-body-md font-body-md text-on-surface">
                  {entry.studentName}
                </p>
                <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                  {entry.time}
                </p>
              </div>

              <div className="text-right">
                {entry.points > 0 ? (
                  <p className="text-label-sm font-label-sm uppercase text-secondary">
                    +{entry.points}
                  </p>
                ) : (
                  <p className="text-label-sm font-label-sm uppercase text-on-surface-variant">
                    Dup
                  </p>
                )}
              </div>
            </div>
          </motion.li>
          ))
        )}
      </ul>
    </motion.section>
  );
}
