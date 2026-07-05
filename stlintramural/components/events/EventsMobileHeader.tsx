import Image from "next/image";
import StlLogo from "@/components/StlLogo";
import MaterialSymbol from "@/components/events/MaterialSymbol";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBmBvLOXuORsKoGUPNLCb2-6aT_ScMgB9bbcrW5ZORSX0WjO8LgNbEyrHK0RMRtrlcv-fen0DRbOi8eBzr5tsTfb_H6fAllSiU7pGLSGA1yJ1Y8lBMp5iptgFAUnuRGVsTyhM2YOhsuVnF2-kPiYthm6AOidpp7bKvl4rCG4JkXkm0OeE0SwipW06AupaJXV0fFH-5DS86ZGBwaX1BisZDOxUqrWGYcTXED0keX_C10ldMwbW314N0LczU-hDCvUfqPifDn_7zQ47s";

export default function EventsMobileHeader() {
  return (
    <header className="bg-surface dark:bg-on-surface border-b-4 border-primary dark:border-primary-container sticky top-0 z-50 lg:hidden flex justify-between items-center px-margin py-base w-full max-w-7xl mx-auto h-[64px]">
      <StlLogo
        href="/"
        size="sm"
        showWordmark
        wordmarkClassName="font-black tracking-tighter dark:text-inverse-primary"
      />

      <div className="flex items-center gap-sm">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-primary-container/10 dark:hover:bg-primary-container/20 transition-colors"
          aria-label="Notifications"
        >
          <MaterialSymbol
            icon="notifications"
            className="text-primary dark:text-inverse-primary"
          />
        </button>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-primary-container/10 dark:hover:bg-primary-container/20 transition-colors"
          aria-label="Search"
        >
          <MaterialSymbol
            icon="search"
            className="text-primary dark:text-inverse-primary"
          />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant relative">
          <Image
            src={PROFILE_IMAGE}
            alt="User profile"
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      </div>
    </header>
  );
}
