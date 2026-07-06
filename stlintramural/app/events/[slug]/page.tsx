import type { Metadata } from "next";
import EventDetailNotFound from "@/components/events/detail/EventDetailNotFound";
import EventDetailView from "@/components/events/detail/EventDetailView";
import AppShell from "@/components/layout/AppShell";
import JsonLd from "@/components/seo/JsonLd";
import {
  getEventDetailBySlug,
  getRelatedEvents,
} from "@/lib/server/event-detail";
import { fetchEventSlugs } from "@/lib/queries/events";
import { createPageMetadata, getSiteUrl } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const slugs = await fetchEventSlugs(supabase);
    return slugs.map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventDetailBySlug(slug);

  if (!event) {
    return createPageMetadata({
      title: "Event Not Found",
      description: "This intramural event could not be found.",
      path: `/events/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: event.title,
    description: event.description,
    path: `/events/${slug}`,
    image: event.imageUrl,
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventDetailBySlug(slug);
  const related = event ? await getRelatedEvents(slug) : [];
  const siteUrl = getSiteUrl();

  return (
    <>
      {event ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: event.title,
            description: event.description,
            url: `${siteUrl}/events/${event.slug}`,
            image: event.imageUrl,
            location: {
              "@type": "Place",
              name: event.location,
            },
            sport: event.sport,
            eventStatus: "https://schema.org/EventScheduled",
            organizer: {
              "@type": "Organization",
              name: event.host.name,
            },
          }}
        />
      ) : null}

      <AppShell>
        {event ? (
          <EventDetailView event={event} related={related} />
        ) : (
          <EventDetailNotFound slug={slug} />
        )}
      </AppShell>
    </>
  );
}
