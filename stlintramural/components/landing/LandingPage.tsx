"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import StlLogo from "@/components/StlLogo";
import MaterialSymbol from "@/components/events/MaterialSymbol";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  { icon: "sports_score", label: "Earn points for every game" },
  { icon: "calendar_today", label: "Browse upcoming events" },
  { icon: "storefront", label: "Redeem rewards in the shop" },
] as const;

const fadeUp = (delay = 0, reduced = false) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, delay, ease: EASE },
      };

export default function LandingPage() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="events-noise-overlay relative flex min-h-dvh flex-col overflow-x-hidden bg-surface font-body-md text-on-surface lg:h-dvh lg:min-h-0 lg:overflow-hidden">
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

      <header className="relative z-10 flex shrink-0 items-center justify-between px-margin py-sm md:px-lg lg:py-xs">
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

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-margin pb-lg pt-md text-center md:px-lg lg:pb-md lg:pt-0 max-lg:overflow-y-auto">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-lg lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-xl lg:text-left xl:max-w-7xl">
          <div className="flex flex-col items-center lg:items-start">
            <motion.p
              {...fadeUp(0, reducedMotion ?? false)}
              className="mb-sm inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-sm py-xs text-label-sm font-label-sm uppercase tracking-widest text-primary lg:mb-xs"
            >
              <MaterialSymbol icon="bolt" className="text-base" />
              Play Hard. Win Big.
            </motion.p>

            <motion.h1
              {...fadeUp(0.1, reducedMotion ?? false)}
              className="max-w-4xl text-[clamp(2.5rem,8vw,4.25rem)] font-display-xl uppercase leading-[0.92] tracking-wide text-on-surface xl:text-[clamp(2.75rem,5vw,4.5rem)]"
            >
              Your campus
              <span className="block text-primary">intramural hub</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2, reducedMotion ?? false)}
              className="mt-sm max-w-lg text-body-lg text-on-surface-variant lg:mt-xs"
            >
              Track points, check in to games, climb the leaderboard, and redeem
              rewards — all in one place.
            </motion.p>

            <motion.div
              {...fadeUp(0.3, reducedMotion ?? false)}
              className="mt-md flex flex-wrap items-center justify-center gap-sm lg:mt-sm lg:justify-start"
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
                className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest/80 px-md py-sm text-body-md text-on-surface backdrop-blur-sm transition-colors hover:border-primary/30 hover:text-primary"
              >
                Go to dashboard
              </Link>
            </motion.div>
          </div>

          <motion.ul
            {...fadeUp(0.4, reducedMotion ?? false)}
            className="grid w-full gap-sm sm:grid-cols-3 lg:grid-cols-1 lg:gap-xs xl:gap-sm"
          >
            {FEATURES.map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-sm rounded-xl border border-surface-variant/80 bg-surface-container-lowest/80 px-sm py-sm backdrop-blur-sm transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/20 lg:px-md lg:py-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/[0.06]">
                  <MaterialSymbol icon={icon} className="text-xl text-primary" filled />
                </span>
                <span className="text-left text-body-md text-on-surface-variant">
                  {label}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-surface-variant/60 px-margin py-sm text-center text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant md:px-lg lg:py-xs">
        Saint Louis University Intramurals
      </footer>
    </div>
  );
}
