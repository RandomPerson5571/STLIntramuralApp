"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const TITLE_CLASSES =
  "text-display-xl font-display-xl uppercase text-on-surface slanted-accent";

type PageHeaderProps = {
  title: string | string[];
  subtitle: string;
  eyebrow?: ReactNode | string;
  actions?: ReactNode;
  titleClassName?: string;
};

function PageTitle({
  title,
  className,
}: {
  title: string | string[];
  className: string;
}) {
  const words = Array.isArray(title) ? title : [title];
  const stagger = Array.isArray(title) && title.length > 1;

  if (stagger) {
    return (
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="mb-1 flex flex-wrap gap-x-3 pr-4"
      >
        {words.map((word) => (
          <motion.span
            key={word}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: EASE },
              },
            }}
            className={`inline-block ${className}`}
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>
    );
  }

  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`mb-1 inline-block pr-4 ${className}`}
    >
      {words[0]}
    </motion.h1>
  );
}

function Eyebrow({ eyebrow }: { eyebrow: ReactNode | string }) {
  if (typeof eyebrow === "string") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-2 text-label-sm font-label-sm uppercase tracking-[0.2em] text-secondary"
      >
        {eyebrow}
      </motion.p>
    );
  }

  return eyebrow;
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  titleClassName = TITLE_CLASSES,
}: PageHeaderProps) {
  const subtitleDelay = Array.isArray(title) && title.length > 1 ? 0.2 : 0.1;

  return (
    <div className="relative overflow-hidden border-b border-surface-variant/60 bg-gradient-to-br from-surface-bright via-surface to-surface-container-low/30 px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-secondary/[0.05] blur-3xl"
        aria-hidden
      />

      <div
        className={
          actions
            ? "relative z-10 mx-auto flex max-w-7xl flex-col gap-sm sm:flex-row sm:items-start sm:justify-between"
            : "relative z-10 mx-auto max-w-7xl"
        }
      >
        <div>
          {eyebrow ? <Eyebrow eyebrow={eyebrow} /> : null}
          <PageTitle title={title} className={titleClassName} />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: subtitleDelay, ease: EASE }}
            className="max-w-2xl text-body-lg font-body-lg text-on-surface-variant"
          >
            {subtitle}
          </motion.p>
        </div>
        {actions}
      </div>
    </div>
  );
}
