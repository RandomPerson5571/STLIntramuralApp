"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";

interface SortSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
  fullWidth?: boolean;
}

export default function SortSelect<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  fullWidth = false,
}: SortSelectProps<T>) {
  return (
    <div className="relative shrink-0">
      <MaterialSymbol
        icon="sort"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={ariaLabel}
        className={`appearance-none rounded-xl border border-surface-variant/70 bg-surface-container-lowest/80 py-2 pl-10 pr-8 text-label-sm font-label-sm uppercase text-on-surface transition-[border-color,box-shadow] duration-200 hover:border-secondary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${fullWidth ? "w-full lg:w-auto" : "w-auto"}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <MaterialSymbol
        icon="expand_more"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
    </div>
  );
}
