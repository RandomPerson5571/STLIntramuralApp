"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import StlLogo from "@/components/StlLogo";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { SIDE_NAV_ITEMS } from "@/lib/navigation";

const PRIMARY_NAV = SIDE_NAV_ITEMS.slice(0, 2);
const SECONDARY_NAV = SIDE_NAV_ITEMS.slice(2);

function NavLink({
  item,
  isActive,
}: {
  item: (typeof SIDE_NAV_ITEMS)[number];
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-[transform,background-color,box-shadow,color] duration-200 ${
        isActive
          ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
          : "text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface active:scale-[0.98]"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
          isActive
            ? "bg-white/15"
            : "bg-surface-container-low group-hover:bg-surface-container"
        }`}
      >
        <MaterialSymbol
          icon={item.icon}
          filled={item.filled && isActive}
          className={isActive ? "text-on-primary" : "text-on-surface-variant group-hover:text-primary"}
        />
      </span>
      <span
        className={`text-label-sm font-label-sm ${isActive ? "uppercase tracking-wide" : ""}`}
      >
        {item.label}
      </span>
      {isActive && (
        <span
          className="absolute right-3 h-1.5 w-1.5 rounded-full bg-on-primary/80"
          aria-hidden
        />
      )}
    </Link>
  );
}

export default function EventsSideNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-surface-variant/60 bg-gradient-to-b from-surface-bright via-surface to-surface-container-low/40 shadow-[4px_0_24px_rgba(26,28,31,0.04)] backdrop-blur-sm lg:flex">
      <div className="px-sm pt-lg pb-md">
        <div className="rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/90 p-sm shadow-[0_2px_12px_rgba(26,28,31,0.04)]">
          <StlLogo
            href="/"
            size="lg"
            showWordmark
            tagline="Play Hard. Win Big."
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-sm pb-sm">
        <p className="mb-1 px-3 text-label-sm font-label-sm uppercase tracking-widest text-outline">
          Main
        </p>
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.label} item={item} isActive={pathname === item.href} />
        ))}

        <div className="my-3 h-px bg-surface-variant/80" />

        <p className="mb-1 px-3 text-label-sm font-label-sm uppercase tracking-widest text-outline">
          More
        </p>
        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.label} item={item} isActive={pathname === item.href} />
        ))}
      </div>

      <div className="border-t border-surface-variant/60 p-sm">
        <div className="flex items-center gap-3 rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/80 p-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
            <MaterialSymbol icon="person" className="text-lg" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-md font-body-md text-on-surface">Player</p>
            <p className="truncate text-label-sm font-label-sm text-on-surface-variant">
              1,240 pts
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
