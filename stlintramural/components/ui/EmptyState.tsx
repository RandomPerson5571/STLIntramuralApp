"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  animated?: boolean;
}

export default function EmptyState({
  icon,
  title,
  description,
  animated = false,
}: EmptyStateProps) {
  const content = (
    <>
      <MaterialSymbol
        icon={icon}
        className="mb-sm text-display-xl text-outline-variant"
      />
      <p className="text-headline-md font-headline-md uppercase text-on-surface">
        {title}
      </p>
      {description ? (
        <p className="mt-1 max-w-sm text-body-md text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </>
  );

  const className =
    "flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-variant/80 bg-surface-container-low/50 px-md py-xl text-center";

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={className}>{content}</div>;
}
