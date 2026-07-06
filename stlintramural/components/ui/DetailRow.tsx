interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

export default function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-md">
      <dt className="shrink-0 text-label-sm font-label-sm uppercase tracking-wide text-outline">
        {label}
      </dt>
      <dd className="text-body-sm font-body-sm text-on-surface sm:text-right">
        {value}
      </dd>
    </div>
  );
}
