"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import PageHeader from "@/components/layout/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

const adminEyebrow = (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.45, ease: EASE }}
    className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 backdrop-blur-sm"
  >
    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
    <span className="text-label-sm font-label-sm uppercase tracking-widest text-primary">
      Admin access
    </span>
  </motion.div>
);

const adminActions = (
  <motion.div
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
    className="flex shrink-0 items-center gap-2 rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/80 px-4 py-3 backdrop-blur-sm"
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
      <MaterialSymbol icon="shield_person" className="text-lg" />
    </span>
    <div>
      <p className="text-label-sm font-label-sm uppercase tracking-wide text-outline">
        Status
      </p>
      <p className="text-body-md font-body-md text-on-surface">UI preview</p>
    </div>
  </motion.div>
);

export default function AdminPageHeader() {
  return (
    <PageHeader
      eyebrow={adminEyebrow}
      title={["Admin", "Console"]}
      subtitle="Platform controls for events, users, rewards, and points. Backend integrations are coming next."
      actions={adminActions}
    />
  );
}
