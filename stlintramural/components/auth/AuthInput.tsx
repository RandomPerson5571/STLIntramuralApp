"use client";

import MaterialSymbol from "@/components/events/MaterialSymbol";

type AccentVariant = "primary" | "secondary";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  autoComplete?: string;
  variant?: AccentVariant;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  describedBy?: string;
  required?: boolean;
}

const FOCUS_MAP: Record<AccentVariant, { input: string; icon: string }> = {
  primary: {
    input:
      "focus:border-primary/40 focus:ring-primary/15 focus:shadow-[0_4px_14px_rgba(0,48,174,0.1)]",
    icon: "group-focus-within:text-primary",
  },
  secondary: {
    input:
      "focus:border-secondary/40 focus:ring-secondary/15 focus:shadow-[0_4px_14px_rgba(0,102,136,0.1)]",
    icon: "group-focus-within:text-secondary",
  },
};

export default function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  autoComplete,
  variant = "primary",
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error,
  describedBy,
  required = false,
}: AuthInputProps) {
  const errorClass = error ? "border-error/50 focus:border-error/50 focus:ring-error/15" : "";
  const ariaDescribedBy =
    [describedBy, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant"
      >
        {label}
      </label>
      <div className="group relative">
        {icon ? (
          <MaterialSymbol
            icon={icon}
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline transition-colors duration-200 ${FOCUS_MAP[variant].icon}`}
          />
        ) : null}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={ariaDescribedBy}
          className={`w-full rounded-xl border border-surface-variant/70 bg-surface py-3.5 text-body-md text-on-surface outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-outline/50 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_MAP[variant].input} ${errorClass} ${
            icon ? "pl-10 pr-3" : "px-3"
          }`}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-body-md text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
