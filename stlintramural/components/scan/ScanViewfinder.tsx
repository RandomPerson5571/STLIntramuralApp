"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { IDetectedBarcode, IScannerError } from "@yudiel/react-qr-scanner";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { ScanResultKind } from "@/lib/scan-data";

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-[#0a1628]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <MaterialSymbol icon="photo_camera" className="text-2xl text-secondary-container" />
          </div>
          <p className="text-label-sm font-label-sm uppercase tracking-[0.2em] text-white/60">
            Starting camera…
          </p>
        </div>
      </div>
    ),
  },
);

interface ScanViewfinderProps {
  status: ScanResultKind;
  paused: boolean;
  onScan: (token: string) => void;
  onError?: (message: string) => void;
}

function CornerBracket({ className }: { className: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-10 h-10 w-10 border-secondary ${className}`}
      aria-hidden
    />
  );
}

const ERROR_MESSAGES: Record<string, string> = {
  "permission-denied": "Camera access denied. Allow camera permission in your browser settings.",
  "no-camera": "No camera found on this device.",
  "in-use": "Camera is in use by another app.",
  "insecure-context": "Camera requires HTTPS or localhost.",
};

export default function ScanViewfinder({
  status,
  paused,
  onScan,
  onError,
}: ScanViewfinderProps) {
  const isProcessing = status === "processing";

  const handleScan = (detected: IDetectedBarcode[]) => {
    const value = detected[0]?.rawValue?.trim();
    if (value) onScan(value);
  };

  const handleError = (error: IScannerError) => {
    onError?.(ERROR_MESSAGES[error.kind] ?? "Could not start the camera.");
  };

  const scannerStyles = useMemo(
    () => ({
      container: { width: "100%", height: "100%" },
      video: { objectFit: "cover" as const },
    }),
    [],
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-inverse-surface/80 bg-inverse-surface shadow-[0_12px_48px_rgba(26,28,31,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/11]">
        <div className="absolute inset-0">
          <Scanner
            onScan={handleScan}
            onError={handleError}
            paused={paused}
            scanDelay={1200}
            allowMultiple={false}
            sound
            constraints={{ facingMode: "environment" }}
            styles={scannerStyles}
            components={{ finder: false, torch: false, zoom: false, onOff: false }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,193,253,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,193,253,0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-lg">
          <div className="relative h-full w-full max-w-md">
            <CornerBracket className="left-0 top-0 border-l-2 border-t-2" />
            <CornerBracket className="right-0 top-0 border-r-2 border-t-2" />
            <CornerBracket className="bottom-0 left-0 border-b-2 border-l-2" />
            <CornerBracket className="bottom-0 right-0 border-b-2 border-r-2" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-4 py-3">
          <p className="text-label-sm font-label-sm uppercase tracking-[0.2em] text-white/80">
            {isProcessing ? "Reading code…" : paused ? "Scanner paused" : "Align QR in frame"}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-label-sm font-label-sm uppercase tracking-wider text-white/70">
            <MaterialSymbol icon="center_focus_strong" className="text-base text-secondary-container" />
            Live camera
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-label-sm font-label-sm uppercase text-white/70">
            <MaterialSymbol icon="qr_code_scanner" className="text-sm" />
            Scanning
          </span>
        </div>
      </div>
    </div>
  );
}
