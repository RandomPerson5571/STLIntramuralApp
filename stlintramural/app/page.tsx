import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata, getSiteUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
    description:
      "Track points, check in to games, climb the leaderboard, and redeem rewards.",
    path: "/",
  }),
};

export default function HomePage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: SITE_NAME,
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
            },
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: siteUrl,
              description:
                "Track points, check in to games, climb the leaderboard, and redeem rewards.",
            },
          ],
        }}
      />
      <LandingPage />
    </>
  );
}
