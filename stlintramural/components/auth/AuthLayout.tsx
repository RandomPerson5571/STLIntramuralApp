"use client";

import { motion } from "framer-motion";
import StlLogo from "@/components/StlLogo";
import MaterialSymbol from "@/components/events/MaterialSymbol";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  variant?: "primary" | "secondary";
}

const ACCENT = {
  primary: {
    headline: "text-primary",
    card: "border-primary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_12px_40px_-8px_rgba(0,48,174,0.14)]",
    glow: "from-primary/[0.06] via-transparent to-secondary/[0.03]",
    panel: "from-primary/[0.08] via-primary/[0.03] to-secondary/[0.06]",
    feature: "border-primary/15 bg-primary/[0.06] text-primary",
  },
  secondary: {
    headline: "text-secondary",
    card: "border-secondary/10 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_12px_40px_-8px_rgba(0,102,136,0.14)]",
    glow: "from-secondary/[0.06] via-transparent to-primary/[0.03]",
    panel: "from-secondary/[0.08] via-secondary/[0.03] to-primary/[0.06]",
    feature: "border-secondary/15 bg-secondary/[0.06] text-secondary",
  },
} as const;

const FEATURES = [
  { icon: "sports_score", label: "Track points & rewards" },
  { icon: "qr_code_scanner", label: "Quick game check-in" },
  { icon: "groups", label: "Manage your teams" },
] as const;

export default function AuthLayout({
  children,
  title,
  subtitle,
  variant = "primary",
}: AuthLayoutProps) {
  const accent = ACCENT[variant];

  return (
    <div className="events-noise-overlay flex min-h-dvh bg-surface font-body-md text-on-surface">
      <aside className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden border-r border-surface-variant/50 bg-surface-bright lg:flex xl:w-[45%]">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.panel}`}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-1/4 left-0 h-72 w-72 rounded-full bg-secondary/[0.06] blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 flex flex-col gap-xl p-lg xl:p-xl">
          <StlLogo href="/" size="lg" showWordmark />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-md"
          >
            <h1 className={`text-headline-lg font-headline-lg uppercase leading-tight ${accent.headline}`}>
              {title}
            </h1>
            <p className="text-body-lg leading-relaxed text-on-surface-variant">{subtitle}</p>
          </motion.div>

          <ul className="flex flex-col gap-sm">
            {FEATURES.map((feature, i) => (
              <motion.li
                key={feature.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.15 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-3"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accent.feature}`}
                >
                  <MaterialSymbol icon={feature.icon} className="text-lg" />
                </span>
                <span className="text-body-lg text-on-surface">{feature.label}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 px-lg pb-lg text-body-md text-on-surface-variant xl:px-xl xl:pb-xl">
          Campus intramurals, reimagined.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-surface-variant/60 bg-surface-bright/90 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl items-center px-margin py-sm sm:px-lg">
            <StlLogo href="/" size="sm" showWordmark />
          </div>
        </header>

        <main className="relative flex flex-1 items-center justify-center overflow-y-auto px-margin py-md sm:px-lg sm:py-lg lg:py-xl">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
            aria-hidden
          >
            <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-secondary/[0.05] blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-xl xl:max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-md space-y-sm text-center lg:hidden sm:mb-lg"
            >
              <h1 className={`text-headline-lg-mobile font-headline-lg uppercase leading-tight sm:text-headline-lg ${accent.headline}`}>
                {title}
              </h1>
              <p className="mx-auto max-w-lg text-body-md leading-relaxed text-on-surface-variant sm:text-body-lg">
                {subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex min-h-[min(72vh,640px)] flex-col justify-center overflow-hidden rounded-2xl border bg-surface-container-lowest/95 backdrop-blur-sm ${accent.card}`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${accent.glow}`}
                aria-hidden
              />
              <div className="relative flex flex-1 flex-col justify-center p-lg sm:p-xl">{children}</div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
