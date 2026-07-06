"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import AdminCreateEventTrigger from "@/components/events/AdminCreateEventTrigger";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import DetailRow from "@/components/ui/DetailRow";
import PaginationBar from "@/components/ui/PaginationBar";
import SlideOverPanel from "@/components/ui/SlideOverPanel";
import { useAdminEvents } from "@/hooks/useAdmin";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { formatEventRange } from "@/lib/format";
import {
  DEFAULT_ADMIN_EVENTS_PAGE_SIZE,
  type AdminEvent,
  type AdminEventTiming,
} from "@/lib/queries/admin";

const TIMING_LABEL: Record<AdminEventTiming, string> = {
  upcoming: "Upcoming",
  active: "In progress",
  past: "Past",
};

const TIMING_CLASS: Record<AdminEventTiming, string> = {
  upcoming: "bg-primary/[0.08] text-primary",
  active: "bg-secondary/[0.08] text-secondary",
  past: "bg-surface-container text-outline",
};

function EventsSkeleton() {
  return (
    <ul className="divide-y divide-surface-variant/50">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="grid gap-sm p-md sm:grid-cols-[1.4fr_1fr_1fr_5rem_6rem] sm:items-center"
        >
          <span className="h-4 w-full animate-pulse rounded bg-surface-container-high" />
          <span className="hidden h-4 w-24 animate-pulse rounded bg-surface-container sm:block" />
          <span className="hidden h-4 w-28 animate-pulse rounded bg-surface-container sm:block" />
          <span className="hidden h-5 w-16 animate-pulse rounded-full bg-surface-container sm:block" />
          <span className="hidden h-8 w-24 animate-pulse rounded-xl bg-surface-container sm:block" />
        </li>
      ))}
    </ul>
  );
}

function EventDetailPanel({
  event,
  open,
  onClose,
}: {
  event: AdminEvent | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <SlideOverPanel
      open={open && event !== null}
      onClose={onClose}
      closeAriaLabel="Close event details"
      title={event?.title ?? ""}
      titleExtra={
        event ? (
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-label-sm font-label-sm uppercase ${TIMING_CLASS[event.timing]}`}
          >
            {TIMING_LABEL[event.timing]}
          </span>
        ) : null
      }
      footer={
        <Link
          href="/events"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-sm font-label-sm uppercase text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] transition-[transform,opacity] duration-200 hover:bg-primary-fixed-variant active:scale-[0.98]"
        >
          Events page
        </Link>
      }
    >
      {event ? (
        <dl className="space-y-md">
          <DetailRow label="Sport" value={event.sport} />
          {event.format ? <DetailRow label="Format" value={event.format} /> : null}
          <DetailRow label="Location" value={event.location} />
          <DetailRow
            label="Schedule"
            value={formatEventRange(event.startDate, event.endDate)}
          />
          <DetailRow label="Host" value={event.hostName} />
          <DetailRow label="Registration" value={event.registration} />
          <DetailRow
            label="Points per check-in"
            value={event.pointsAwarded.toLocaleString()}
          />
          {event.description?.trim() ? (
            <DetailRow label="Description" value={event.description} />
          ) : null}
        </dl>
      ) : null}
    </SlideOverPanel>
  );
}

export default function AdminEventsPanel() {
  const [page, setPage] = useState(0);
  const [detailEvent, setDetailEvent] = useState<AdminEvent | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { data, isPending, isError, isFetching, refetch } = useAdminEvents(page);
  const deleteEvent = useDeleteEvent();

  const events = data?.events ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const pageSize = data?.pageSize ?? DEFAULT_ADMIN_EVENTS_PAGE_SIZE;
  const rangeStart = totalCount === 0 ? 0 : page * pageSize + 1;
  const rangeEnd = Math.min((page + 1) * pageSize, totalCount);

  const handleDelete = async (event: AdminEvent) => {
    try {
      await deleteEvent.mutateAsync(event.id);
      setConfirmDeleteId(null);
      if (detailEvent?.id === event.id) {
        setDetailEvent(null);
      }
    } catch {
      // Error handled via deleteEvent.error if surfaced later.
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-md"
      >
        <div className="flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-title-lg font-title-lg text-on-surface">
              Event management
            </h2>
            <p className="mt-1 text-body-sm font-body-sm text-on-surface-variant">
              View, inspect, and remove intramural events across the platform.
            </p>
          </div>
          <div className="flex items-center gap-sm">
            {totalCount > 0 && (
              <p className="text-label-sm font-label-sm text-outline">
                {rangeStart}–{rangeEnd} of {totalCount.toLocaleString()}
              </p>
            )}
            <AdminCreateEventTrigger />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/80 backdrop-blur-sm">
          <div className="hidden border-b border-surface-variant/50 bg-surface-container-low/60 px-md py-2.5 text-label-sm font-label-sm uppercase tracking-wide text-outline sm:grid sm:grid-cols-[1.4fr_1fr_1fr_5rem_6rem] sm:gap-sm">
            <span>Event</span>
            <span>Host</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {isPending && !data ? (
            <EventsSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center gap-sm p-xl text-center">
              <MaterialSymbol
                icon="error_outline"
                className="text-3xl text-on-surface-variant"
              />
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Could not load events.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="text-label-sm font-label-sm text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          ) : events.length === 0 ? (
            <p className="p-xl text-center text-body-sm font-body-sm text-on-surface-variant">
              No events yet. Create one to get started.
            </p>
          ) : (
            <ul
              className={`divide-y divide-surface-variant/50 ${isFetching ? "opacity-70" : ""}`}
            >
              {events.map((event) => {
                const isConfirming = confirmDeleteId === event.id;
                const isDeleting =
                  deleteEvent.isPending &&
                  deleteEvent.variables === event.id;

                return (
                  <li
                    key={event.id}
                    className="grid gap-2 p-md sm:grid-cols-[1.4fr_1fr_1fr_5rem_6rem] sm:items-center sm:gap-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-body-md font-body-md text-on-surface">
                        {event.title}
                      </p>
                      <p className="truncate text-body-sm font-body-sm text-outline">
                        {event.sport}
                        {event.format ? ` · ${event.format}` : ""} ·{" "}
                        {event.registration}
                      </p>
                    </div>
                    <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                      {event.hostName}
                    </p>
                    <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                      {event.dateTime}
                    </p>
                    <span
                      className={`inline-flex w-fit rounded-full px-2 py-0.5 text-label-sm font-label-sm uppercase ${TIMING_CLASS[event.timing]}`}
                    >
                      {TIMING_LABEL[event.timing]}
                    </span>

                    {isConfirming ? (
                      <div className="flex flex-wrap items-center justify-end gap-1.5 sm:col-span-1">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isDeleting}
                          className="rounded-lg px-2 py-1 text-label-sm font-label-sm text-outline hover:text-on-surface disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(event)}
                          disabled={isDeleting}
                          className="rounded-lg bg-error px-2 py-1 text-label-sm font-label-sm text-on-error disabled:opacity-50"
                        >
                          {isDeleting ? "Removing…" : "Confirm"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setDetailEvent(event)}
                          aria-label={`Details for ${event.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-variant/60 text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
                        >
                          <MaterialSymbol icon="info" className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(event.id)}
                          aria-label={`Remove ${event.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-variant/60 text-on-surface-variant transition-colors hover:border-error/30 hover:text-error"
                        >
                          <MaterialSymbol icon="delete" className="text-base" />
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      </motion.div>

      <EventDetailPanel
        event={detailEvent}
        open={detailEvent !== null}
        onClose={() => setDetailEvent(null)}
      />
    </>
  );
}
