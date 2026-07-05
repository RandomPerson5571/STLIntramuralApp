"use client";

import QRCode from "react-qr-code";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { useCheckInsThisMonth } from "@/hooks/useDashboard";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function formatQrLabel(token: string): string {
  return token.slice(0, 8).toUpperCase();
}

export default function MyQRCodeWidget({ index }: { index: number }) {
  const {
    data: user,
    isPending: userPending,
    isError: userError,
    refetch: refetchUser,
  } = useCurrentUser();
  const {
    data: checkIns,
    isPending: checkInsPending,
    isError: checkInsError,
    refetch: refetchCheckIns,
  } = useCheckInsThisMonth();

  const isLoading = userPending || checkInsPending;
  const qrToken = user?.qr_code_token ?? "";
  const isError =
    userError || checkInsError || (!isLoading && !qrToken);

  return (
    <DashboardWidget
      title="Check-In"
      icon="qr_code_2"
      accentColor="primary"
      index={index}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Could not load your check-in code."
      onRetry={() => {
        void refetchUser();
        void refetchCheckIns();
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-sm w-full">
          <div
            className="pointer-events-none absolute inset-x-4 top-1/2 h-32 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-2xl"
            aria-hidden
          />
          <div className="mx-auto aspect-square w-full max-w-[168px] rounded-2xl bg-white p-3 shadow-[0_8px_32px_rgba(0,48,174,0.12),0_2px_8px_rgba(26,28,31,0.08),inset_0_1px_0_rgba(255,255,255,1)] ring-2 ring-primary/15 sm:max-w-[180px] sm:p-3.5">
            <QRCode
              value={qrToken}
              size={256}
              level="M"
              fgColor="#0030ae"
              bgColor="#ffffff"
              title="Your check-in QR code"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>
        </div>

        <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface">
          {formatQrLabel(qrToken)}
        </p>
        <p className="mt-1 text-body-md leading-snug text-on-surface-variant">
          Show this code at game check-in
        </p>

        <div className="mt-sm inline-flex items-center gap-1 rounded-full bg-secondary/[0.08] px-2.5 py-1 text-label-sm font-label-sm uppercase text-secondary">
          <MaterialSymbol icon="verified" className="text-sm" />
          {checkIns ?? 0} check-ins this month
        </div>
      </div>
    </DashboardWidget>
  );
}
