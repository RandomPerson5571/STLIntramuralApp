"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { ScanResultKind, ScanResultPreview } from "@/lib/scan-data";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULT_META: Record<
  Exclude<ScanResultKind, "idle" | "processing">,
  {
    icon: string;
    title: string;
    accent: string;
    surface: string;
    border: string;
  }
> = {
  success: {
    icon: "check_circle",
    title: "Checked in",
    accent: "text-secondary",
    surface: "from-secondary/[0.14] to-surface-container-lowest",
    border: "border-secondary/25",
  },
  already_checked_in: {
    icon: "history",
    title: "Already here",
    accent: "text-primary",
    surface: "from-primary/[0.1] to-surface-container-lowest",
    border: "border-primary/20",
  },
  not_registered: {
    icon: "person_off",
    title: "Not registered",
    accent: "text-error",
    surface: "from-error/[0.08] to-surface-container-lowest",
    border: "border-error/20",
  },
  invalid: {
    icon: "qr_code_2",
    title: "Invalid code",
    accent: "text-error",
    surface: "from-error/[0.08] to-surface-container-lowest",
    border: "border-error/20",
  },
  outside_boundary: {
    icon: "wrong_location",
    title: "Off campus",
    accent: "text-error",
    surface: "from-error/[0.08] to-surface-container-lowest",
    border: "border-error/20",
  },
};

interface ScanResultOverlayProps {
  status: ScanResultKind;
  preview: ScanResultPreview | null;
  onDismiss: () => void;
}

export default function ScanResultOverlay({
  status,
  preview,
  onDismiss,
}: ScanResultOverlayProps) {
  const reducedMotion = useReducedMotion();
  const show =
    preview &&
    status !== "idle" &&
    status !== "processing" &&
    status in RESULT_META;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={preview.kind}
          initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`absolute inset-x-4 bottom-20 z-20 overflow-hidden rounded-2xl border bg-gradient-to-br shadow-[0_16px_48px_rgba(26,28,31,0.22)] backdrop-blur-md ${RESULT_META[preview.kind].border} ${RESULT_META[preview.kind].surface}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3 p-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest/80 ${RESULT_META[preview.kind].accent}`}
            >
              <MaterialSymbol icon={RESULT_META[preview.kind].icon} className="text-2xl" filled />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                {RESULT_META[preview.kind].title}
              </p>
              <p className="truncate text-headline-md font-headline-md uppercase text-on-surface">
                {preview.studentName}
              </p>
              <p className="mt-1 text-body-sm text-on-surface-variant">{preview.message}</p>
              {preview.points > 0 && (
                <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary/[0.12] px-2.5 py-1 text-label-sm font-label-sm uppercase text-secondary">
                  <MaterialSymbol icon="stars" className="text-sm" filled />
                  +{preview.points} pts
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onDismiss}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-on-surface-variant transition-[transform,background-color,color] duration-200 hover:bg-surface-container-high hover:text-on-surface active:scale-[0.96]"
              aria-label="Dismiss result"
            >
              <MaterialSymbol icon="close" className="text-lg" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
