"use client";

import Link from "next/link";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import CheckInQRCode from "@/components/qrcode/CheckInQRCode";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function MyQRCodeWidget({ index }: { index: number }) {
  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useCurrentUser();

  const qrToken = user?.qr_code_token ?? "";

  return (
    <DashboardWidget
      title="My QR Code"
      icon="qr_code_2"
      accentColor="secondary"
      index={index}
      isLoading={isPending}
      isError={isError || (!isPending && !qrToken)}
      errorMessage="Could not load your check-in code."
      onRetry={() => {
        void refetch();
      }}
    >
      <div className="flex flex-col items-center gap-sm sm:flex-row sm:items-center">
        <div className="aspect-square w-full max-w-[120px] rounded-xl bg-white p-2 ring-2 ring-secondary/15">
          {qrToken ? (
            <CheckInQRCode token={qrToken} size={256} />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
          <p className="text-center text-body-sm text-on-surface-variant sm:text-left">
            Show this at events for staff to scan and award points.
          </p>
          <Link
            href="/qrcode"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-label-sm font-label-sm uppercase tracking-wider text-on-secondary shadow-[0_4px_14px_rgba(0,102,136,0.22)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_18px_rgba(0,102,136,0.28)] active:scale-[0.98]"
          >
            <MaterialSymbol icon="fullscreen" className="text-base" />
            Full Screen
          </Link>
        </div>
      </div>
    </DashboardWidget>
  );
}
