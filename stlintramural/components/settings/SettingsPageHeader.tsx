"use client";

import { motion } from "framer-motion";

const TITLE_WORDS = ["Account", "Settings"];

export default function SettingsPageHeader() {
  return (
    <div className="relative overflow-hidden border-b border-surface-variant/60 bg-gradient-to-br from-surface-bright via-surface to-surface-container-low/30 px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-tertiary/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/3 top-1/2 h-24 w-24 rounded-full border border-primary/10 bg-primary/[0.03] backdrop-blur-sm"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mb-1 flex flex-wrap gap-x-3 pr-4"
        >
          {TITLE_WORDS.map((word) => (
            <motion.span
              key={word}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="inline-block text-display-xl font-display-xl uppercase text-on-surface slanted-accent"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-body-lg font-body-lg text-on-surface-variant"
        >
          Manage your profile, notifications, privacy, and app preferences.
        </motion.p>
      </div>
    </div>
  );
}
