"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import EventsGrid from "@/components/events/EventsGrid";
import SportFilterBar from "@/components/events/SportFilterBar";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import PaginationBar from "@/components/ui/PaginationBar";
import QueryErrorBlock from "@/components/ui/QueryErrorBlock";
import TimePeriodSelect from "@/components/events/TimePeriodSelect";
import { useEvents } from "@/hooks/useEvents";
import { STAT_SHADE } from "@/lib/constants/stat-shade";
import { DEFAULT_EVENTS_PAGE_SIZE } from "@/lib/queries/events";
import type { SportFilter, TimePeriod } from "@/types/event";

export default function EventsContent() {
  const [activeFilter, setActiveFilter] = useState<SportFilter>("All Sports");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("Upcoming");
  const [page, setPage] = useState(0);

  const { data, isPending, isFetching, isError, error, refetch } = useEvents({
    sport: activeFilter,
    period: timePeriod,
    page,
  });

  const events = data?.events ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_EVENTS_PAGE_SIZE));

  const handleFilterChange = (filter: SportFilter) => {
    setActiveFilter(filter);
    setPage(0);
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
    setPage(0);
  };

  const openCount = events.filter((e) => e.status === "registration-open").length;
  const waitlistCount = events.filter((e) => e.status === "waitlist-only").length;

  const stats = [
    {
      icon: "event",
      label: "Showing",
      value: String(totalCount),
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
      value: timePeriod === "Upcoming" ? "Upcoming" : (timePeriod.split(" ")[1] ?? timePeriod),
      suffix: timePeriod === "Upcoming" ? "" : (timePeriod.split(" ")[0] ?? ""),
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
            onFilterChange={handleFilterChange}
          />
          <TimePeriodSelect value={timePeriod} onChange={handlePeriodChange} />
        </div>
      </motion.div>

      {isPending ? (
        <ContentSkeleton variant="card-grid" />
      ) : isError ? (
        <QueryErrorBlock
          title="Could not load events. Please try again."
          detail={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
        />
      ) : events.length === 0 ? (
        <EmptyState
          icon="event_busy"
          title="No events for this period."
          description="Try a different sport filter or time range."
        />
      ) : (
        <>
          <EventsGrid events={events} />
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isFetching}
            animated
            className="mt-md sm:mt-lg"
          />
        </>
      )}
    </div>
  );
}
