interface ContentSkeletonProps {
  variant: "card-grid" | "table-rows";
  count?: number;
  gridClassName?: string;
}

export default function ContentSkeleton({
  variant,
  count,
  gridClassName,
}: ContentSkeletonProps) {
  if (variant === "table-rows") {
    const rows = count ?? 8;
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-2xl bg-surface-container-high"
          />
        ))}
      </div>
    );
  }

  const cards = count ?? 6;
  const grid =
    gridClassName ??
    "grid grid-cols-1 gap-sm md:grid-cols-2 md:gap-md xl:grid-cols-3";

  return (
    <div className={grid}>
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="h-96 animate-pulse rounded-2xl bg-surface-container-high"
        />
      ))}
    </div>
  );
}
