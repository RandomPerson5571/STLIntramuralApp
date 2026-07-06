"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import {
  getRegistrationErrorMessage,
  useRegisterForEvent,
} from "@/hooks/useRegisterForEvent";
import type { EventItem } from "@/types/event";

interface EventCardProps {
  event: EventItem;
  index: number;
}

const SHADE_MAP = {
  primary: {
    card: "border-primary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.14)]",
    hover:
      "hover:shadow-[0_4px_12px_rgba(26,28,31,0.06),0_16px_40px_-8px_rgba(0,48,174,0.2)] hover:border-primary/20",
    glow: "from-primary/[0.07] via-primary/[0.02] to-transparent",
    badge: "bg-primary/[0.08] text-primary ring-primary/10",
    dot: "bg-primary",
  },
  secondary: {
    card: "border-secondary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,102,136,0.14)]",
    hover:
      "hover:shadow-[0_4px_12px_rgba(26,28,31,0.06),0_16px_40px_-8px_rgba(0,102,136,0.2)] hover:border-secondary/20",
    glow: "from-secondary/[0.07] via-secondary/[0.02] to-transparent",
    badge: "bg-secondary/[0.08] text-secondary ring-secondary/10",
    dot: "bg-secondary",
  },
} as const;

export default function EventCard({ event, index }: EventCardProps) {
  const register = useRegisterForEvent();
  const isWaitlist = event.action === "join-waitlist";
  const isRegistered = event.actionLabel === "Registered";
  const isRegistering =
    register.isPending && register.variables === event.id;
  const registrationError =
    register.variables === event.id
      ? getRegistrationErrorMessage(register.error)
      : null;
  const shade = SHADE_MAP[event.borderColor];

  const handleRegister = () => {
    if (isRegistered || isRegistering) return;
    register.mutate(event.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group/card relative flex flex-col overflow-hidden rounded-2xl border bg-surface-container-lowest/95 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 ${shade.card} ${shade.hover}`}
    >
      <Link
        href={`/events/${event.slug}`}
        className="absolute inset-0 z-0 cursor-pointer rounded-2xl"
        aria-label={`View ${event.title}`}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-2xl"
        aria-hidden
      />

      <div className="pointer-events-none relative h-44 overflow-hidden sm:h-48">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.imageAlt ?? event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container">
            <MaterialSymbol
              icon={event.placeholderIcon ?? "sports"}
              className="text-display-xl text-outline-variant"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 via-transparent to-transparent" />

        {event.status === "registration-open" ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl bg-secondary px-2.5 py-1 text-label-sm font-label-sm uppercase text-on-secondary shadow-[0_4px_12px_rgba(0,102,136,0.35)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-secondary" />
            Open
          </div>
        ) : (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl border border-surface-variant/60 bg-surface-container-lowest/90 px-2.5 py-1 text-label-sm font-label-sm uppercase text-on-surface-variant backdrop-blur-sm">
            <MaterialSymbol icon="hourglass_top" className="text-sm" />
            Waitlist
          </div>
        )}
      </div>

      <div className="pointer-events-none relative flex flex-1 flex-col p-sm sm:p-md">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-label-sm font-label-sm uppercase ring-1 ${shade.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${shade.dot}`} />
            {event.sport}
          </span>
          {event.format ? (
            <span className="text-label-sm font-label-sm uppercase text-on-surface-variant">
              {event.format}
            </span>
          ) : null}
        </div>

        <h3 className="mb-sm text-headline-md font-headline-md uppercase text-on-surface transition-colors group-hover/card:text-primary">
          {event.title}
        </h3>

        <div className="mb-sm flex-1 space-y-1.5 text-body-md text-on-surface-variant">
          <div className="flex items-center gap-2">
            <MaterialSymbol icon="event" className="text-base text-outline" />
            <span>{event.dateTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MaterialSymbol icon="location_on" className="text-base text-outline" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <MaterialSymbol icon="group" className="text-base text-outline" />
            <span>{event.registration}</span>
          </div>
        </div>

        <div className="pointer-events-auto relative z-10 mt-auto flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRegister}
              disabled={isRegistered || isRegistering}
              className={`relative z-10 flex-1 rounded-xl py-2 text-label-sm font-label-sm uppercase transition-[transform,opacity,box-shadow,background-color] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                isRegistered
                  ? "border-2 border-secondary bg-secondary/10 text-secondary"
                  : isWaitlist
                    ? "border-2 border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-secondary hover:text-secondary"
                    : "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] hover:bg-primary-fixed-variant hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)]"
              }`}
            >
              {isRegistering ? "Registering…" : event.actionLabel}
            </button>
            <button
              type="button"
              aria-label="Set notification reminder"
              className="relative z-10 flex items-center justify-center rounded-xl border-2 border-outline-variant px-3 text-on-surface transition-[transform,border-color,color] duration-200 hover:border-primary hover:text-primary active:scale-[0.98]"
            >
              <MaterialSymbol icon="notifications" />
            </button>
          </div>
          {registrationError ? (
            <p className="text-label-sm text-error" role="alert">
              {registrationError}
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
