import type { Metadata } from "next";
import StlLogo from "@/components/StlLogo";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Unavailable in Your Region",
  description:
    "STL Intramural is only available in the United States and Canada.",
  path: "/geo-blocked",
  noIndex: true,
});

export default function GeoBlockedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-6 py-16 text-center font-body-md text-on-surface">
      <StlLogo className="mb-8 h-12 w-auto" />
      <h1 className="font-display text-4xl text-primary">Region Not Supported</h1>
      <p className="mt-4 max-w-md text-on-surface-variant">
        STL Intramural is only available in the United States and Canada.
      </p>
    </div>
  );
}
