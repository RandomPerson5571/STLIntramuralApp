"use client";

import SettingsToggle from "@/components/settings/SettingsToggle";

interface SettingsRowProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  action?: React.ReactNode;
}

export default function SettingsRow({
  id,
  label,
  description,
  checked,
  onChange,
  action,
}: SettingsRowProps) {
  const hasToggle = checked !== undefined && onChange !== undefined;

  return (
    <div className="flex items-start justify-between gap-sm py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={hasToggle ? id : undefined}
          className="block text-body-md font-body-md text-on-surface"
        >
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-label-sm font-label-sm leading-relaxed text-on-surface-variant">
            {description}
          </p>
        )}
      </div>
      {hasToggle ? (
        <SettingsToggle id={id} checked={checked} onChange={onChange} />
      ) : (
        action
      )}
    </div>
  );
}
