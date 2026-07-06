import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/settings", "/qrcode", "/scan"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
