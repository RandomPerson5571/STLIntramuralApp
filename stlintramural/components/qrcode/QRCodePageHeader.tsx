"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import MaterialSymbol from "@/components/events/MaterialSymbol";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function QRCodePageHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden border-b border-surface-variant/60 bg-gradient-to-br from-surface-bright via-surface to-surface-container-low/30 px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-secondary/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.nav
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="mb-md"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl border border-surface-variant/50 bg-surface-container-lowest/80 px-3 py-2 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant shadow-[0_2px_8px_rgba(26,28,31,0.04)] backdrop-blur-sm transition-[transform,color,background-color,box-shadow] duration-200 hover:border-primary/20 hover:bg-surface-container-lowest hover:text-primary hover:shadow-[0_4px_14px_rgba(0,48,174,0.1)] active:scale-[0.98]"
          >
            <MaterialSymbol
              icon="arrow_back"
              className="text-base transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Dashboard
          </Link>
        </motion.nav>

        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mb-1 pr-4 text-display-xl font-display-xl uppercase text-on-surface slanted-accent"
        >
          My Check-In Code
        </motion.h1>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="max-w-2xl text-body-lg font-body-lg text-on-surface-variant"
        >
          Show this code at event check-in. Staff scan it to record your attendance
          and award points.
        </motion.p>
      </div>
    </div>
  );
}
