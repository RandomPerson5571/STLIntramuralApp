"use client";

import { motion } from "framer-motion";

export default function DashboardPageHeader() {
  return (
    <div className="relative overflow-hidden border-b border-surface-variant/60 bg-gradient-to-br from-surface-bright via-surface to-surface-container-low/30 px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-secondary/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-1 inline-block pr-4 text-display-xl font-display-xl uppercase text-on-surface slanted-accent"
        >
          Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl"
        >
          Your hub for points, check-ins, and upcoming games.
        </motion.p>
      </div>
    </div>
  );
}
