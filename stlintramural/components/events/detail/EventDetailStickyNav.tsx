"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";

interface EventDetailStickyNavProps {
  title: string;
}

export default function EventDetailStickyNav({ title }: EventDetailStickyNavProps) {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 80);
    if (reducedMotion) return;
    if (latest > previous && latest > 120) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      initial={reducedMotion ? false : { opacity: 0, y: -12 }}
      animate={{
        opacity: 1,
        y: hidden && !reducedMotion ? -72 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-30 border-b transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-surface-variant/60 bg-surface/80 shadow-[0_4px_24px_rgba(26,28,31,0.06)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-sm px-margin py-sm md:px-lg">
        <Link
          href="/events"
          className="group inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant transition-[color,transform] duration-200 hover:text-primary active:scale-[0.98]"
        >
          <MaterialSymbol
            icon="arrow_back"
            className="text-base transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Events
        </Link>

        <p
          className={`max-w-[50%] truncate text-label-sm font-label-sm uppercase tracking-wider transition-opacity duration-300 ${
            scrolled ? "text-on-surface opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {title}
        </p>

        <Link
          href="#register"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-label-sm font-label-sm uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)] active:scale-[0.98]"
        >
          Register
          <MaterialSymbol icon="arrow_downward" className="text-sm" />
        </Link>
      </div>
    </motion.header>
  );
}
