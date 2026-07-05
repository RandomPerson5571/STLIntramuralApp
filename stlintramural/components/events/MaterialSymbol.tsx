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
  return (
    <span
      className={`material-symbols-outlined ${filled ? "fill" : ""} ${className}`}
    >
      {icon}
    </span>
  );
}
