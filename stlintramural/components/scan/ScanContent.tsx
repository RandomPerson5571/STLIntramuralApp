"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { WidgetErrorState } from "@/components/dashboard/DashboardWidget";
import ScanEventSelector from "@/components/scan/ScanEventSelector";
import ScanRecentList from "@/components/scan/ScanRecentList";
import ScanResultOverlay from "@/components/scan/ScanResultOverlay";
import ScanSessionStats from "@/components/scan/ScanSessionStats";
import ScanViewfinder from "@/components/scan/ScanViewfinder";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRecentScans, useScanEvents } from "@/hooks/useScanEvents";
import { useScanCheckIn } from "@/hooks/useScanCheckIn";
import { canScanCheckIn } from "@/lib/permissions";
import {
  normalizeQrToken,
  ScanCheckInError,
  toScanResultPreview,
} from "@/lib/queries/scan";
import type { ScanResultKind, ScanResultPreview } from "@/lib/scan-data";

const EASE = [0.22, 1, 0.36, 1] as const;
const SCAN_COOLDOWN_MS = 2500;

export default function ScanContent() {
  const reducedMotion = useReducedMotion();
  const { data: user, isPending: userPending } = useCurrentUser();
  const { data: events, isPending: eventsPending, isError: eventsError, refetch } = useScanEvents();
  const checkIn = useScanCheckIn();

  const [selectedEventId, setSelectedEventId] = useState("");
  const [status, setStatus] = useState<ScanResultKind>("idle");
  const [activePreview, setActivePreview] = useState<ScanResultPreview | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [entryVisible, setEntryVisible] = useState(!reducedMotion);
  const lastScanRef = useRef<{ token: string; at: number } | null>(null);

  useEffect(() => {
    if (!selectedEventId && events?.[0]?.id) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const selectedEvent = useMemo(
    () => events?.find((event) => event.id === selectedEventId) ?? events?.[0],
    [events, selectedEventId],
  );

  const {
    data: recentScans,
    isPending: recentPending,
  } = useRecentScans(selectedEvent?.id ?? "", selectedEvent?.pointsAwarded ?? 0);

  useEffect(() => {
    if (reducedMotion) {
      setEntryVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setEntryVisible(true), 280);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const scannerPaused =
    status === "processing" ||
    (status !== "idle" && activePreview !== null) ||
    !selectedEventId ||
    checkIn.isPending;

  const applyResult = useCallback((preview: ScanResultPreview) => {
    setActivePreview(preview);
    setStatus(preview.kind);
  }, []);

  const dismissResult = useCallback(() => {
    setStatus("idle");
    setActivePreview(null);
  }, []);

  const handleScan = useCallback(
    async (rawToken: string) => {
      if (!selectedEventId || scannerPaused) return;

      const token = normalizeQrToken(rawToken);
      if (!token) {
        applyResult({
          kind: "invalid",
          studentName: "Unknown",
          points: 0,
          message:
            "QR code not recognized. Ask the student to open their check-in page.",
        });
        return;
      }

      const now = Date.now();
      const last = lastScanRef.current;
      if (last && last.token === token && now - last.at < SCAN_COOLDOWN_MS) {
        return;
      }
      lastScanRef.current = { token, at: now };

      setStatus("processing");
      setActivePreview(null);

      try {
        const result = await checkIn.mutateAsync({
          eventId: selectedEventId,
          qrToken: token,
        });
        applyResult(toScanResultPreview(result));
      } catch (error) {
        const message =
          error instanceof ScanCheckInError
            ? error.message
            : "Check-in failed. Please try again.";
        applyResult({
          kind: "invalid",
          studentName: "Unknown",
          points: 0,
          message,
        });
      }
    },
    [applyResult, checkIn, scannerPaused, selectedEventId],
  );

  if (!userPending && user && !canScanCheckIn(user)) {
    return (
      <div className="mx-auto max-w-3xl px-lg py-lg">
        <div className="rounded-2xl border border-surface-variant/40 bg-surface-container-lowest p-lg text-center">
          <MaterialSymbol icon="lock" className="mx-auto mb-3 text-3xl text-on-surface-variant" />
          <p className="text-headline-md font-headline-md uppercase text-on-surface">
            Staff only
          </p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            The check-in scanner is available to teachers and admins.
          </p>
        </div>
      </div>
    );
  }

  if (!entryVisible || userPending || eventsPending) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-lg py-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/[0.08]">
            <MaterialSymbol icon="qr_code_scanner" className="text-3xl text-secondary" />
          </div>
          <p className="text-label-sm font-label-sm uppercase tracking-[0.25em] text-on-surface-variant">
            Initializing scanner
          </p>
        </motion.div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="mx-auto max-w-3xl px-lg py-lg">
        <div className="rounded-2xl border border-surface-variant/40 bg-surface-container-lowest p-lg">
          <WidgetErrorState
            message="We could not load your events."
            onRetry={() => {
              void refetch();
            }}
          />
        </div>
      </div>
    );
  }

  if (!events?.length) {
    return (
      <div className="mx-auto max-w-3xl px-lg py-lg">
        <div className="rounded-2xl border border-surface-variant/40 bg-surface-container-lowest p-lg text-center">
          <MaterialSymbol icon="event_busy" className="mx-auto mb-3 text-3xl text-on-surface-variant" />
          <p className="text-headline-md font-headline-md uppercase text-on-surface">
            No events to scan
          </p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Create or host an event first, then return here to check students in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-lg py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-secondary/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      <div className="grid gap-md xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="space-y-sm"
        >
          <div className="relative">
            <ScanViewfinder
              status={status}
              paused={scannerPaused}
              onScan={(token) => {
                void handleScan(token);
              }}
              onError={setCameraError}
            />
            <ScanResultOverlay
              status={status}
              preview={activePreview}
              onDismiss={dismissResult}
            />
          </div>

          {cameraError && (
            <div
              className="flex items-start gap-3 rounded-2xl border border-error/20 bg-error-container/40 px-4 py-3"
              role="alert"
            >
              <MaterialSymbol icon="videocam_off" className="mt-0.5 shrink-0 text-error" />
              <div className="min-w-0">
                <p className="text-body-sm text-on-error-container">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => setCameraError(null)}
                  className="mt-2 text-label-sm font-label-sm uppercase tracking-wider text-error"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="space-y-sm">
          <ScanEventSelector
            events={events}
            selectedId={selectedEvent?.id ?? ""}
            onSelect={setSelectedEventId}
          />
          {selectedEvent && <ScanSessionStats event={selectedEvent} />}
          <ScanRecentList
            entries={recentScans ?? []}
            isPending={recentPending}
          />
        </div>
      </div>
    </div>
  );
}
