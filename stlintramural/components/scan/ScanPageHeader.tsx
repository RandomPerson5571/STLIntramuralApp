"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import MaterialSymbol from "@/components/events/MaterialSymbol";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ScanPageHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden border-b border-surface-variant/60 bg-gradient-to-br from-surface-bright via-surface to-surface-container-low/30 px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/[0.08] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-primary/[0.06] blur-3xl"
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
            className="group inline-flex items-center gap-2 rounded-xl border border-surface-variant/50 bg-surface-container-lowest/80 px-3 py-2 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant shadow-[0_2px_8px_rgba(26,28,31,0.04)] backdrop-blur-sm transition-[transform,color,background-color,box-shadow] duration-200 hover:border-secondary/25 hover:bg-surface-container-lowest hover:text-secondary hover:shadow-[0_4px_14px_rgba(0,102,136,0.12)] active:scale-[0.98]"
          >
            <MaterialSymbol
              icon="arrow_back"
              className="text-base transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Dashboard
          </Link>
        </motion.nav>

        <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mb-2 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/[0.08] px-3 py-1 text-label-sm font-label-sm uppercase tracking-widest text-secondary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
              </span>
              Staff scanner
            </motion.p>

            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="mb-1 pr-4 text-display-xl font-display-xl uppercase text-on-surface slanted-accent"
            >
              Check-In Scanner
            </motion.h1>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="max-w-2xl text-body-lg font-body-lg text-on-surface-variant"
            >
              Scan student QR codes at the door. Select your event, aim the camera,
              and confirm each check-in in real time.
            </motion.p>
          </div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="flex shrink-0 items-center gap-3 rounded-2xl border border-surface-variant/50 bg-surface-container-lowest/90 px-4 py-3 shadow-[0_2px_12px_rgba(26,28,31,0.05)] backdrop-blur-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/[0.12] text-secondary">
              <MaterialSymbol icon="qr_code_scanner" className="text-2xl" />
            </div>
            <div>
              <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                Session
              </p>
              <p className="text-headline-md font-headline-md uppercase text-on-surface">
                Live
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
