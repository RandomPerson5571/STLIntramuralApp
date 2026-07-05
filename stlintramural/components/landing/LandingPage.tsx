"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import StlLogo from "@/components/StlLogo";
import MaterialSymbol from "@/components/events/MaterialSymbol";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  { icon: "sports_score", label: "Earn points for every game" },
  { icon: "calendar_today", label: "Browse upcoming events" },
  { icon: "storefront", label: "Redeem rewards in the shop" },
] as const;

export default function LandingPage() {
  return (
    <div className="events-noise-overlay relative flex min-h-dvh flex-col bg-surface font-body-md text-on-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-secondary/[0.04]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/[0.05] blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 flex items-center justify-between px-margin py-sm md:px-lg">
        <StlLogo href="/" showWordmark priority />

        <nav className="flex items-center gap-sm">
          <Link
            href="/login"
            className="hidden text-body-md text-on-surface-variant transition-colors hover:text-primary sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-sm py-xs text-body-md font-medium text-on-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-margin pb-xl pt-lg text-center md:px-lg">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-sm inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-sm py-xs text-label-sm font-label-sm uppercase tracking-widest text-primary"
        >
          <MaterialSymbol icon="bolt" className="text-base" />
          Play Hard. Win Big.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="max-w-4xl text-[clamp(3rem,10vw,5.5rem)] font-display-xl uppercase leading-[0.95] tracking-wide text-on-surface"
        >
          Your campus
          <span className="block text-primary">intramural hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-md max-w-lg text-body-lg text-on-surface-variant"
        >
          Track points, check in to games, climb the leaderboard, and redeem
          rewards — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-lg flex flex-wrap items-center justify-center gap-sm"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-md py-sm text-body-md font-medium text-on-primary shadow-[0_4px_20px_rgba(0,48,174,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get started
            <MaterialSymbol icon="arrow_forward" className="text-lg" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-on-surface transition-colors hover:border-primary/30 hover:text-primary"
          >
            Go to dashboard
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
          className="mt-xl grid w-full max-w-2xl gap-sm sm:grid-cols-3"
        >
          {FEATURES.map(({ icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-xs rounded-xl border border-surface-variant/80 bg-surface-container-lowest/80 px-sm py-md backdrop-blur-sm"
            >
              <MaterialSymbol icon={icon} className="text-2xl text-primary" filled />
              <span className="text-body-md text-on-surface-variant">{label}</span>
            </li>
          ))}
        </motion.ul>
      </main>

      <footer className="relative z-10 border-t border-surface-variant/60 px-margin py-sm text-center text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant md:px-lg">
        Saint Louis University Intramurals
      </footer>
    </div>
  );
}
