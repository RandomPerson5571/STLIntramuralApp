"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import ShopItemCreationPanel from "@/components/shop/ShopItemCreationPanel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { canCreateShopItems } from "@/lib/permissions";

interface CreateShopItemWidgetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export default function CreateShopItemWidget({
  open: controlledOpen,
  onOpenChange,
  showTrigger = false,
}: CreateShopItemWidgetProps) {
  const { data: user, isPending } = useCurrentUser();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  function setOpen(next: boolean) {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  }

  if (isPending || !canCreateShopItems(user)) {
    return null;
  }

  return (
    <>
      {showTrigger ? (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-secondary/20 bg-gradient-to-br from-secondary/[0.08] via-surface-container-lowest to-primary/[0.06] px-4 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-secondary shadow-[0_2px_12px_rgba(0,102,136,0.12)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-[0_6px_24px_rgba(0,102,136,0.2)] active:scale-[0.98] motion-reduce:transform-none"
        >
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
            aria-hidden
          />
          <MaterialSymbol
            icon="add_shopping_cart"
            className="text-base transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none"
          />
          New Reward
        </motion.button>
      ) : null}

      <ShopItemCreationPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
