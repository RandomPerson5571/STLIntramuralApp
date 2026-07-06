"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  animated?: boolean;
  className?: string;
}

export default function PaginationBar({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  animated = false,
  className = "",
}: PaginationBarProps) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  const controls = (
    <>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev || isLoading}
        className="inline-flex items-center gap-1.5 rounded-xl border border-surface-variant/70 bg-surface-container-lowest/80 px-3 py-2 text-label-sm font-label-sm text-on-surface transition-[transform,opacity] duration-200 hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        <MaterialSymbol icon="chevron_left" className="text-base" />
        Previous
      </button>
      <span className="text-label-sm font-label-sm text-outline">
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext || isLoading}
        className="inline-flex items-center gap-1.5 rounded-xl border border-surface-variant/70 bg-surface-container-lowest/80 px-3 py-2 text-label-sm font-label-sm text-on-surface transition-[transform,opacity] duration-200 hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        Next
        <MaterialSymbol icon="chevron_right" className="text-base" />
      </button>
    </>
  );

  const barClass = `flex items-center justify-between gap-sm ${className}`;

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={barClass}
      >
        {controls}
      </motion.div>
    );
  }

  return <div className={barClass}>{controls}</div>;
}
