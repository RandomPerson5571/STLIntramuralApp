"use client";

import { motion } from "framer-motion";

interface SettingsToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function SettingsToggle({
  id,
  checked,
  onChange,
  disabled = false,
}: SettingsToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`group relative h-7 w-12 shrink-0 rounded-full border transition-[border-color,box-shadow,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked
          ? "border-primary/30 bg-primary shadow-[0_2px_8px_rgba(0,48,174,0.25)]"
          : "border-surface-variant bg-surface-container-high hover:border-outline/40"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-colors duration-200 ${
          checked
            ? "left-[calc(100%-1.375rem)] bg-on-primary"
            : "left-0.5 bg-surface-container-lowest group-hover:bg-white"
        }`}
        aria-hidden
      />
    </button>
  );
}
