"use client";

import { motion, useReducedMotion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { EventDetail } from "@/types/event-detail";

const EASE = [0.22, 1, 0.36, 1] as const;

const SHADE = {
  primary: {
    badge: "bg-primary/[0.08] text-primary ring-primary/10",
    dot: "bg-primary",
    glow: "from-primary/20 via-primary/5 to-transparent",
  },
  secondary: {
    badge: "bg-secondary/[0.08] text-secondary ring-secondary/10",
    dot: "bg-secondary",
    glow: "from-secondary/20 via-secondary/5 to-transparent",
  },
} as const;

interface EventDetailHeroProps {
  event: EventDetail;
}

export default function EventDetailHero({ event }: EventDetailHeroProps) {
  const reducedMotion = useReducedMotion();
  const shade = SHADE[event.accentColor];
  const words = event.title.split(" ");

  return (
    <section className="relative overflow-hidden border-b border-surface-variant/60 bg-gradient-to-br from-surface-bright via-surface to-surface-container-low/30">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
        aria-hidden
      />

      <div className="relative flex flex-col justify-end px-margin pb-lg pt-32 md:px-lg md:pb-xl">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="mb-sm flex flex-wrap items-center gap-2"
          >
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-label-sm font-label-sm uppercase ring-1 ${shade.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${shade.dot}`} />
              {event.sport}
            </span>
            {event.format ? (
              <span className="rounded-lg border border-surface-variant/60 bg-surface-container-lowest/90 px-2.5 py-1 text-label-sm font-label-sm uppercase text-on-surface-variant">
                {event.format}
              </span>
            ) : null}
            {event.status === "registration-open" ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-label-sm font-label-sm uppercase text-on-secondary shadow-[0_4px_12px_rgba(0,102,136,0.35)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-secondary" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-surface-variant/60 bg-surface-container-lowest/90 px-2.5 py-1 text-label-sm font-label-sm uppercase text-on-surface-variant">
                <MaterialSymbol icon="hourglass_top" className="text-sm" />
                Waitlist
              </span>
            )}
          </motion.div>

          <h1 className="max-w-4xl">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={reducedMotion ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.2 + i * 0.07,
                  ease: EASE,
                }}
                className="mr-[0.2em] inline-block text-[clamp(2.5rem,8vw,5.5rem)] font-display-xl uppercase leading-[0.92] tracking-wide text-on-surface"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            className="mt-sm max-w-xl text-body-lg text-on-surface-variant"
          >
            {event.dateTime} · {event.location}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
