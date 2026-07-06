"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import CheckInQRCode from "@/components/qrcode/CheckInQRCode";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { WidgetErrorState } from "@/components/dashboard/DashboardWidget";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDisplayName } from "@/lib/constants/leaderboard";
import {
  downloadQrAsPng,
  downloadQrAsSvg,
  studentQrCodeFilename,
} from "@/lib/qr-code-download";

function formatQrLabel(token: string): string {
  return token.slice(0, 8).toUpperCase();
}

export default function QRCodeContent() {
  const qrRef = useRef<HTMLDivElement>(null);
  const { data: user, isPending, isError, refetch } = useCurrentUser();

  const qrToken = user?.qr_code_token ?? "";
  const displayName = user ? formatDisplayName(user) : "Student";
  const containerClass = "mx-auto max-w-4xl px-lg py-lg";

  const getSvgElement = () => qrRef.current?.querySelector("svg") ?? null;

  const handleDownloadPng = () => {
    const svg = getSvgElement();
    if (!svg || !qrToken) return;
    downloadQrAsPng(svg, studentQrCodeFilename(displayName, qrToken, "png"));
  };

  const handleDownloadSvg = () => {
    const svg = getSvgElement();
    if (!svg || !qrToken) return;
    downloadQrAsSvg(svg, studentQrCodeFilename(displayName, qrToken, "svg"));
  };

  if (isPending) {
    return (
      <div className={containerClass}>
        <div className="animate-pulse rounded-2xl border border-surface-variant/40 bg-surface-container-lowest p-lg">
          <div className="grid grid-cols-2 gap-lg">
            <div className="aspect-square max-w-[320px] rounded-2xl bg-surface-container-high" />
            <div className="flex flex-col justify-center gap-3">
              <div className="h-4 w-24 rounded bg-surface-container-high" />
              <div className="h-3 w-48 rounded bg-surface-container-high" />
              <div className="h-10 w-32 rounded bg-surface-container-high" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user || !qrToken) {
    return (
      <div className={containerClass}>
        <div className="rounded-2xl border border-surface-variant/40 bg-surface-container-lowest p-lg">
          <WidgetErrorState
            message="We could not load your check-in code."
            onRetry={() => {
              void refetch();
            }}
          />
          <div className="mt-md flex flex-wrap justify-center gap-xs">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-label-sm font-label-sm uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)] active:scale-[0.98]"
            >
              <MaterialSymbol icon="arrow_back" className="text-base" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-primary/10 bg-surface-container-lowest/95 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.14)]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-primary/[0.02] to-transparent"
          aria-hidden
        />

        <div className="relative grid grid-cols-2 gap-lg p-lg">
          <div className="flex items-center justify-center">
            <div
              className="pointer-events-none absolute inset-x-4 top-1/2 h-40 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-2xl"
              aria-hidden
            />
            <div
              ref={qrRef}
              className="relative aspect-square w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(0,48,174,0.12),0_2px_8px_rgba(26,28,31,0.08),inset_0_1px_0_rgba(255,255,255,1)] ring-2 ring-primary/15"
            >
              <CheckInQRCode
                token={qrToken}
                size={512}
                title={`${displayName} check-in QR code`}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface">
              {formatQrLabel(qrToken)}
            </p>
            <p className="mt-1 text-headline-md font-headline-md uppercase text-on-surface">
              {displayName}
            </p>
            <p className="mt-2 text-body-lg leading-snug text-on-surface-variant">
              Open this page at the event entrance and let staff scan your code to
              check in. Points are awarded automatically after a successful scan.
            </p>

            <div className="mt-md inline-flex w-fit items-center gap-1 rounded-full bg-secondary/[0.08] px-3 py-1.5 text-label-sm font-label-sm uppercase text-secondary">
              <MaterialSymbol icon="qr_code_scanner" className="text-sm" />
              Staff scans at events
            </div>

            <div className="mt-lg border-t border-surface-variant/40 pt-md">
              <p className="mb-sm text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                Download
              </p>
              <div className="flex flex-row flex-wrap gap-xs">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.25)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_20px_rgba(0,48,174,0.32)] active:scale-[0.98]"
                >
                  <MaterialSymbol
                    icon="download"
                    className="text-base transition-transform duration-300 group-hover:scale-110"
                  />
                  PNG Image
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] px-5 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-primary transition-[transform,background-color] duration-200 hover:bg-primary/[0.1] active:scale-[0.98]"
                >
                  <MaterialSymbol icon="code" className="text-base" />
                  SVG Vector
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
