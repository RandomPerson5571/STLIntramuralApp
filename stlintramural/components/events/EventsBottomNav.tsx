"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { BOTTOM_NAV_ITEMS } from "@/lib/navigation";

export default function EventsBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface dark:bg-on-surface border-t-2 border-surface-variant shadow-lg fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 lg:hidden h-[72px]">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center px-4 py-1 scale-90 active:scale-100 transition-transform ${
              isActive
                ? "bg-primary-container text-on-primary-container rounded-xl"
                : "text-on-surface-variant dark:text-surface-variant active:bg-surface-container-high"
            }`}
          >
            <MaterialSymbol icon={item.icon} filled={item.filled && isActive} />
            <span className="text-label-sm font-label-sm mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
