"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { EventDetail } from "@/types/event-detail";

const EASE = [0.22, 1, 0.36, 1] as const;

const SHADE = {
  primary: {
    card: "border-primary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.14)]",
    glow: "from-primary/[0.07] via-primary/[0.02] to-transparent",
    cta: "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)]",
    ring: "ring-primary/15",
  },
  secondary: {
    card: "border-secondary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,102,136,0.14)]",
    glow: "from-secondary/[0.07] via-secondary/[0.02] to-transparent",
    cta: "bg-secondary text-on-secondary shadow-[0_4px_14px_rgba(0,102,136,0.25)] hover:shadow-[0_6px_20px_rgba(0,102,136,0.32)]",
    ring: "ring-secondary/15",
  },
} as const;

interface EventDetailContentProps {
  event: EventDetail;
  related: EventDetail[];
}

function DetailStat({
  icon,
  label,
  value,
  delay,
  reducedMotion,
}: {
  icon: string;
  label: string;
  value: string;
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className="rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/90 p-sm backdrop-blur-sm"
    >
      <div className="mb-1 flex items-center gap-2 text-on-surface-variant">
        <MaterialSymbol icon={icon} className="text-base text-outline" />
        <span className="text-label-sm font-label-sm uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-headline-md font-headline-md uppercase leading-tight text-on-surface">
        {value}
      </p>
    </motion.div>
  );
}

export default function EventDetailContent({
  event,
  related,
}: EventDetailContentProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const shade = SHADE[event.accentColor];
  const isWaitlist = event.action === "join-waitlist";
  const fillPercent =
    event.maxAttendees != null
      ? Math.min(100, Math.round((event.attendeeCount / event.maxAttendees) * 100))
      : null;

  return (
    <div className="relative mx-auto max-w-7xl px-margin pb-xl md:px-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-1/3 left-0 h-64 w-64 rounded-full bg-secondary/[0.05] blur-3xl" />
      </div>

      <div className="-mt-md relative z-10 mb-lg grid gap-sm sm:grid-cols-2 lg:grid-cols-4">
        <DetailStat
          icon="event"
          label="Starts"
          value={event.dateTime}
          delay={0}
          reducedMotion={reducedMotion}
        />
        <DetailStat
          icon="schedule"
          label="Ends"
          value={event.endDateTime}
          delay={0.05}
          reducedMotion={reducedMotion}
        />
        <DetailStat
          icon="location_on"
          label="Venue"
          value={event.location}
          delay={0.1}
          reducedMotion={reducedMotion}
        />
        <DetailStat
          icon="stars"
          label="Points"
          value={`+${event.pointsAwarded}`}
          delay={0.15}
          reducedMotion={reducedMotion}
        />
      </div>

      <div className="grid gap-lg lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-xl">
        <div className="space-y-lg">
          <motion.section
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h2 className="mb-sm text-headline-lg font-headline-lg uppercase text-on-surface">
              About This Event
            </h2>
            <p className="max-w-3xl text-body-lg leading-relaxed text-on-surface-variant">
              {event.description}
            </p>
          </motion.section>

          {event.tags.length > 0 ? (
            <motion.section
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            >
              <h2 className="mb-sm text-headline-md font-headline-md uppercase text-on-surface">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-surface-variant/70 bg-surface-container-low px-3 py-1 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.section>
          ) : null}

          <motion.section
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className={`relative overflow-hidden rounded-2xl border bg-surface-container-lowest/95 p-md backdrop-blur-sm ${shade.card}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
              aria-hidden
            />
            <div className="relative flex items-center gap-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high">
                <MaterialSymbol icon="person" className="text-2xl text-primary" />
              </div>
              <div>
                <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                  Hosted by
                </p>
                <p className="text-headline-md font-headline-md uppercase text-on-surface">
                  {event.host.name}
                </p>
                <p className="text-body-md text-on-surface-variant">{event.host.role}</p>
              </div>
            </div>
          </motion.section>

          {related.length > 0 ? (
            <motion.section
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            >
              <h2 className="mb-sm text-headline-md font-headline-md uppercase text-on-surface">
                More Events
              </h2>
              <div className="grid gap-sm sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/events/${item.slug}`}
                    className="group rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/90 p-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(0,48,174,0.1)]"
                  >
                    <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">
                      {item.sport}
                    </p>
                    <p className="mt-1 text-headline-md font-headline-md uppercase text-on-surface transition-colors group-hover:text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 text-body-sm text-on-surface-variant">
                      {item.dateTime}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.section>
          ) : null}
        </div>

        <motion.aside
          id="register"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div
            className={`relative overflow-hidden rounded-2xl border bg-surface-container-lowest/95 p-md backdrop-blur-sm ${shade.card}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
              aria-hidden
            />

            <div className="relative">
              <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                Registration
              </p>
              <p className="mt-1 text-headline-md font-headline-md uppercase text-on-surface">
                {event.registration}
              </p>

              {fillPercent != null ? (
                <div className="mt-sm">
                  <div className="mb-1 flex justify-between text-label-sm font-label-sm uppercase text-on-surface-variant">
                    <span>Capacity</span>
                    <span>{fillPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                    <motion.div
                      initial={reducedMotion ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                      style={{ transformOrigin: "left" }}
                      className={`h-full rounded-full ${event.accentColor === "primary" ? "bg-primary" : "bg-secondary"}`}
                      aria-hidden
                    />
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                className={`group mt-md flex w-full items-center justify-center gap-2 rounded-xl py-3 text-label-sm font-label-sm uppercase tracking-wider transition-[transform,box-shadow,border-color,color,background-color] duration-200 active:scale-[0.98] ${
                  isWaitlist
                    ? "border-2 border-outline-variant bg-surface-container-low text-on-surface-variant shadow-none hover:border-secondary hover:text-secondary"
                    : shade.cta
                }`}
              >
                <MaterialSymbol
                  icon={isWaitlist ? "hourglass_top" : "how_to_reg"}
                  className="text-base transition-transform duration-300 group-hover:scale-110"
                />
                {event.actionLabel}
              </button>

              <p className="mt-sm text-center text-body-sm text-on-surface-variant">
                Registration opens soon — backend not connected yet.
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
