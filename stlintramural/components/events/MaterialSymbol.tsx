import { resolveLucideIcon } from "@/lib/icon-map";

interface MaterialSymbolProps {
  icon: string;
  filled?: boolean;
  className?: string;
}

export default function MaterialSymbol({
  icon,
  filled = false,
  className = "",
}: MaterialSymbolProps) {
  const LucideIcon = resolveLucideIcon(icon);

  return (
    <LucideIcon
      className={`shrink-0 ${className}`}
      aria-hidden
      fill={filled ? "currentColor" : "none"}
      strokeWidth={filled ? 1.75 : 2}
    />
  );
}
