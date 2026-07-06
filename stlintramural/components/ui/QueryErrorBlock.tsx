"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";

interface QueryErrorBlockProps {
  title: string;
  detail?: string;
  onRetry?: () => void;
}

export default function QueryErrorBlock({
  title,
  detail,
  onRetry,
}: QueryErrorBlockProps) {
  return (
    <div className="rounded-2xl border border-error/20 bg-error-container/30 px-md py-lg text-center">
      <MaterialSymbol
        icon="error_outline"
        className="mb-2 text-display-md text-error"
      />
      <p className="text-body-lg text-on-surface">{title}</p>
      {detail ? (
        <p className="mt-1 text-body-md text-on-surface-variant">{detail}</p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-sm rounded-xl bg-primary px-md py-2 text-label-sm font-label-sm uppercase text-on-primary"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
