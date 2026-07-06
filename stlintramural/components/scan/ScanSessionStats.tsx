"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { ScanEventOption } from "@/lib/scan-data";

interface ScanSessionStatsProps {
  event: ScanEventOption;
}

export default function ScanSessionStats({ event }: ScanSessionStatsProps) {
  const progress =
    event.registered > 0
      ? Math.round((event.checkedIn / event.registered) * 100)
      : 0;

  const stats = [
    {
      label: "Checked in",
      value: String(event.checkedIn),
      icon: "how_to_reg",
      accent: "secondary" as const,
    },
    {
      label: "Registered",
      value: String(event.registered),
      icon: "groups",
      accent: "primary" as const,
    },
    {
      label: "Remaining",
      value: String(Math.max(event.registered - event.checkedIn, 0)),
      icon: "pending",
      accent: "primary" as const,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-surface-variant/50 bg-surface-container-lowest/95 p-md shadow-[0_2px_8px_rgba(26,28,31,0.04)]"
    >
      <div className="mb-sm flex items-center justify-between">
        <h2 className="text-headline-md font-headline-md uppercase text-on-surface">
          Session stats
        </h2>
        <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
          {progress}% filled
        </span>
      </div>

      <div className="mb-sm h-2 overflow-hidden rounded-full bg-surface-container-high">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-container"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.15 + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`rounded-xl border px-3 py-2.5 ${
              stat.accent === "secondary"
                ? "border-secondary/15 bg-secondary/[0.06]"
                : "border-primary/10 bg-primary/[0.05]"
            }`}
          >
            <div className="mb-1 flex items-center gap-1.5 text-on-surface-variant">
              <MaterialSymbol
                icon={stat.icon}
                className={`text-sm ${stat.accent === "secondary" ? "text-secondary" : "text-primary"}`}
              />
              <span className="text-label-sm font-label-sm uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="text-headline-md font-headline-md uppercase leading-none text-on-surface">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
