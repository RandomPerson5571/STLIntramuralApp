import Link from "next/link";

export const CONTACT_EMAIL = "ethanguan5571@gmail.com";

type SiteFooterProps = {
  /** Single-line strip for tight layouts (e.g. landing). */
  compact?: boolean;
};

export default function SiteFooter({ compact = false }: SiteFooterProps) {
  if (compact) {
    return (
      <footer className="relative z-10 shrink-0 border-t border-surface-variant/60 px-margin py-sm md:px-lg lg:py-xs">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-md gap-y-1 text-center text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant">
          <span className="text-on-surface">STL Intramural</span>
          <span className="hidden text-outline sm:inline" aria-hidden>
            ·
          </span>
          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-primary"
          >
            Privacy
          </Link>
          <Link
            href="/terms-of-service"
            className="transition-colors hover:text-primary"
          >
            Terms
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="normal-case tracking-normal transition-colors hover:text-primary"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative z-10 shrink-0 border-t border-surface-variant/60 bg-surface-bright/60 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-md px-margin py-md md:flex-row md:items-start md:justify-between md:px-lg md:py-lg">
        <div className="space-y-1">
          <p className="text-label-sm font-label-sm uppercase tracking-widest text-on-surface">
            STL Intramural
          </p>
          <p className="max-w-xs text-body-md text-on-surface-variant">
            Campus intramurals, reimagined.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-xl gap-y-md">
          <div className="space-y-2">
            <p className="text-label-sm font-label-sm uppercase tracking-widest text-outline">
              Legal
            </p>
            <ul className="space-y-1.5 text-body-md">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-on-surface-variant transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-on-surface-variant transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-label-sm font-label-sm uppercase tracking-widest text-outline">
              Contact
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block text-body-md text-on-surface-variant transition-colors hover:text-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-variant/40 px-margin py-sm text-center text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant md:px-lg">
        © {new Date().getFullYear()} STL Intramural
      </div>
    </footer>
  );
}
