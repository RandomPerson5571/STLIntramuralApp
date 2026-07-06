"use client";

import { useState } from "react";
import CreateEventPanel from "@/components/events/CreateEventPanel";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import CreateShopItemWidget from "@/components/shop/CreateShopItemWidget";
import { useCreateEventPanel } from "@/hooks/useCreateEventPanel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  canCreateEvents,
  canCreateShopItems,
} from "@/lib/permissions";
import { ADMIN_QUICK_ACTIONS, type AdminSection } from "@/lib/constants/admin-nav";

const CARD_CLASS =
  "group flex flex-col items-start gap-sm rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/80 p-md text-left backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,48,174,0.12)] active:scale-[0.98] motion-reduce:transform-none";

const DISABLED_CARD_CLASS =
  "group flex flex-col items-start gap-sm rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/80 p-md text-left opacity-70 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-200 disabled:cursor-not-allowed";

export default function AdminQuickActions({
  onNavigate,
}: {
  onNavigate: (section: AdminSection) => void;
}) {
  const { data: user, isPending } = useCurrentUser();
  const { handleOpen, panelProps } = useCreateEventPanel();
  const [shopOpen, setShopOpen] = useState(false);

  if (isPending) {
    return null;
  }

  const canCreateEvent = canCreateEvents(user);
  const canCreateShop = canCreateShopItems(user);

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "create-event":
        handleOpen();
        break;
      case "add-shop-item":
        setShopOpen(true);
        break;
      case "manage-users":
        onNavigate("users");
        break;
    }
  };

  const isActionDisabled = (actionId: string) => {
    if (actionId === "export-report") return true;
    if (actionId === "create-event") return !canCreateEvent;
    if (actionId === "add-shop-item") return !canCreateShop;
    return false;
  };

  return (
    <>
      <div className="grid gap-sm sm:grid-cols-2">
        {ADMIN_QUICK_ACTIONS.map((action) => {
          const disabled = isActionDisabled(action.id);
          const isComingSoon = action.id === "export-report";

          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled}
              onClick={() => handleAction(action.id)}
              className={disabled ? DISABLED_CARD_CLASS : CARD_CLASS}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant transition-colors duration-200 group-hover:bg-primary/[0.1] group-hover:text-primary">
                <MaterialSymbol icon={action.icon} />
              </span>
              <div>
                <p className="text-body-md font-body-md text-on-surface">
                  {action.label}
                </p>
                <p className="mt-0.5 text-body-sm font-body-sm text-on-surface-variant">
                  {action.description}
                </p>
                {isComingSoon ? (
                  <p className="mt-1 text-label-sm font-label-sm text-outline">
                    Coming soon
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {canCreateEvent ? <CreateEventPanel {...panelProps} /> : null}

      <CreateShopItemWidget open={shopOpen} onOpenChange={setShopOpen} />
    </>
  );
}
