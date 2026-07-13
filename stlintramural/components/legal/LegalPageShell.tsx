"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import StlLogo from "@/components/StlLogo";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import SiteFooter from "@/components/layout/SiteFooter";

const EASE = [0.22, 1, 0.36, 1] as const;

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export default function LegalPageShell({
  title,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  const reduced = useReducedMotion();

  return (
    <div className="events-noise-overlay relative flex min-h-dvh flex-col overflow-x-hidden bg-surface font-body-md text-on-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-secondary/[0.04]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -top-24 h-[22rem] w-[22rem] rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-surface-variant/50 bg-surface-bright/80 px-margin py-sm backdrop-blur-sm md:px-lg">
        <StlLogo href="/" showWordmark priority />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-label-sm font-label-sm uppercase tracking-wide text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialSymbol icon="arrow_back" className="text-base" />
          Home
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-margin py-lg md:px-lg md:py-xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="mb-sm text-label-sm font-label-sm uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-display-xl uppercase leading-[0.95] tracking-wide text-on-surface">
            {title}
          </h1>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        <motion.article
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduced ? 0 : 0.08, ease: EASE }}
          className="legal-prose mt-lg rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/90 p-md shadow-[0_2px_12px_rgba(26,28,31,0.04)] backdrop-blur-sm sm:p-lg md:mt-xl md:p-xl"
        >
          {children}
        </motion.article>
      </main>

      <SiteFooter />
    </div>
  );
}
