"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import EventsGrid from "@/components/events/EventsGrid";
import LoadMoreButton from "@/components/events/LoadMoreButton";
import SportFilterBar from "@/components/events/SportFilterBar";
import TimePeriodSelect from "@/components/events/TimePeriodSelect";
import { useEvents } from "@/hooks/useEvents";
import type { SportFilter, TimePeriod } from "@/types/event";

const STAT_SHADE = {
  primary: {
    bg: "from-primary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,48,174,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,48,174,0.18)]",
    icon: "text-primary bg-primary/[0.1]",
    border: "border-primary/10 hover:border-primary/20",
  },
  secondary: {
    bg: "from-secondary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,102,136,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,102,136,0.18)]",
    icon: "text-secondary bg-secondary/[0.1]",
    border: "border-secondary/10 hover:border-secondary/20",
  },
};

export default function EventsContent() {
  const [activeFilter, setActiveFilter] = useState<SportFilter>("All Sports");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("This Week");

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEvents({ sport: activeFilter, period: timePeriod });

  const events = useMemo(
    () => data?.pages.flatMap((page) => page.events) ?? [],
    [data],
  );

  const openCount = events.filter((e) => e.status === "registration-open").length;
  const waitlistCount = events.filter((e) => e.status === "waitlist-only").length;

  const stats = [
    {
      icon: "event",
      label: "Showing",
      value: String(events.length),
      suffix: "events",
      accent: "primary" as const,
    },
    {
      icon: "how_to_reg",
      label: "Open",
      value: String(openCount),
      suffix: "spots",
      accent: "secondary" as const,
    },
    {
      icon: "hourglass_top",
      label: "Waitlist",
      value: String(waitlistCount),
      suffix: "full",
      accent: "primary" as const,
    },
    {
      icon: "calendar_month",
      label: "Period",
      value: timePeriod.split(" ")[1] ?? timePeriod,
      suffix: timePeriod.split(" ")[0] ?? "",
      accent: "secondary" as const,
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-secondary/[0.05] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-sm grid grid-cols-2 gap-xs sm:mb-md sm:grid-cols-4 sm:gap-sm"
      >
        {stats.map((stat, i) => {
          const shade = STAT_SHADE[stat.accent];

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.04 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br px-sm py-2.5 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 sm:py-3 ${shade.bg} ${shade.shadow} ${shade.hover} ${shade.border}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${shade.icon}`}
                >
                  <MaterialSymbol icon={stat.icon} className="text-base" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                    {stat.label}
                  </p>
                  <p className="truncate text-headline-md font-headline-md uppercase leading-tight text-on-surface">
                    {stat.value}
                    {stat.suffix && (
                      <span className="ml-1 text-label-sm font-label-sm normal-case text-on-surface-variant">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-sm overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/95 p-sm shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.1)] backdrop-blur-sm sm:mb-md sm:p-md"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.03]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
          <SportFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <TimePeriodSelect value={timePeriod} onChange={setTimePeriod} />
        </div>
      </motion.div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-sm md:grid-cols-2 md:gap-md xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-96 animate-pulse rounded-2xl bg-surface-container-high"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-error/20 bg-error-container/30 px-md py-lg text-center">
          <MaterialSymbol
            icon="error_outline"
            className="mb-2 text-display-md text-error"
          />
          <p className="text-body-lg text-on-surface">
            Could not load events. Please try again.
          </p>
          {error instanceof Error && (
            <p className="mt-1 text-body-md text-on-surface-variant">
              {error.message}
            </p>
          )}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-surface-variant/70 bg-surface-container-lowest px-md py-lg text-center">
          <MaterialSymbol
            icon="event_busy"
            className="mb-2 text-display-md text-outline"
          />
          <p className="text-body-lg text-on-surface">No events for this period.</p>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Try a different sport filter or time range.
          </p>
        </div>
      ) : (
        <>
          <EventsGrid events={events} />
          <LoadMoreButton
            onClick={() => fetchNextPage()}
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
          />
        </>
      )}
    </div>
  );
}
