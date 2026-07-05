"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";

type AccentColor = "primary" | "secondary" | "tertiary";

interface SettingsSectionCardProps {
  title: string;
  icon: string;
  accentColor?: AccentColor;
  index?: number;
  children: ReactNode;
  className?: string;
}

const SHADE_MAP: Record<
  AccentColor,
  { card: string; hover: string; icon: string; glow: string }
> = {
  primary: {
    card: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.12)] border-primary/10",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,48,174,0.16)] hover:border-primary/20",
    icon: "text-primary bg-primary/[0.08] ring-primary/10",
    glow: "from-primary/[0.05] via-transparent to-transparent",
  },
  secondary: {
    card: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,102,136,0.12)] border-secondary/10",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,102,136,0.16)] hover:border-secondary/20",
    icon: "text-secondary bg-secondary/[0.08] ring-secondary/10",
    glow: "from-secondary/[0.05] via-transparent to-transparent",
  },
  tertiary: {
    card: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(61,65,67,0.1)] border-outline/10",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(61,65,67,0.14)] hover:border-outline/20",
    icon: "text-tertiary bg-tertiary/[0.08] ring-outline/10",
    glow: "from-tertiary/[0.04] via-transparent to-transparent",
  },
};

export default function SettingsSectionCard({
  title,
  icon,
  accentColor = "primary",
  index = 0,
  children,
  className = "",
}: SettingsSectionCardProps) {
  const shade = SHADE_MAP[accentColor];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group/card relative overflow-hidden rounded-2xl border bg-surface-container-lowest/95 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 ${shade.card} ${shade.hover} ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
        aria-hidden
      />

      <header className="relative flex items-center gap-2 border-b border-surface-variant/40 px-sm py-2.5 sm:px-md sm:py-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover/card:scale-105 ${shade.icon}`}
        >
          <MaterialSymbol icon={icon} />
        </div>
        <h2 className="text-headline-md font-headline-md uppercase tracking-wide text-on-surface">
          {title}
        </h2>
      </header>

      <div className="relative px-sm py-2 sm:px-md sm:py-3">{children}</div>
    </motion.section>
  );
}
