"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
  filledIcon?: boolean;
  shape?: "xl" | "2xl";
}

export function FilterPill({
  active,
  onClick,
  children,
  icon,
  filledIcon = false,
  shape = "xl",
}: FilterPillProps) {
  const rounded = shape === "2xl" ? "rounded-2xl" : "rounded-xl";
  const base = `shrink-0 whitespace-nowrap ${rounded} px-3 py-2 text-label-sm font-label-sm uppercase transition-[transform,background-color,box-shadow,color,border-color] duration-200 active:scale-[0.98]`;

  const activeClass =
    shape === "2xl"
      ? "border-primary/20 bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
      : "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]";

  const inactiveClass =
    shape === "2xl"
      ? "border border-surface-variant/70 bg-surface-container-lowest/80 text-on-surface-variant hover:border-primary/15 hover:bg-surface-container-low hover:text-on-surface"
      : "border border-surface-variant/70 bg-surface-container-lowest/80 text-on-surface-variant hover:border-primary/20 hover:text-on-surface";

  const chipLayout = icon ? "group flex items-center gap-2 px-3.5 tracking-wide" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${chipLayout} ${active ? activeClass : inactiveClass}`}
    >
      {icon ? (
        <MaterialSymbol
          icon={icon}
          filled={filledIcon && active}
          className={`text-base ${active ? "text-on-primary" : "text-on-surface-variant group-hover:text-primary"}`}
        />
      ) : null}
      {children}
    </button>
  );
}

interface FilterPillGroupProps {
  variant?: "scroll" | "wrap";
  className?: string;
  children: React.ReactNode;
}

export function FilterPillGroup({
  variant = "scroll",
  className = "",
  children,
}: FilterPillGroupProps) {
  const layout =
    variant === "wrap"
      ? "flex flex-wrap gap-2"
      : "scrollbar-hide flex gap-2 overflow-x-auto pb-1";

  return <div className={`${layout} ${className}`}>{children}</div>;
}
