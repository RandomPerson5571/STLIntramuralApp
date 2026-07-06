"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { INPUT_CLASS } from "@/components/ui/form-styles";
import {
  getCreateShopItemErrorMessage,
  useCreateShopItem,
} from "@/hooks/useCreateShopItem";
import {
  EMPTY_SHOP_ITEM_DRAFT,
  type ShopItemDraft,
} from "@/lib/shop-create-data";
import { SHOP_ITEM_CATEGORIES } from "@/types/shop";

const ICON_OPTIONS = [
  "checkroom",
  "water_drop",
  "styler",
  "backpack",
  "confirmation_number",
  "local_cafe",
  "redeem",
  "sports_soccer",
  "sports_basketball",
  "fitness_center",
  "emoji_events",
  "restaurant",
] as const;

interface ShopItemCreationPanelProps {
  open: boolean;
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function ShopFormField({
  id,
  label,
  hint,
  icon,
  children,
  delay = 0,
}: {
  id: string;
  label: string;
  hint?: string;
  icon?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
      className="flex flex-col gap-1.5"
    >
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant"
      >
        {icon ? <MaterialSymbol icon={icon} className="text-sm text-outline" /> : null}
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-body-sm text-on-surface-variant/80">{hint}</p>
      ) : null}
    </motion.div>
  );
}

function DraftPreviewCard({ draft }: { draft: ShopItemDraft }) {
  const hasImage = draft.imageUrl.trim().length > 0;
  const displayTitle = draft.title.trim() || "Untitled Item";
  const displayDescription =
    draft.description.trim() || "Add a description to preview how buyers will see this reward.";

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-surface-container-lowest/95 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.14)] backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-primary/[0.02] to-transparent"
        aria-hidden
      />

      <div className="relative h-40 overflow-hidden sm:h-44">
        {hasImage ? (
          <Image
            src={draft.imageUrl.trim()}
            alt={displayTitle}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container">
            <MaterialSymbol icon={draft.icon} className="text-display-xl text-outline-variant" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 rounded-xl bg-primary/[0.08] px-2.5 py-1 text-label-sm font-label-sm uppercase text-primary backdrop-blur-sm">
          {Math.max(0, draft.cost).toLocaleString()} pts
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/[0.08] px-2 py-0.5 text-label-sm font-label-sm uppercase text-primary ring-1 ring-primary/10">
            <MaterialSymbol icon={draft.icon} className="text-sm" />
            {draft.category}
          </span>
          <span className="text-label-sm font-label-sm uppercase text-on-surface-variant">
            {Math.max(0, draft.stock)} left
          </span>
        </div>
        <h3 className="mb-1 text-headline-md font-headline-md uppercase text-on-surface">
          {displayTitle}
        </h3>
        <p className="line-clamp-3 text-body-md text-on-surface-variant">{displayDescription}</p>
      </div>
    </article>
  );
}

export default function ShopItemCreationPanel({ open, onClose }: ShopItemCreationPanelProps) {
  const formId = useId();
  const createShopItem = useCreateShopItem();
  const [draft, setDraft] = useState<ShopItemDraft>(EMPTY_SHOP_ITEM_DRAFT);
  const [touched, setTouched] = useState(false);

  const isValid = draft.title.trim().length > 0 && draft.cost > 0 && draft.stock >= 0;
  const submitError = getCreateShopItemErrorMessage(createShopItem.error);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !createShopItem.isPending) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, createShopItem.isPending]);

  useEffect(() => {
    if (!open) {
      setDraft(EMPTY_SHOP_ITEM_DRAFT);
      setTouched(false);
      createShopItem.reset();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateDraft(updates: Partial<ShopItemDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!isValid || createShopItem.isPending) return;

    void createShopItem
      .mutateAsync(draft)
      .then(() => {
        setDraft(EMPTY_SHOP_ITEM_DRAFT);
        setTouched(false);
        onClose();
      })
      .catch(() => {
        // Error surfaces via createShopItem.error.
      });
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close creation panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${formId}-title`}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-surface-variant/60 bg-surface-container-lowest/95 shadow-[-8px_0_40px_rgba(26,28,31,0.12)] backdrop-blur-xl lg:max-w-3xl"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.05]"
              aria-hidden
            />

            <header className="relative flex shrink-0 items-start justify-between gap-sm border-b border-surface-variant/50 px-sm py-sm sm:px-md sm:py-md">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="mb-1 text-label-sm font-label-sm uppercase tracking-[0.2em] text-secondary"
                >
                  Admin · Shop
                </motion.p>
                <motion.h2
                  id={`${formId}-title`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
                  className="text-headline-lg font-headline-lg uppercase text-on-surface"
                >
                  New Reward
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                  className="mt-1 max-w-md text-body-md text-on-surface-variant"
                >
                  List a new item for students to redeem with intramural points.
                </motion.p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-variant/70 bg-surface text-on-surface-variant transition-[transform,border-color,color] duration-200 hover:border-primary/30 hover:text-primary active:scale-[0.97]"
              >
                <MaterialSymbol icon="close" />
              </button>
            </header>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <form
                id={formId}
                onSubmit={handleSubmit}
                noValidate
                className="flex min-h-0 flex-1 flex-col overflow-y-auto px-sm py-sm sm:px-md sm:py-md lg:w-[58%]"
              >
                <div className="flex flex-col gap-sm">
                  <ShopFormField id={`${formId}-title`} label="Title" icon="title" delay={0.08}>
                    <input
                      id={`${formId}-title`}
                      type="text"
                      value={draft.title}
                      onChange={(e) => updateDraft({ title: e.target.value })}
                      placeholder="STL Intramural Hoodie"
                      className={INPUT_CLASS}
                      aria-invalid={touched && !draft.title.trim()}
                    />
                  </ShopFormField>

                  <ShopFormField
                    id={`${formId}-description`}
                    label="Description"
                    icon="description"
                    hint="Describe the reward. Image URLs in the description are supported today."
                    delay={0.12}
                  >
                    <textarea
                      id={`${formId}-description`}
                      value={draft.description}
                      onChange={(e) => updateDraft({ description: e.target.value })}
                      placeholder="Premium fleece hoodie with embroidered logo…"
                      rows={4}
                      className={`${INPUT_CLASS} resize-none`}
                    />
                  </ShopFormField>

                  <div className="grid gap-sm sm:grid-cols-2">
                    <ShopFormField id={`${formId}-cost`} label="Point Cost" icon="stars" delay={0.16}>
                      <input
                        id={`${formId}-cost`}
                        type="number"
                        min={1}
                        step={1}
                        value={draft.cost}
                        onChange={(e) =>
                          updateDraft({ cost: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className={INPUT_CLASS}
                        aria-invalid={touched && draft.cost <= 0}
                      />
                    </ShopFormField>

                    <ShopFormField
                      id={`${formId}-stock`}
                      label="Stock"
                      icon="inventory_2"
                      delay={0.18}
                    >
                      <input
                        id={`${formId}-stock`}
                        type="number"
                        min={0}
                        step={1}
                        value={draft.stock}
                        onChange={(e) =>
                          updateDraft({ stock: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className={INPUT_CLASS}
                      />
                    </ShopFormField>
                  </div>

                  <ShopFormField
                    id={`${formId}-image`}
                    label="Image URL"
                    icon="image"
                    hint="Optional. Shown on the card when provided."
                    delay={0.2}
                  >
                    <input
                      id={`${formId}-image`}
                      type="url"
                      value={draft.imageUrl}
                      onChange={(e) => updateDraft({ imageUrl: e.target.value })}
                      placeholder="https://…"
                      className={INPUT_CLASS}
                    />
                  </ShopFormField>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.22, ease: EASE }}
                    className="flex flex-col gap-1.5"
                  >
                    <span className="flex items-center gap-1.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                      <MaterialSymbol icon="category" className="text-sm text-outline" />
                      Category
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SHOP_ITEM_CATEGORIES.map((category) => {
                        const isActive = draft.category === category;

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => updateDraft({ category })}
                            className={`rounded-xl px-3 py-2 text-label-sm font-label-sm uppercase transition-[transform,background-color,color,box-shadow] duration-200 active:scale-[0.98] ${
                              isActive
                                ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
                                : "border border-surface-variant/70 bg-surface text-on-surface-variant hover:border-primary/20 hover:text-on-surface"
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.26, ease: EASE }}
                    className="flex flex-col gap-1.5"
                  >
                    <span className="flex items-center gap-1.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                      <MaterialSymbol icon="emoji_objects" className="text-sm text-outline" />
                      Icon
                    </span>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {ICON_OPTIONS.map((icon) => {
                        const isActive = draft.icon === icon;

                        return (
                          <button
                            key={icon}
                            type="button"
                            aria-label={`Select ${icon} icon`}
                            aria-pressed={isActive}
                            onClick={() => updateDraft({ icon })}
                            className={`flex aspect-square items-center justify-center rounded-xl border transition-[transform,background-color,border-color,box-shadow] duration-200 active:scale-[0.95] ${
                              isActive
                                ? "border-primary/30 bg-primary/[0.1] text-primary shadow-[0_4px_12px_rgba(0,48,174,0.15)]"
                                : "border-surface-variant/70 bg-surface text-on-surface-variant hover:border-secondary/30 hover:text-secondary"
                            }`}
                          >
                            <MaterialSymbol icon={icon} className="text-xl" />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </form>

              <div className="relative hidden shrink-0 flex-col border-l border-surface-variant/40 bg-surface-container-low/40 px-md py-md lg:flex lg:w-[42%]">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
                  className="mb-sm"
                >
                  <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                    Live Preview
                  </p>
                  <p className="mt-0.5 text-body-sm text-on-surface-variant/80">
                    How this item will appear in the shop grid.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                  className="sticky top-0"
                >
                  <DraftPreviewCard draft={draft} />
                </motion.div>
              </div>
            </div>

            <footer className="relative shrink-0 border-t border-surface-variant/50 bg-surface-container-lowest/80 px-sm py-sm backdrop-blur-sm sm:px-md sm:py-md">
              <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
                <p
                  className={`text-body-sm ${submitError ? "text-error" : "text-on-surface-variant"}`}
                  role={submitError ? "alert" : undefined}
                >
                  {submitError
                    ? submitError
                    : touched && !isValid
                      ? "Title and a point cost greater than zero are required."
                      : "Save to publish this reward in the shop."}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={createShopItem.isPending}
                    className="rounded-xl border border-surface-variant/70 bg-surface px-4 py-2.5 text-label-sm font-label-sm uppercase text-on-surface transition-[transform,border-color,opacity] duration-200 hover:border-outline active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form={formId}
                    disabled={!isValid || createShopItem.isPending}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.25)] transition-[transform,box-shadow,opacity] duration-200 hover:shadow-[0_6px_20px_rgba(0,48,174,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MaterialSymbol
                      icon={createShopItem.isPending ? "hourglass_top" : "add_shopping_cart"}
                      className="text-base transition-transform duration-300 group-hover:scale-110"
                    />
                    {createShopItem.isPending ? "Creating…" : "Create Item"}
                  </button>
                </div>
              </div>

              <div className="mt-sm lg:hidden">
                <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                  Preview
                </p>
                <DraftPreviewCard draft={draft} />
              </div>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
