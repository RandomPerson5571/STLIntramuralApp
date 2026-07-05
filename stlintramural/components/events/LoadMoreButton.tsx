"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";

interface LoadMoreButtonProps {
  onClick: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function LoadMoreButton({
  onClick,
  hasMore,
  isLoading,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mt-md flex justify-center sm:mt-lg"
    >
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-primary px-lg py-2.5 text-label-sm font-label-sm uppercase text-primary shadow-[0_2px_8px_rgba(0,48,174,0.08)] transition-[transform,background-color,color,box-shadow] duration-200 hover:bg-primary hover:text-on-primary hover:shadow-[0_4px_14px_rgba(0,48,174,0.22)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <MaterialSymbol
          icon={isLoading ? "progress_activity" : "expand_more"}
          className={isLoading ? "animate-spin" : undefined}
        />
        {isLoading ? "Loading…" : "Load More Events"}
      </button>
    </motion.div>
  );
}
