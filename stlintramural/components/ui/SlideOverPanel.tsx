"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import MaterialSymbol from "@/components/events/MaterialSymbol";

interface SlideOverPanelProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  titleExtra?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeAriaLabel?: string;
}

export default function SlideOverPanel({
  open,
  onClose,
  title,
  subtitle,
  titleExtra,
  children,
  footer,
  closeAriaLabel = "Close",
}: SlideOverPanelProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label={closeAriaLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-surface-variant/60 bg-surface-container-lowest shadow-[-8px_0_32px_rgba(26,28,31,0.12)]"
          >
            <header className="flex items-start justify-between gap-sm border-b border-surface-variant/50 p-md">
              <div className="min-w-0">
                <p
                  id={titleId}
                  className="text-headline-sm font-headline-sm uppercase text-on-surface"
                >
                  {title}
                </p>
                {subtitle ? (
                  <p className="mt-1 text-body-sm font-body-sm text-on-surface-variant">
                    {subtitle}
                  </p>
                ) : null}
                {titleExtra}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-surface-variant/60 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
              >
                <MaterialSymbol icon="close" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-md">{children}</div>

            {footer ? (
              <footer className="flex flex-col gap-2 border-t border-surface-variant/50 p-md">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
