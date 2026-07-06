import type { MetadataRoute } from "next";
import { fetchEventSlugs } from "@/lib/queries/events";
import { getSiteUrl } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/events`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/leaderboard`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let eventSlugs: { slug: string; updated_at: string | null }[] = [];

  try {
    const supabase = await createClient();
    eventSlugs = await fetchEventSlugs(supabase);
  } catch {
    // ponytail: static fallback when Supabase is unavailable at build time
  }

  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((row) => ({
    url: `${siteUrl}/events/${row.slug}`,
    lastModified: row.updated_at ? new Date(row.updated_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...eventRoutes];
}
