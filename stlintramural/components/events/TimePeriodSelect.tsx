"use client";

import type { TimePeriod } from "@/types/event";
import { TIME_PERIODS } from "@/lib/events-data";
import MaterialSymbol from "@/components/events/MaterialSymbol";

interface TimePeriodSelectProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export default function TimePeriodSelect({
  value,
  onChange,
}: TimePeriodSelectProps) {
  return (
    <div className="relative w-full shrink-0 md:w-48">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimePeriod)}
        className="w-full appearance-none rounded-xl border border-surface-variant/70 bg-surface-container-lowest/90 px-sm py-2 pr-8 text-label-sm font-label-sm uppercase text-on-surface shadow-[0_2px_8px_rgba(26,28,31,0.04)] transition-[border-color,box-shadow] duration-200 focus:border-primary/30 focus:outline-none focus:ring-0 focus:shadow-[0_4px_14px_rgba(0,48,174,0.12)]"
      >
        {TIME_PERIODS.map((period) => (
          <option key={period} value={period}>
            {period}
          </option>
        ))}
      </select>
      <MaterialSymbol
        icon="arrow_drop_down"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
    </div>
  );
}
