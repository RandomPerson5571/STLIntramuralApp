"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";

const EASE = [0.22, 1, 0.36, 1] as const;

interface EventDetailNotFoundProps {
  slug: string;
}

export default function EventDetailNotFound({ slug }: EventDetailNotFoundProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-margin py-xl md:px-lg">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative max-w-lg overflow-hidden rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/95 p-lg text-center shadow-[0_8px_32px_rgba(26,28,31,0.06)] backdrop-blur-sm"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-secondary/[0.04]"
          aria-hidden
        />
        <MaterialSymbol
          icon="event_busy"
          className="relative mb-sm text-[clamp(3rem,10vw,4rem)] text-outline"
        />
        <h1 className="relative text-headline-lg font-headline-lg uppercase text-on-surface">
          Event Not Found
        </h1>
        <p className="relative mt-sm text-body-lg text-on-surface-variant">
          No event matches{" "}
          <span className="font-label-sm text-on-surface">{slug}</span>. It may have
          been removed or the link is incorrect.
        </p>
        <Link
          href="/events"
          className="relative mt-md inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)] active:scale-[0.98]"
        >
          <MaterialSymbol icon="arrow_back" className="text-base" />
          Back to Events
        </Link>
      </motion.div>
    </div>
  );
}
