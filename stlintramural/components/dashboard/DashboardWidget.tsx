"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";

type AccentColor = "primary" | "secondary" | "tertiary";
type WidgetVariant = "default" | "featured" | "dark";

interface DashboardWidgetProps {
  title: string;
  icon: string;
  accentColor?: AccentColor;
  variant?: WidgetVariant;
  index: number;
  children: ReactNode;
  className?: string;
  hideHeader?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export function WidgetSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3" aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`rounded-lg bg-surface-container-high ${i === 0 ? "h-8 w-2/3" : "h-4 w-full"}`}
        />
      ))}
    </div>
  );
}

export function WidgetErrorState({
  message = "Could not load data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <MaterialSymbol icon="error_outline" className="text-2xl text-outline" />
      <p className="text-body-md text-on-surface-variant">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-outline-variant px-3 py-1 text-label-sm font-label-sm uppercase text-on-surface transition-colors hover:border-primary hover:text-primary"
        >
          Retry
        </button>
      )}
    </div>
  );
}

const SHADE_MAP: Record<AccentColor, { card: string; hover: string; icon: string; glow: string }> = {
  primary: {
    card: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.14)] border-primary/10",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.06),0_16px_40px_-8px_rgba(0,48,174,0.2)] hover:border-primary/20",
    icon: "text-primary bg-primary/[0.08] ring-primary/10",
    glow: "from-primary/[0.07] via-primary/[0.02] to-transparent",
  },
  secondary: {
    card: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,102,136,0.14)] border-secondary/10",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.06),0_16px_40px_-8px_rgba(0,102,136,0.2)] hover:border-secondary/20",
    icon: "text-secondary bg-secondary/[0.08] ring-secondary/10",
    glow: "from-secondary/[0.07] via-secondary/[0.02] to-transparent",
  },
  tertiary: {
    card: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(61,65,67,0.12)] border-outline/10",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.06),0_16px_40px_-8px_rgba(61,65,67,0.16)] hover:border-outline/20",
    icon: "text-tertiary bg-tertiary/[0.08] ring-outline/10",
    glow: "from-tertiary/[0.06] via-transparent to-transparent",
  },
};

const VARIANT_MAP: Record<WidgetVariant, string> = {
  default: "bg-surface-container-lowest/95",
  featured:
    "bg-gradient-to-br from-surface-container-lowest via-surface-bright to-primary/[0.04]",
  dark: "bg-gradient-to-br from-primary via-primary-container to-[#001355] text-on-primary border-primary/20",
};

export default function DashboardWidget({
  title,
  icon,
  accentColor = "primary",
  variant = "default",
  index,
  children,
  className = "",
  hideHeader = false,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}: DashboardWidgetProps) {
  const shade = SHADE_MAP[accentColor];
  const isDark = variant === "dark";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group/card relative self-start w-full overflow-hidden rounded-2xl border backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 ${VARIANT_MAP[variant]} ${shade.card} ${shade.hover} ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-2xl"
        aria-hidden
      />

      {!hideHeader && (
        <header
          className={`relative flex items-center gap-2 border-b px-sm py-2.5 sm:px-md sm:py-3 ${
            isDark ? "border-white/10" : "border-surface-variant/40"
          }`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover/card:scale-105 ${
              isDark ? "bg-white/15 text-on-primary ring-white/10" : shade.icon
            }`}
          >
            <MaterialSymbol icon={icon} />
          </div>
          <h2
            className={`text-headline-md font-headline-md uppercase tracking-wide ${
              isDark ? "text-on-primary" : "text-on-surface"
            }`}
          >
            {title}
          </h2>
        </header>
      )}

      <div className={`relative p-sm sm:p-md ${hideHeader ? "pt-sm sm:pt-md" : ""}`}>
        {isLoading ? (
          <WidgetSkeleton lines={3} />
        ) : isError ? (
          <WidgetErrorState message={errorMessage} onRetry={onRetry} />
        ) : (
          children
        )}
      </div>
    </motion.section>
  );
}
