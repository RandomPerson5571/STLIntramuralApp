"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";

const EASE = [0.22, 1, 0.36, 1] as const;

interface EventDetailPreloaderProps {
  title: string;
  icon: string;
  visible: boolean;
}

export default function EventDetailPreloader({
  title,
  icon,
  visible,
}: EventDetailPreloaderProps) {
  const reducedMotion = useReducedMotion();
  const words = title.split(" ");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.04, filter: "blur(8px)" }
          }
          transition={{ duration: reducedMotion ? 0.2 : 0.55, ease: EASE }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface"
          aria-hidden={!visible}
        >
          <motion.div
            initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mb-md flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/[0.08] ring-1 ring-primary/15"
          >
            <MaterialSymbol icon={icon} className="text-display-xl text-primary" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-x-2 px-margin">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.08 + i * 0.06,
                  ease: EASE,
                }}
                className="text-[clamp(1.5rem,5vw,2.5rem)] font-display-xl uppercase leading-none tracking-wide text-on-surface"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={reducedMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-md h-0.5 w-24 origin-left rounded-full bg-primary/40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
