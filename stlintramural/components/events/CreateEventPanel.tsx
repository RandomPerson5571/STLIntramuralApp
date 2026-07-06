"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { INPUT_CLASS, LABEL_CLASS } from "@/components/ui/form-styles";
import {
  DEFAULT_CREATE_EVENT_DRAFT,
  type CreateEventDraft,
} from "@/lib/event-create-data";

interface CreateEventPanelProps {
  open: boolean;
  onClose: () => void;
  draft: CreateEventDraft;
  onDraftChange: (updates: Partial<CreateEventDraft>) => void;
  onReset: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

function PanelSection({
  title,
  icon,
  accentColor,
  index,
  children,
}: {
  title: string;
  icon: string;
  accentColor: "primary" | "secondary" | "tertiary";
  index: number;
  children: React.ReactNode;
}) {
  const shade = {
    primary: {
      border: "border-primary/10",
      icon: "text-primary bg-primary/[0.08] ring-primary/10",
      glow: "from-primary/[0.05] via-transparent to-transparent",
    },
    secondary: {
      border: "border-secondary/10",
      icon: "text-secondary bg-secondary/[0.08] ring-secondary/10",
      glow: "from-secondary/[0.05] via-transparent to-transparent",
    },
    tertiary: {
      border: "border-outline/10",
      icon: "text-tertiary bg-tertiary/[0.08] ring-outline/10",
      glow: "from-tertiary/[0.04] via-transparent to-transparent",
    },
  }[accentColor];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.08 + index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative overflow-hidden rounded-2xl border bg-surface-container-lowest/95 backdrop-blur-sm ${shade.border}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${shade.glow}`}
        aria-hidden
      />
      <header className="relative flex items-center gap-2 border-b border-surface-variant/40 px-sm py-2.5">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 ${shade.icon}`}
        >
          <MaterialSymbol icon={icon} />
        </div>
        <h3 className="text-headline-md font-headline-md uppercase tracking-wide text-on-surface">
          {title}
        </h3>
      </header>
      <div className="relative px-sm py-3">{children}</div>
    </motion.section>
  );
}

export default function CreateEventPanel({
  open,
  onClose,
  draft,
  onDraftChange,
  onReset,
  onSubmit,
  isSubmitting = false,
  submitError = null,
}: CreateEventPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const updateLink = (index: number, value: string) => {
    const next = [...draft.externalLinks];
    next[index] = value;
    onDraftChange({ externalLinks: next });
  };

  const addLink = () => {
    onDraftChange({ externalLinks: [...draft.externalLinks, ""] });
  };

  const removeLink = (index: number) => {
    if (draft.externalLinks.length <= 1) {
      onDraftChange({ externalLinks: [""] });
      return;
    }
    onDraftChange({
      externalLinks: draft.externalLinks.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close create event panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[10000] bg-on-surface/[0.32] backdrop-blur-[2px] motion-reduce:transition-none"
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[10001] m-auto flex h-fit max-h-[min(90dvh,52rem)] w-[min(calc(100vw-2rem),42rem)] flex-col overflow-hidden rounded-2xl border border-surface-variant/60 bg-gradient-to-b from-surface-bright via-surface to-surface-container-low/50 shadow-[0_24px_80px_rgba(26,28,31,0.18)] backdrop-blur-xl motion-reduce:transition-none lg:w-[min(calc(100vw-4rem),48rem)]"
          >
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden
            >
              <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" />
              <div className="absolute bottom-24 left-0 h-48 w-48 rounded-full bg-secondary/[0.05] blur-3xl" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjAzIi8+PC9zdmc+')] opacity-60 mix-blend-overlay" />
            </div>

            <header className="relative z-10 flex shrink-0 items-start justify-between gap-sm border-b border-surface-variant/60 px-md py-md">
              <div>
                <p className="mb-1 text-label-sm font-label-sm uppercase tracking-[0.2em] text-primary">
                  Admin
                </p>
                <h2
                  id={titleId}
                  className="text-headline-lg font-headline-lg uppercase leading-none text-on-surface slanted-accent"
                >
                  Create Event
                </h2>
                <p className="mt-1 max-w-md text-body-md text-on-surface-variant">
                  Draft a new intramural event for students to discover and register for.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-variant/70 bg-surface-container-lowest/80 text-on-surface-variant transition-[transform,border-color,color,box-shadow] duration-200 hover:border-primary/30 hover:text-primary hover:shadow-[0_4px_16px_rgba(0,48,174,0.12)] active:scale-95 motion-reduce:transform-none"
              >
                <MaterialSymbol
                  icon="close"
                  className="transition-transform duration-200 group-hover:rotate-90 motion-reduce:transform-none"
                />
              </button>
            </header>

            <form
              onSubmit={handleSubmit}
              className="relative z-10 flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-sm overflow-y-auto px-md py-md">
                <PanelSection
                  title="Event Details"
                  icon="sports"
                  accentColor="primary"
                  index={0}
                >
                  <div className="flex flex-col gap-sm">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-title" className={LABEL_CLASS}>
                        Title
                      </label>
                      <input
                        id="event-title"
                        type="text"
                        value={draft.title}
                        onChange={(e) =>
                          onDraftChange({ title: e.target.value })
                        }
                        placeholder="Friday Night Basketball"
                        className={INPUT_CLASS}
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-description" className={LABEL_CLASS}>
                        Description
                      </label>
                      <textarea
                        id="event-description"
                        value={draft.description}
                        onChange={(e) =>
                          onDraftChange({ description: e.target.value })
                        }
                        placeholder="Format, skill level, what to bring…"
                        rows={4}
                        className={`${INPUT_CLASS} min-h-[7rem] resize-y`}
                      />
                    </div>
                  </div>
                </PanelSection>

                <PanelSection
                  title="Schedule & Location"
                  icon="schedule"
                  accentColor="secondary"
                  index={1}
                >
                  <div className="flex flex-col gap-sm">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-location" className={LABEL_CLASS}>
                        Location
                      </label>
                      <div className="relative">
                        <MaterialSymbol
                          icon="location_on"
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                        />
                        <input
                          id="event-location"
                          type="text"
                          value={draft.location}
                          onChange={(e) =>
                            onDraftChange({ location: e.target.value })
                          }
                          placeholder="Main Rec Center, Court 1"
                          className={`${INPUT_CLASS} pl-10`}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="grid gap-sm sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-start" className={LABEL_CLASS}>
                        Start
                      </label>
                      <div className="relative">
                        <MaterialSymbol
                          icon="event"
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                        />
                        <input
                          id="event-start"
                          type="datetime-local"
                          value={draft.startDate}
                          onChange={(e) =>
                            onDraftChange({ startDate: e.target.value })
                          }
                          className={`${INPUT_CLASS} pl-10`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-end" className={LABEL_CLASS}>
                        End
                      </label>
                      <div className="relative">
                        <MaterialSymbol
                          icon="event_available"
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                        />
                        <input
                          id="event-end"
                          type="datetime-local"
                          value={draft.endDate}
                          onChange={(e) =>
                            onDraftChange({ endDate: e.target.value })
                          }
                          className={`${INPUT_CLASS} pl-10`}
                        />
                      </div>
                    </div>
                    </div>
                  </div>
                </PanelSection>

                <PanelSection
                  title="Capacity & Points"
                  icon="groups"
                  accentColor="tertiary"
                  index={2}
                >
                  <div className="grid gap-sm sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-capacity" className={LABEL_CLASS}>
                        Max Attendees
                      </label>
                      <div className="relative">
                        <MaterialSymbol
                          icon="person"
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                        />
                        <input
                          id="event-capacity"
                          type="number"
                          min={1}
                          value={draft.maxAttendees}
                          onChange={(e) =>
                            onDraftChange({ maxAttendees: e.target.value })
                          }
                          placeholder="Optional"
                          className={`${INPUT_CLASS} pl-10`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-points" className={LABEL_CLASS}>
                        Points Awarded
                      </label>
                      <div className="relative">
                        <MaterialSymbol
                          icon="stars"
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                        />
                        <input
                          id="event-points"
                          type="number"
                          min={0}
                          value={draft.pointsAwarded}
                          onChange={(e) =>
                            onDraftChange({ pointsAwarded: e.target.value })
                          }
                          className={`${INPUT_CLASS} pl-10`}
                        />
                      </div>
                    </div>
                  </div>
                </PanelSection>

                <PanelSection
                  title="External Links"
                  icon="link"
                  accentColor="primary"
                  index={3}
                >
                  <div className="flex flex-col gap-sm">
                    {draft.externalLinks.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative min-w-0 flex-1">
                          <MaterialSymbol
                            icon="open_in_new"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
                          />
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => updateLink(index, e.target.value)}
                            placeholder="https://…"
                            className={`${INPUT_CLASS} pl-10`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          aria-label={`Remove link ${index + 1}`}
                          className="flex h-[46px] w-11 shrink-0 items-center justify-center rounded-xl border border-surface-variant/70 bg-surface text-outline transition-[border-color,color,transform] duration-200 hover:border-error/30 hover:text-error active:scale-95 motion-reduce:transform-none"
                        >
                          <MaterialSymbol icon="remove" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLink}
                      className="inline-flex items-center gap-1.5 self-start rounded-xl border border-dashed border-primary/25 bg-primary/[0.04] px-3 py-2 text-label-sm font-label-sm uppercase tracking-wider text-primary transition-[border-color,background-color,transform] duration-200 hover:border-primary/40 hover:bg-primary/[0.08] active:scale-[0.98] motion-reduce:transform-none"
                    >
                      <MaterialSymbol icon="add" className="text-sm" />
                      Add Link
                    </button>
                  </div>
                </PanelSection>
              </div>

              <footer className="relative z-10 shrink-0 border-t border-surface-variant/60 bg-surface-container-lowest/80 px-md py-md backdrop-blur-sm">
                {submitError ? (
                  <p className="mb-sm text-body-sm text-error" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                    }}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-variant/70 px-4 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant transition-[border-color,color] duration-200 hover:border-outline hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MaterialSymbol icon="restart_alt" className="text-base" />
                    Reset Draft
                  </button>
                  <div className="flex flex-col gap-xs sm:flex-row">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-xl border border-surface-variant/70 px-4 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface transition-[border-color] duration-200 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.25)] transition-[transform,box-shadow,opacity] duration-200 hover:shadow-[0_6px_20px_rgba(0,48,174,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none"
                    >
                      <MaterialSymbol
                        icon={isSubmitting ? "hourglass_top" : "publish"}
                        className="text-base transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none"
                      />
                      {isSubmitting ? "Creating…" : "Create Event"}
                    </button>
                  </div>
                </div>
              </footer>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}