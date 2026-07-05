"use client";

import { motion } from "framer-motion";

export default function LeaderboardPageHeader() {
  return (
    <div className="relative overflow-hidden border-b border-surface-variant/60 bg-gradient-to-br from-surface-bright via-surface to-surface-container-low/30 px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-secondary/[0.05] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/3 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-primary-container/[0.08] blur-2xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 text-label-sm font-label-sm uppercase tracking-[0.2em] text-secondary"
        >
          Season Rankings
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-1 inline-block pr-4 text-[clamp(2.75rem,8vw,4.5rem)] font-display-xl uppercase leading-none tracking-tight text-on-surface slanted-accent"
        >
          Leaderboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-body-lg font-body-lg text-on-surface-variant"
        >
          Compete for the top spot. Earn points through check-ins, wins, and
          event participation.
        </motion.p>
      </div>
    </div>
  );
}
