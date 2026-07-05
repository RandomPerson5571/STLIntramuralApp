import Image from "next/image";
import Link from "next/link";

const LOGO_SIZES = {
  sm: { box: "h-9 w-9", px: 36 },
  md: { box: "h-10 w-10", px: 40 },
  lg: { box: "h-11 w-11", px: 44 },
} as const;

type LogoSize = keyof typeof LOGO_SIZES;

interface StlLogoProps {
  size?: LogoSize;
  showWordmark?: boolean;
  tagline?: string;
  href?: string;
  className?: string;
  wordmarkClassName?: string;
  priority?: boolean;
}

export default function StlLogo({
  size = "md",
  showWordmark = false,
  tagline,
  href,
  className = "",
  wordmarkClassName = "",
  priority = false,
}: StlLogoProps) {
  const { box, px } = LOGO_SIZES[size];

  const content = (
    <>
      <div className={`relative shrink-0 overflow-hidden rounded-full ${box}`}>
        <Image
          src="/logo.png"
          alt="STL Intramural Council logo featuring a blue roaring lion silhouette with STL text inside and Intramural Council curved along the bottom"
          width={px}
          height={px}
          className="h-full w-full object-cover"
          priority={priority}
        />
      </div>
      {(showWordmark || tagline) && (
        <div className="min-w-0">
          {showWordmark && (
            <span
              className={`block truncate text-headline-md font-headline-md uppercase leading-none tracking-tight text-primary ${wordmarkClassName}`}
            >
              STL Intramural
            </span>
          )}
          {tagline && (
            <p className="mt-0.5 truncate text-label-sm font-label-sm text-on-surface-variant">
              {tagline}
            </p>
          )}
        </div>
      )}
    </>
  );

  const wrapperClass = `inline-flex items-center gap-3 ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${wrapperClass} w-fit transition-opacity hover:opacity-80`}
      >
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
